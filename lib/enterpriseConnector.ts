import { Application } from "./application"
import { BaseElement } from "./elements/baseElement"

export class EnterpriseConnector {
  private readonly application: Application

  constructor(application: Application) {
    this.application = application
    this.application.onChangeContent = this.onChangeContent.bind(this)
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

  private onChangeContent(): void {
    this.changeCST({
      text: this.application.getText(),
      semanticsTree: this.application.getProduction(),
      selectionHierarchy: [],
    })
  }

  private changeSelectionHierarchy(params: { line: number; column: number; selectionHierarchy: string[] }): void {
    const result = {
      line: params.line,
      column: params.column,
      selectionHierarchy: JSON.stringify(params.selectionHierarchy),
    }
    this.sendEvent("EVENT_CHANGE_CURSOR_SELECTION", result)
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
