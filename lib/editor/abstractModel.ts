import { instanceToPlain } from "class-transformer"
import { GroupVisitor } from "../parser/groupVisitor"
import { lexer } from "../parser/lexer"
import { parser } from "../parser/parser"
import { Visitor } from "../parser/visitor"
import { SemanticTokensManager } from "../parser/visitorTools/sematicTokensManager"
import { FormFormatterFactory } from "../formatter/formatterFactory"
// import * as monaco from "monaco-editor-core"
import { CstNode } from "chevrotain"
import { BaseElement } from "../elements/baseElement"
import { CstPath } from "../elements/cstPathHelper"
import { FormElement } from "../elements/formElement"
import { TableElement } from "../elements/tableElement"
import { ElementPathData } from "../elementPathData"

export abstract class AbstractModel<T extends BaseElement> {
  private readonly semanticTokensManager: SemanticTokensManager = new SemanticTokensManager()

  private readonly visitor: Visitor
  private readonly groupVisitor: GroupVisitor
  private text: string = ""

  protected readonly elementMap: Map<string, BaseElement> = new Map()
  private line: number = 0
  private column: number = 0

  protected cst: T = new FormElement() as unknown as T

  constructor() {
    this.visitor = new Visitor(this.semanticTokensManager)
    this.groupVisitor = new GroupVisitor()
  }

  public abstract onChangeContent: (content: string) => void
  protected abstract parse(): CstNode

  public format(): void {
    const formatted = FormFormatterFactory.getFormatter(this.cst).format(this.cst)
    this.setText(formatted.join("\n"))
    this.onChangeContent(this.getText())
  }

  public setSemanicTree(element: T) {
    this.cst = element
    this.format()
  }

  public getSemanicTree(): T {
    return this.cst
  }

  public getCurrentElement(): BaseElement {
    const token = this.semanticTokensManager.getAtPosition(this.line, this.column)
    if (!token) return this.cst

    return token.element
  }

  public getCurrentElementPathData(): ElementPathData {
    const element = this.getCurrentElement()
    const path = element.getCstPath()
    return new ElementPathData(element, path, false)
  }

  public getNearestContainer(current: BaseElement): BaseElement {
    let element: BaseElement | undefined = current
    while (element) {
      if (element.isContainer) {
        return element
      }

      element = element.parent
    }
    return this.cst
  }

  getCurrentTableElement(): TableElement | undefined {
    let element: BaseElement | undefined = this.getCurrentElement()
    while (element) {
      if (element instanceof TableElement) return element
      element = element.parent
    }
    return undefined
  }

  findElementByCstPath(path: CstPath): BaseElement | undefined {
    return this.cst.findElementByCstPath(path)
  }

  public setText(text: string): void {
    if (this.text == text) {
      return
    }

    this.text = text
    this.build()
  }

  public getText(): string {
    return this.text
  }

  public getCursor() {
    return { line: this.line, column: this.column }
  }

  public getDecorations(): any {
    return this.semanticTokensManager.getDecorations()
  }

  public getLinks(): any {
    return this.semanticTokensManager.getLinks()
  }

  public setCursor(line: number, column: number): void {
    this.line = line
    this.column = column
  }

  public getProduction(): any {
    return instanceToPlain(this.cst, { groups: ["production"], strategy: "excludeAll" })
  }

  private build(): void {
    this.elementMap.clear()

    const lexingResult = lexer.tokenize(this.text)

    parser.input = lexingResult.tokens

    this.semanticTokensManager.reset()

    const groupsAST = this.parse()
    const fullAST = this.groupVisitor.visit(groupsAST)
    this.cst = this.visitor.visit(fullAST)
    this.fillElementMap(this.cst)
  }

  private fillElementMap(element: BaseElement) {
    this.elementMap.set(element.elementId, element)
    for (let childrenField of (element.constructor as typeof BaseElement).childrenFields) {
      let items = (element as any)[childrenField]
      for (let subItem of items) {
        this.fillElementMap(subItem)
      }
    }
  }
}
