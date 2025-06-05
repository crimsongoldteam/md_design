import * as t from "../parser/lexer"

import { HorizontalGroupElement } from "../parser/visitorTools/formElements"
import { IFormatter } from "./formFormatter"
import { FormFormatterFactory } from "./formatterFactory"

export class HorizontalGroupFormatter implements IFormatter<HorizontalGroupElement> {
  public format(element: HorizontalGroupElement): string[] {
    const firstLineSeparator = " " + (t.Hash.LABEL as string)
    const separator = " " + (t.Plus.LABEL as string)

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element)

    let result: string[] = []
    result.push(...properties)

    let verticalGroups: string[][] = []
    let isFirst = true
    for (const verticalGroup of element.items) {
      verticalGroups.push(
        FormFormatterFactory.getFormatter(verticalGroup).format(verticalGroup, { addIndent: isFirst })
      )
      isFirst = false
    }

    let rows = this.mergeHorizontally(firstLineSeparator, separator, ...verticalGroups)
    result.push(...rows)

    return result
  }

  private mergeHorizontally(firstLineSeparator: string, separator: string, ...arrays: string[][]): string[] {
    const maxLength = Math.max(...arrays.map((arr) => arr.length))

    const arrayWidths = arrays.map((arr) => (arr.length > 0 ? arr[0].length : 0))

    const result: string[] = []

    for (let rowIndex = 0; rowIndex < maxLength; rowIndex++) {
      let mergedRow = ""
      const currentSeparator = rowIndex == 0 ? firstLineSeparator : separator

      for (let colIndex = 0; colIndex < arrays.length; colIndex++) {
        if (colIndex > 0) {
          mergedRow += currentSeparator
        }

        const cell = rowIndex < arrays[colIndex].length ? arrays[colIndex][rowIndex] : " ".repeat(arrayWidths[colIndex])

        mergedRow += cell
      }

      result.push(mergedRow)
    }

    return result
  }
}
