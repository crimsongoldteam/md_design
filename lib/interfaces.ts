import { IEditorWrapper, IElementPathData, IModelCursor } from "./editor/interfaces"
import { IBaseElement } from "./elements/interfaces"

export interface IApplication {
  onChangeContent: (cst: IBaseElement) => void
  onSelectElement: (currentElement: IElementPathData | undefined) => void

  getText(): string
  setText(text: string): void
  insertText(text: string): void
  formatText(): void
  getTableData(): IElementPathData
  getNewValue(type: string): IBaseElement
  createOrUpdateElement(data: IElementPathData): void
  getCst(): IBaseElement
}

export interface IView {
  get currentEditor(): IEditorWrapper
  get currentCursor(): IModelCursor

  onCloseGroup: () => void
  onSelectGroup: (group: IElementPathData) => void
}

export interface IEnterpriseConnector {
  formatText(): void
  setText(text: string): void
  getText(): string
  insertText(text: string): void
  getNewValue(type: string): string | undefined
  createOrUpdateElement(plainText: string): void
  getTable(): string
}

// EVENT_SELECT_ELEMENT
export interface IEnterpriseConnectorSelectElementEvent {
  element?: string
}

//EVENT_CHANGE_CONTENT
export interface IEnterpriseConnectorChangeContentEvent {
  text: string
  cst?: string
}
