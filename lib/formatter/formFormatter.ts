import { BaseElement, FormElement } from "../elements/index"
import trimEnd from "@ungap/trim-end"
import * as t from "../parser/lexer"
import { FormFormatterFactory } from "./formatterFactory"
import { InlineItemsFormatterUtils } from "./inlineItemsFormatterUtils"

export interface IFormatter<T extends BaseElement> {
  format(element: T, params?: any): string[]
}

export class FormFormatter implements IFormatter<FormElement> {
  public format(element: FormElement): string[] {
    const result: string[] = []

    let header = element.properties.get("Заголовок")

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter
      .format(element, {
        excludeProperties: ["Заголовок"],
      })
      .join("")

    if (header || properties) {
      const dashes = (t.Dashes.LABEL as string).repeat(3)
      header = dashes + " " + header + " " + dashes + properties
      result.push(header)
    }

    result.push(...InlineItemsFormatterUtils.format(element.items))

    result.forEach((item, index) => {
      result[index] = trimEnd.call(item, "")
    })

    return result
  }
}
