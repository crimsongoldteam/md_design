import { IApplication, IEnterpriseConnector } from "./interfaces"
import { Exporter } from "./exporter/exporter"
import { Importer } from "./importer/importer"
import { IElementPathData } from "./editor/interfaces"
import { IBaseElement } from "./elements/interfaces"

export class EnterpriseConnector implements IEnterpriseConnector {
  private readonly application: IApplication

  constructor(application: IApplication) {
    this.application = application
    this.application.onChangeContent = this.onChangeContent.bind(this)
    this.application.onChangeCurrentElement = this.onChangeCurrentElement.bind(this)
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

  private onChangeCurrentElement(currentElement: IElementPathData | undefined): void {
    const result = {
      currentElement: Exporter.export(currentElement),
    }
    this.sendEvent("EVENT_CHANGE_CURRENT_ELEMENT", result)
  }

  private onChangeContent(): void {
    this.changeCST({
      text: this.application.getText(),
      semanticsTree: this.application.getCst(),
      selectionHierarchy: [],
    })
  }

  private changeCST(params: { text: string; semanticsTree: IBaseElement; selectionHierarchy: string[] }): void {
    const result = {
      text: params.text,
      semanticsTree: JSON.stringify(params.semanticsTree, null, 2),
      selectionHierarchy: JSON.stringify(params.selectionHierarchy),
    }

    this.sendEvent("EVENT_CHANGE_CONTENT", result)
  }

  private sendEvent(eventName: string, eventParams: any): void {
    let lastEvent = new MouseEvent("click")

    ;(lastEvent as any).eventData1C = { event: eventName, params: eventParams }

    dispatchEvent(lastEvent)
  }
}

// public setValues(plainText: string): void {
//   const plainObject = JSON.parse(plainText)
//   const data: ValueData = plainToInstance(ValueData, plainObject)
//   this.application.setValues(data)
// }

// private onChangeContent(): void {
//   this.changeCST({
//     text: this.application.getText(),
//     // semanticsTree: this.application.getProduction(),
//     selectionHierarchy: [],
//   })

// private onChangeCurrentElement(currentElement: ElementPathData | undefined): void {
//   const result = {
//     currentElement: Exporter.export(currentElement),
//   }
//   this.sendEvent("EVENT_CHANGE_CURRENT_ELEMENT", result)
// }

// private changeCST(params: { text: string; semanticsTree: BaseElement; selectionHierarchy: string[] }): void {
//   const result = {
//     text: params.text,
//     semanticsTree: JSON.stringify(params.semanticsTree, null, 2),
//     selectionHierarchy: JSON.stringify(params.selectionHierarchy),
//   }

//   this.sendEvent("EVENT_CHANGE_CONTENT", result)
// }
