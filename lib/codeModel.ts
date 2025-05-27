import { instanceToPlain } from "class-transformer"
import { GroupVisitor } from "./parser/groupVisitor"
import { lexer } from "./parser/lexer"
import { parser } from "./parser/parser"
import { Visitor } from "./parser/visitor"
import { BaseFormElement, FormElement } from "./parser/visitorTools/formElements"
export class CodeModel {
  private readonly visitor: Visitor
  private readonly groupVisitor: GroupVisitor
  private text: string = ""
  private cst: BaseFormElement = new FormElement()
  private listeners: { [event: string]: ((...args: any[]) => void)[] } = {}
  private hierarchy: string[] = []
  private line: number = 0
  private column: number = 0

  constructor() {
    this.visitor = new Visitor()
    this.groupVisitor = new GroupVisitor()
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(listener)
  }

  public emit(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(...args))
    }
  }

  public setText(text: string): void {
    if (this.text == text) {
      return
    }

    this.text = text
    this.build()
  }

  getText(): string {
    return this.text
  }

  getCursor() {
    return { line: this.line, column: this.column }
  }

  public setCursor(line: number, column: number): void {
    this.line = line
    this.column = column

    this.hierarchy = []
    this.addElementAtLocation(this.hierarchy, this.cst, line, column)

    this.emit("PositionChange", this.hierarchy)
  }

  public getProduction(): any {
    return instanceToPlain(this.cst, { groups: ["production"] })
    // return
  }

  public getSelectionHierarchy(): string[] {
    return this.hierarchy
  }

  private addElementAtLocation(result: string[], currentItem: BaseFormElement, row: number, column: number): boolean {
    const currentRow = currentItem.location.get(row)
    if (!currentRow) {
      return false
    }

    if (column < currentRow.left || column > currentRow.right) {
      return false
    }

    result.push(currentItem.uuid)

    for (let childrenField of currentItem.childrenFields) {
      let items = (currentItem as any)[childrenField]
      for (let subItem of items) {
        if (this.addElementAtLocation(result, subItem, row, column)) {
          return true
        }
      }
    }

    return true
  }

  private build(): void {
    const lexingResult = lexer.tokenize(this.text)

    parser.input = lexingResult.tokens

    const groupsAST = parser.parse()
    const fullAST = this.groupVisitor.visit(groupsAST)
    this.cst = this.visitor.visit(fullAST)
    this.emit("CSTChange", this.cst)
  }
}
