import { TableElement } from "@/elements"
import { CstPath } from "@/elements/cstPathHelper"
import { ICSTModel, IModelCursor, ICursorBuilder, ICursorFormatter, IPosition, IElementPathData } from "./interfaces"
import { SemanticTokensManager } from "@/parser/visitorTools/sematicTokensManager"
import { IBaseElement } from "@/elements/interfaces"
import { ElementPathData } from "@/elementPathData"

export class ModelCursor implements IModelCursor {
  private readonly _model: ICSTModel
  private _path: CstPath = []
  private _text: string = ""
  private _semanticTokensManager: SemanticTokensManager = new SemanticTokensManager()
  private readonly builder: ICursorBuilder
  private readonly formatter: ICursorFormatter
  private _position: IPosition = { line: 0, column: 0 }

  constructor(model: ICSTModel, builder: ICursorBuilder, formatter: ICursorFormatter) {
    this._model = model
    this.builder = builder
    this.formatter = formatter
  }
  // region events

  public onRegisterCursor?: () => void
  public onUnregisterCursor?: () => void
  public onChangeText?: (text: string) => void
  public onSelectElement?: (currentElement: IElementPathData | undefined) => void

  // endregion events

  public setSemanticTokensManager(value: SemanticTokensManager): void {
    this._semanticTokensManager = value
  }

  public getCst(): IBaseElement | undefined {
    return this._model.getElement(this.path)
  }

  public setCst(value: IBaseElement) {
    this._model.createOrUpdateElement({
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
    this.onSelectElement?.(this.getCurrentElementData())
  }

  getPosition(): IPosition {
    return this._position
  }

  get model(): ICSTModel {
    return this._model
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
    this.setText(text, false)
  }

  public getCurrentElement(): IBaseElement {
    return this.getElementAtPosition(this._position)
  }

  getElementDataAtPosition(position: IPosition): IElementPathData {
    const element = this.getElementAtPosition(position)
    const path = element.getCstPath()
    return new ElementPathData(element, path, false)
  }

  getCurrentElementData(): IElementPathData {
    return this.getElementDataAtPosition(this._position)
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

    const text = this.formatter.format(cst)
    this.setText(text, true)
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

  // region private methods

  private setText(text: string, stopPropagation: boolean = false): void {
    const isChanged = this._text !== text
    if (!isChanged) return

    this._text = text
    this.build(text)
    this.model.afterUpdate({ excludeCursor: this, stopPropagation: stopPropagation })

    this.onChangeText?.(text)
  }

  private build(text: string) {
    this.builder.build(text, this)
  }

  private getElementAtPosition(position: IPosition): IBaseElement {
    const token = this._semanticTokensManager.getAtPosition(position.line, position.column)
    if (!token) {
      const cst = this.getCst()
      if (!cst) throw new Error("CST not found")
      return cst
    }

    return token.element
  }
  // endregion private methods
}
