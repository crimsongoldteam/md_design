import { PagesElement } from "@/parser/visitorTools/formElements"
import { IFormatter } from "./formFormatter"
import { PropertiesFormatter } from "./propertiesFormatter"
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
