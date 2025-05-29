import { BaseFormElement } from "./parser/visitorTools/formElements"

export class EnterpriseConnector {
  public changeSelectionHierarchy(params: { line: number; column: number; selectionHierarchy: string[] }): void {
    const result = {
      line: params.line,
      column: params.column,
      selectionHierarchy: JSON.stringify(params.selectionHierarchy),
    }
    this.sendEvent("EVENT_CHANGE_CURSOR_SELECTION", result)
  }

  public changeCST(params: { text: string; semanticsTree: BaseFormElement; selectionHierarchy: string[] }): void {
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
