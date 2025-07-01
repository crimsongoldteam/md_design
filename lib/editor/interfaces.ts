import { CstPath } from "@/elements/cstPathHelper"
import { SemanticTokensManager } from "@/parser/visitorTools/sematicTokensManager"
import { IBaseElement } from "@/elements/interfaces"
import * as monaco from "monaco-editor-core"
import { TableElement } from "@/elements"

export interface IElementPathData {
  path: CstPath
  item: IBaseElement
  isNew: boolean
}

export interface IAfterUpdateParams {
  excludeCursor?: IModelCursor
  stopPropagation?: boolean
}

export interface ICSTModel {
  onChangeContent?: (cst: IBaseElement | undefined) => void

  get cst(): IBaseElement
  set cst(value: IBaseElement)

  getElement(path: CstPath): IBaseElement | undefined
  createOrUpdateElement(data: IElementPathData, source?: IModelCursor): void

  getPathByElementId(id: string): CstPath | undefined

  registerCursor(cursor: IModelCursor): void
  unregisterCursor(cursor: IModelCursor): void
  afterUpdate(params: IAfterUpdateParams): void
}

export interface IEditorWrapper {
  get cursor(): IModelCursor

  insertText(text: string): void
  isEditorModel(model: monaco.editor.ITextModel): boolean

  onSelectGroup: (group: IElementPathData) => void
}

export interface ICursorFormatter {
  format(element: IBaseElement): string
}

export interface ICursorBuilder {
  build(text: string, cursor: IModelCursor): void
}

export interface IPosition {
  line: number
  column: number
}

export interface IModelCursor {
  //#region getters and setters

  get model(): ICSTModel

  get path(): CstPath
  set path(value: CstPath)

  get text(): string
  set text(value: string)

  get decorations(): any
  get links(): any

  //#endregion getters and setters

  //#region events

  onRegisterCursor?: () => void
  onUnregisterCursor?: () => void
  onSelectElement?: (currentElement: IElementPathData | undefined) => void
  onChangeText?: (text: string, canUndo: boolean) => void

  //#endregion events

  getCst(): IBaseElement | undefined
  setCst(value: IBaseElement): void

  setSemanticTokensManager(value: SemanticTokensManager): void

  setPosition(position: IPosition): void
  getPosition(): IPosition

  getElementDataAtPosition(position: IPosition): IElementPathData
  getCurrentElement(): IBaseElement
  getCurrentElementData(): IElementPathData

  getCurrentTableElement(): TableElement | undefined

  format(canUndo: boolean): void

  isConnected(): boolean
}

export interface TableValueData {
  items: TableValueData[]
  data: { [key: string]: string | boolean | number }
}

export interface ValueData {
  [key: string]: string | boolean | number | Date | TableValueData
}
export interface IBuildResult {
  element: IBaseElement
  semanticTokensManager: SemanticTokensManager
}
