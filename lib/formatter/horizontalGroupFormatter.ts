import { HorizontalGroupElement } from "../parser/visitorTools/formElements"
import { IFormatter } from "./formFormatter"
import { FormFormatterFactory } from "./formatterFactory"

export class HorizontalGroupFormatter implements IFormatter<HorizontalGroupElement> {
  public format(element: HorizontalGroupElement): string[] {
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

    result.push(...this.mergeHorizontally(...verticalGroups))

    return result
  }

  private mergeHorizontally(...arrays: string[][]): string[] {
    const maxLength = Math.max(...arrays.map((arr) => arr.length))

    const arrayWidths = arrays.map((arr) => (arr.length > 0 ? arr[0].length : 0))

    const result: string[] = []

    for (let i = 0; i < maxLength; i++) {
      let mergedRow = ""

      for (let j = 0; j < arrays.length; j++) {
        const cell = i < arrays[j].length ? arrays[j][i] : " ".repeat(arrayWidths[j])
        mergedRow += cell
      }

      result.push(mergedRow)
    }

    return result
  }
}
