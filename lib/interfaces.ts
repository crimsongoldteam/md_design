import { IMetadata, ITypeDescriptionDetectorRequest, TypeDescriptionDetectorResult } from "./ai/interfaces"
import { IEditorWrapper, IElementPathData, IModelCursor } from "./editor/interfaces"
import { IAttributes, IBaseElement, ITypeDescription } from "./elements/interfaces"

export interface IApplication {
  onChangeContent: (cst: IBaseElement, attributes: IAttributes) => void
  onSelectElement: (currentElement: IElementPathData | undefined) => void

  getText(): string
  setText(text: string): void
  insertText(text: string): void
  formatText(): void
  getTableData(): IElementPathData
  getNewValue(type: string): IBaseElement
  createOrUpdateElement(data: IElementPathData): void
  getCst(): IBaseElement
  formatTypeDescription(typeDescription: ITypeDescription): string
  parseTypeDescription(text: string): ITypeDescription

  addMetadata(metadata: IMetadata[]): void
  searchTypeInMetadata(requests: ITypeDescriptionDetectorRequest[]): TypeDescriptionDetectorResult
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
  formatTypeDescription(typeDescription: string): string
  parseTypeDescription(text: string): string | undefined

  addMetadata(plainText: string): void
  searchTypeInMetadata(plainText: string): string
}

// EVENT_SELECT_ELEMENT
export interface IEnterpriseConnectorSelectElementEvent {
  element?: string
}

export interface IEnterpriseConnectorChangeContentData {
  cst: IBaseElement | undefined
  attributes: IAttributes
}

//EVENT_CHANGE_CONTENT
export interface IEnterpriseConnectorChangeContentEvent {
  text: string
  data: string
}
