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

export interface ICSTModel {
  get cst(): IBaseElement

  getElement(path: CstPath): IBaseElement | undefined
  createOrUpdateElement(data: IElementPathData, source?: IModelCursor): void

  getPathByElementId(id: string): CstPath | undefined

  registerCursor(cursor: IModelCursor): void
  unregisterCursor(cursor: IModelCursor): void
}

export interface IEditorWrapper {
  insertText(text: string): void
  isEditorModel(model: monaco.editor.ITextModel): boolean

  onSelectGroup: (group: IElementPathData) => void
}

export interface ICursorFormatter {
  format(element: IBaseElement): string
}

export interface ICursorBuilder {
  build(
    text: string,
    cursor: IModelCursor
  ): {
    element: IBaseElement
    semanticTokensManager: SemanticTokensManager
  }
}

export interface IPosition {
  line: number
  column: number
}

export interface IModelCursor {
  getCst(): IBaseElement | undefined
  setCst(value: IBaseElement): void

  get path(): CstPath
  set path(value: CstPath)

  get text(): string
  set text(value: string)

  get decorations(): any
  get links(): any

  setPosition(position: IPosition): void
  getPosition(): IPosition

  getCurrentElement(): IBaseElement
  getCurrentElementData(): IElementPathData

  getCurrentTableElement(): TableElement | undefined

  format(): void

  onChangeContent: (cst: IBaseElement) => void

  isConnected(): boolean

  onRegisterCursor?: () => void
  onUnregisterCursor?: () => void
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
