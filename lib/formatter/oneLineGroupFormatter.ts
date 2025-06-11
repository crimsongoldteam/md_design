import * as t from "../parser/lexer"

import { OneLineGroupElement } from "../parser/visitorTools/formElements"
import { IFormatter } from "./formFormatter"
import { FormFormatterFactory } from "./formatterFactory"

export class OneLineGroupFormatter implements IFormatter<OneLineGroupElement> {
  public format(element: OneLineGroupElement): string[] {
    const separator = " " + (t.Ampersand.LABEL as string) + " "

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element)

    let result: string[] = []
    result.push(...properties)

    let groupItems: string[][] = []
    let isFirst = true
    for (const item of element.items) {
      groupItems.push(FormFormatterFactory.getFormatter(item).format(item, { addIndent: isFirst }))
      isFirst = false
    }

    result.push(groupItems.join(separator))

    return result
  }
}
