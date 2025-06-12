import { EditorContainerElement } from "../parser/visitorTools/formElements"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"

export class EditorContainerFormatter implements IFormatter<EditorContainerElement> {
  public format(element: EditorContainerElement): string[] {
    const result: string[] = []

    for (const item of element.items) {
      result.push(...FormFormatterFactory.getFormatter(item).format(item))
    }
    return result
  }
}
