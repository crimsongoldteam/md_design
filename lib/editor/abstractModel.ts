import { instanceToPlain } from "class-transformer"
import { GroupVisitor } from "../parser/groupVisitor"
import { lexer } from "../parser/lexer"
import { parser } from "../parser/parser"
import { Visitor } from "../parser/visitor"
import { SemanticTokensManager } from "../parser/visitorTools/sematicTokensManager"
import { FormFormatterFactory } from "../formatter/formatterFactory"
import * as monaco from "monaco-editor-core"
import { CstNode } from "chevrotain"
import { BaseElement, CstPath } from "../elements/baseElement"
import { FormElement } from "../elements/formElement"
import { TableContainerElement } from "../elements/tableContainerElement"
import { VerticalGroupElement } from "../elements/verticalGroupElement"
import { PageElement } from "../elements/pageElement"
import { EditorContainerElement } from "../elements/editorContainerElement"
import { TableElement } from "../elements/tableElement"

export abstract class AbstractModel<T extends BaseElement> {
  private readonly semanticTokensManager: SemanticTokensManager = new SemanticTokensManager()

  private readonly visitor: Visitor
  private readonly groupVisitor: GroupVisitor
  private text: string = ""

  private readonly elementMap: Map<string, BaseElement> = new Map()
  private hierarchy: string[] = []
  private line: number = 0
  private column: number = 0

  private cst: T = new FormElement() as unknown as T

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

  getCurrentElement(): BaseElement | undefined {
    const token = this.semanticTokensManager.getAtPosition(this.line, this.column)
    if (!token) return undefined

    return token.element
  }

  getCurrentTableContainerElement(): TableContainerElement | undefined {
    let element = this.getCurrentElement()
    while (element) {
      if (
        element instanceof FormElement ||
        element instanceof PageElement ||
        element instanceof VerticalGroupElement ||
        element instanceof EditorContainerElement
      ) {
        return element as TableContainerElement
      }
      element = element.parent
    }
    return undefined
  }

  getCurrentTableElement(): TableElement | undefined {
    let element = this.getCurrentElement()
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

  public getLinks(): monaco.languages.ILinksList {
    return this.semanticTokensManager.getLinks()
  }

  public setCursor(line: number, column: number): void {
    this.line = line
    this.column = column
  }

  public getProduction(): any {
    return instanceToPlain(this.cst, { groups: ["production"] })
  }

  public getSelectionHierarchy(): string[] {
    return this.hierarchy
  }

  private build(): void {
    this.elementMap.clear()

    const lexingResult = lexer.tokenize(this.text)

    parser.input = lexingResult.tokens

    this.semanticTokensManager.reset()

    // const groupsAST = parser.parseForm()
    const groupsAST = this.parse()
    const fullAST = this.groupVisitor.visit(groupsAST)
    this.cst = this.visitor.visit(fullAST)
    this.fillElementMap(this.cst)
  }

  private fillElementMap(element: BaseElement) {
    this.elementMap.set(element.id, element)
    for (let childrenField of (element.constructor as typeof BaseElement).childrenFields) {
      let items = (element as any)[childrenField]
      for (let subItem of items) {
        this.fillElementMap(subItem)
      }
    }
  }
}
