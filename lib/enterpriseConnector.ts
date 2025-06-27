import { IApplication, IEnterpriseConnector } from "./interfaces"
import { Exporter } from "./exporter/exporter"
import { Importer } from "./importer/importer"
import { IElementPathData } from "./editor/interfaces"

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
    const result = {
      currentElement: Exporter.export(currentElement),
    }
    this.sendEvent("EVENT_CHANGE_CURRENT_ELEMENT", result)
  }

  private onChangeContent(): void {
    const result = {
      text: this.application.getText(),
      semanticsTree: JSON.stringify(this.application.getCst(), null, 2),
      selectionHierarchy: JSON.stringify([]),
    }

    this.sendEvent("EVENT_CHANGE_CONTENT", result)
  }

  private sendEvent(eventName: string, eventParams: any): void {
    let lastEvent = new MouseEvent("click")

    ;(lastEvent as any).eventData1C = { event: eventName, params: eventParams }

    dispatchEvent(lastEvent)
  }
}
