import { TableElement } from "@/elements"
import { CstPath } from "@/elements/cstPathHelper"
import { ICSTModel, IModelCursor, ICursorBuilder, ICursorFormatter, IPosition, IElementPathData } from "./interfaces"
import { SemanticTokensManager } from "@/parser/visitorTools/sematicTokensManager"
import { IBaseElement } from "@/elements/interfaces"
import { ElementPathData } from "@/elementPathData"

export class ModelCursor implements IModelCursor {
  private readonly model: ICSTModel
  private _path: CstPath = []
  private _text: string = ""
  private _semanticTokensManager: SemanticTokensManager = new SemanticTokensManager()
  private readonly builder: ICursorBuilder
  private readonly formatter: ICursorFormatter
  private _position: IPosition = { line: 0, column: 0 }

  constructor(model: ICSTModel, builder: ICursorBuilder, formatter: ICursorFormatter) {
    this.model = model
    this.builder = builder
    this.formatter = formatter
  }

  public onRegisterCursor?: () => void
  public onUnregisterCursor?: () => void

  public onChangeContent: (cst: IBaseElement) => void = () => {
    // throw new Error("onChangeContent is not implemented")
  }

  public getCst(): IBaseElement | undefined {
    return this.model.getElement(this.path)
  }

  public setCst(value: IBaseElement) {
    this.model.createOrUpdateElement({
      path: this.path,
      item: value,
      isNew: false,
    })
  }

  isConnected(): boolean {
    return this.getCst() !== undefined
  }

  setPosition(position: IPosition): void {
    this._position = position
  }
  getPosition(): IPosition {
    return this._position
  }

  get path(): CstPath {
    return this._path
  }

  set path(value: CstPath) {
    this._path = value
    this.format()
  }

  get text(): string {
    return this._text
  }

  set text(text: string) {
    this._text = text
    this.build(text)
  }

  public getCurrentElement(): IBaseElement {
    const token = this._semanticTokensManager.getAtPosition(this._position.line, this._position.column)
    if (!token) {
      const cst = this.getCst()
      if (!cst) throw new Error("CST not found")
      return cst
    }

    return token.element
  }

  // public setElementData(data: IElementPathData): void {
  //   this.path = data.path
  // }

  getCurrentElementData(): IElementPathData {
    const element = this.getCurrentElement()
    const path = element.getCstPath()
    return new ElementPathData(element, path, false)
  }

  getCurrentTableElement(): TableElement | undefined {
    let element: IBaseElement | undefined = this.getCurrentElement()
    while (element) {
      if (element instanceof TableElement) return element
      element = element.parent
    }
    return undefined
  }

  format(): void {
    const cst = this.getCst()
    if (!cst) throw new Error("CST not found")
    this._text = this.formatter.format(cst)
  }

  get decorations(): any {
    return this._semanticTokensManager.getDecorations()
  }

  get links(): any {
    return this._semanticTokensManager.getLinks()
  }

  getTableElement(current: IBaseElement): TableElement | undefined {
    let element: IBaseElement | undefined = current
    while (element) {
      if (element instanceof TableElement) return element
      element = element.parent
    }
    return undefined
  }

  private build(text: string) {
    const { element, semanticTokensManager } = this.builder.build(text, this)

    this._semanticTokensManager = semanticTokensManager
    this.model.createOrUpdateElement(
      {
        path: this.path,
        item: element,
        isNew: false,
      },
      this
    )
  }
  //   onChangeContent: (cst: BaseElement) => void
  //   onUnregisterCursor: () => void
}
