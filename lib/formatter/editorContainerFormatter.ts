import { EditorContainerElement } from "../elements/editorContainerElement"
import trimEnd from "@ungap/trim-end"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"

export class EditorContainerFormatter implements IFormatter<EditorContainerElement> {
  public format(element: EditorContainerElement): string[] {
    const result: string[] = []

    for (const item of element.items) {
      const formatted = FormFormatterFactory.getFormatter(item).format(item)
      result.push(...formatted)
    }

    result.forEach((item, index) => {
      result[index] = trimEnd.call(item, "")
    })

    return result
  }
}
