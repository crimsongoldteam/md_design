import { instanceToPlain } from "class-transformer"
import { GroupVisitor } from "./parser/groupVisitor"
import { lexer } from "./parser/lexer"
import { parser } from "./parser/parser"
import { Visitor } from "./parser/visitor"
import { BaseFormElement, FormElement } from "./parser/visitorTools/formElements"
import { SemanticTokensManager } from "./parser/visitorTools/sematicTokensManager"
import { FormFormatterFactory } from "./formatter/formatterFactory"
import * as monaco from "monaco-editor-core"
import { CstNode } from "chevrotain"

export abstract class AbstractModel<T extends BaseFormElement> {
  private readonly semanticTokensManager: SemanticTokensManager = new SemanticTokensManager()

  private readonly visitor: Visitor
  private readonly groupVisitor: GroupVisitor
  private text: string = ""

  private readonly elementMap: Map<string, BaseFormElement> = new Map()
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

  public format(silent: boolean = false): void {
    const formatted = FormFormatterFactory.getFormatter(this.cst).format(this.cst)
    this.setText(formatted.join("\n"))
    // if (!silent) {
    this.onChangeContent(this.getText())
    // }
  }

  public setSemanicTree(element: T) {
    this.cst = element
    this.format()
  }

  public getSemanicTree(): T {
    return this.cst
  }

  getCurrentElement(): BaseFormElement | undefined {
    const token = this.semanticTokensManager.getAtPosition(this.line, this.column)
    if (!token) return undefined

    return token.element
  }

  public getElementByUuid(uuid: string): BaseFormElement | undefined {
    return this.elementMap.get(uuid)
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

    // this.hierarchy = []
    // this.addElementAtLocation(this.hierarchy, this.cst, line, column)

    // this.emit("PositionChange", this.hierarchy)
  }

  public getProduction(): any {
    return instanceToPlain(this.cst, { groups: ["production"] })
  }

  public getSelectionHierarchy(): string[] {
    return this.hierarchy
  }

  // private addElementAtLocation(result: string[], currentItem: BaseFormElement, row: number, column: number): boolean {
  //   const currentRow = currentItem.location.get(row)
  //   if (!currentRow) {
  //     return false
  //   }

  //   if (column < currentRow.left || column > currentRow.right) {
  //     return false
  //   }

  //   result.push(currentItem.uuid)

  //   for (let childrenField of currentItem.childrenFields) {
  //     let items = (currentItem as any)[childrenField]
  //     for (let subItem of items) {
  //       if (this.addElementAtLocation(result, subItem, row, column)) {
  //         return true
  //       }
  //     }
  //   }

  //   return true
  // }

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

  private fillElementMap(element: BaseFormElement) {
    this.elementMap.set(element.uuid, element)
    for (let childrenField of element.childrenFields) {
      let items = (element as any)[childrenField]
      for (let subItem of items) {
        this.fillElementMap(subItem)
      }
    }
  }
}
