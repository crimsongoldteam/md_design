import { instanceToPlain, plainToInstance } from "class-transformer"
import { Application } from "./application"
import { BaseElement, ElementsProperies } from "./elements/baseElement"
import { ValueData } from "./editor/formModel"

export class EnterpriseConnector {
  private readonly application: Application

  constructor(application: Application) {
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

  public setProperties(plainText: string): void {
    const plainObject = JSON.parse(plainText)
    const data: ElementsProperies = plainToInstance(ElementsProperies, plainObject)
    this.application.setProperties(data)
  }

  // public updateElement(): void {
  //   this.application.updateElement()
  // }

  public setValues(plainText: string): void {
    const plainObject = JSON.parse(plainText)
    const data: ValueData = plainToInstance(ValueData, plainObject)
    this.application.setValues(data)
  }

  private onChangeContent(): void {
    this.changeCST({
      text: this.application.getText(),
      semanticsTree: this.application.getProduction(),
      selectionHierarchy: [],
    })
  }

  private onChangeCurrentElement(currentElement: BaseElement | undefined): void {
    const plain = currentElement ? instanceToPlain(currentElement, { groups: ["production"] }) : undefined

    const result = {
      currentElement: JSON.stringify(plain, null, 2),
    }
    this.sendEvent("EVENT_CHANGE_CURRENT_ELEMENT", result)
  }

  private changeCST(params: { text: string; semanticsTree: BaseElement; selectionHierarchy: string[] }): void {
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
