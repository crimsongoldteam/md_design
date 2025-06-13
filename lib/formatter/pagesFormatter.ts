import { PagesElement } from "../elements/pagesElement"
import { IFormatter } from "./formFormatter"
import { FormFormatterFactory } from "./formatterFactory"

export class PagesFormatter implements IFormatter<PagesElement> {
  public format(element: PagesElement): string[] {
    const result: string[] = []

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element)

    if (properties.length > 0) {
      result.push(...properties)
    }

    for (const item of element.items) {
      const text = FormFormatterFactory.getFormatter(item).format(item)
      result.push(...text)
    }

    return result
  }
}
