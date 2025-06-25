import { OneLineGroupElement } from "@/elements/index"
import * as t from "../parser/lexer"
import { IFormatter } from "./formFormatter"
import { FormFormatterFactory } from "./formatterFactory"

export class OneLineGroupFormatter implements IFormatter<OneLineGroupElement> {
  public format(element: OneLineGroupElement): string[] {
    const separatorSymbol = t.Ampersand.LABEL as string
    const separator = " " + separatorSymbol + " "

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.formatSingleLine(element)

    let result: string[] = []
    result.push(...properties)

    if (element.items.length === 0) {
      //&
      result.push(separatorSymbol)
      return result
    }

    let groupItems: string[][] = []

    let isFirst = true
    for (const item of element.items) {
      groupItems.push(FormFormatterFactory.getFormatter(item).format(item, { addIndent: isFirst }))
      isFirst = false
    }

    let resultLine = groupItems.join(separator)

    if (element.items.length === 1) {
      //Element &
      resultLine += " " + separatorSymbol
    }

    result.push(resultLine)

    return result
  }
}
