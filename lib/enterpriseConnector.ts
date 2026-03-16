import {
  IApplication,
  IEnterpriseConnector,
  IEnterpriseConnectorChangeContentData,
  IEnterpriseConnectorChangeContentEvent,
  IEnterpriseConnectorSelectElementEvent,
} from "./interfaces"
import { Exporter } from "./exporter/exporter"
import { Importer } from "./importer/importer"
import { IElementPathData } from "./editor/interfaces"
import type { IAttribute, IBaseElement } from "./elements/interfaces"
import { Expose, Type } from "class-transformer"
import { Attribute } from "./elements/attributes"
import { IMetadata, ITypeDescriptionDetectorRequest } from "./ai/interfaces"

export class EnterpriseConnectorChangeContentData implements IEnterpriseConnectorChangeContentData {
  @Expose({ name: "СемантическоеДерево" })
  cst: IBaseElement | undefined

  @Expose({ name: "Атрибуты" })
  @Type(() => Attribute)
  attributes: IAttribute[]

  constructor(cst: IBaseElement | undefined, attributes: IAttribute[]) {
    this.cst = cst
    this.attributes = attributes
  }
}

export class EnterpriseConnector implements IEnterpriseConnector {
  private readonly application: IApplication

  constructor(application: IApplication) {
    this.application = application
    this.application.onChangeContent = this.onChangeContent.bind(this)
    this.application.onSelectElement = this.onSelectElement.bind(this)
  }

  public formatText(): void {
    this.application.formatText()
  }

  public setText(text: string): void {
    this.application.setText(text)
  }

  public getText(): string {
    return this.application.getText()
  }

  public insertText(text: string): void {
    this.application.insertText(text)
  }

  public getNewValue(type: string): string | undefined {
    const value = this.application.getNewValue(type)
    return Exporter.export(value)
  }

  public getTable(): string {
    const data = this.application.getTableData()
    return Exporter.exportTableData(data)
  }

  public createOrUpdateElement(plainText: string): void {
    const data: IElementPathData = Importer.importElements(plainText)
    this.application.createOrUpdateElement(data)
  }

  public formatTypeDescription(plainText: string): string {
    const typeDescription = Importer.importTypeDescription(plainText)
    return this.application.formatTypeDescription(typeDescription)
  }

  public parseTypeDescription(text: string): string | undefined {
    const description = this.application.parseTypeDescription(text)
    return Exporter.export(description)
  }

  public addMetadata(plainText: string): void {
    const metadata: IMetadata[] = Importer.importMetadata(plainText)
    this.application.addMetadata(metadata)
  }

  public searchTypeInMetadata(plainText: string): string {
    const requests: ITypeDescriptionDetectorRequest[] = Importer.importTypeDescriptionDetectorRequests(plainText)
    const results = this.application.searchTypeInMetadata(requests)
    return Exporter.export(results) || ""
  }

  private onSelectElement(currentElement: IElementPathData | undefined): void {
    const result: IEnterpriseConnectorSelectElementEvent = {
      element: Exporter.export(currentElement),
    }
    this.sendEvent("EVENT_SELECT_ELEMENT", result)
  }

  private onChangeContent(cst: IBaseElement | undefined, attributes: IAttribute[]): void {
    const data = new EnterpriseConnectorChangeContentData(cst, attributes)
    const result: IEnterpriseConnectorChangeContentEvent = {
      text: this.application.getText(),
      data: Exporter.export(data) ?? "",
    }

    this.sendEvent("EVENT_CHANGE_CONTENT", result)
  }

  private sendEvent(eventName: string, eventParams: any): void {
    let lastEvent = new MouseEvent("click")

    ;(lastEvent as any).eventData1C = { event: eventName, params: eventParams }

    dispatchEvent(lastEvent)
  }
}
