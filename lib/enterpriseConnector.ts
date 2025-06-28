import {
  IApplication,
  IEnterpriseConnector,
  IEnterpriseConnectorChangeContentEvent,
  IEnterpriseConnectorSelectElementEvent,
} from "./interfaces"
import { Exporter } from "./exporter/exporter"
import { Importer } from "./importer/importer"
import { IElementPathData } from "./editor/interfaces"
import { IBaseElement } from "./elements/interfaces"

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
    const data: IElementPathData = Importer.import(plainText)
    this.application.createOrUpdateElement(data)
  }

  private onSelectElement(currentElement: IElementPathData | undefined): void {
    const result: IEnterpriseConnectorSelectElementEvent = {
      element: Exporter.export(currentElement),
    }
    this.sendEvent("EVENT_SELECT_ELEMENT", result)
  }

  private onChangeContent(cst: IBaseElement | undefined): void {
    const result: IEnterpriseConnectorChangeContentEvent = {
      text: this.application.getText(),
      cst: Exporter.export(cst),
    }

    this.sendEvent("EVENT_CHANGE_CONTENT", result)
  }

  private sendEvent(eventName: string, eventParams: any): void {
    let lastEvent = new MouseEvent("click")

    ;(lastEvent as any).eventData1C = { event: eventName, params: eventParams }

    dispatchEvent(lastEvent)
  }
}
