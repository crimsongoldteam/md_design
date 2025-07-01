import { VerticalGroupElement } from "../elements/verticalGroupElement"
import * as t from "../parser/lexer"
import { PropertiesFormatter } from "./propertiesFormatter"
import { IFormatter } from "./formFormatter"
import { InlineItemsFormatterUtils } from "./inlineItemsFormatterUtils"

export class VerticalGroupFormatter implements IFormatter<VerticalGroupElement> {
  public format(
    element: VerticalGroupElement,
    params: { addIndent: boolean; onlyItems: boolean } = { addIndent: false, onlyItems: false }
  ): string[] {
    const indent = params.addIndent && !params.onlyItems ? "  " : ""
    let textLines: string[] = []
    if (!params.onlyItems) {
      const header = this.getHeader(element, params.addIndent)
      textLines.push(header)
    }

    textLines.push(...InlineItemsFormatterUtils.format(element.items, indent))

    if (!params.onlyItems) {
      textLines = this.addSpaces(textLines)
    }
    return textLines
  }

  private getMaxLength(textLines: string[]): number {
    return textLines.reduce((max, line) => Math.max(max, line.length), 0)
  }

  private addSpaces(textLines: string[]): string[] {
    const maxLength = this.getMaxLength(textLines)
    return textLines.map((line) => line.padEnd(maxLength, " "))
  }

  private getHeader(element: VerticalGroupElement, addIndent: boolean): string {
    const excludeProperties = ["Заголовок", "Поведение"]

    const levelDisplay = this.getLevelDisplay(element)
    if (!levelDisplay.display) {
      excludeProperties.push("Отображение")
    }

    const propertiesFormatter = new PropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    let level = levelDisplay.level
    if (!addIndent) {
      level--
    }

    let result = (t.Hash.LABEL as string).repeat(level)

    result += element.properties.get("Заголовок") ?? ""

    result += properties

    return result
  }

  private getLevelDisplay(element: VerticalGroupElement): { level: number; display: boolean } {
    const result: { level: number; display: boolean } = { level: 1, display: false }

    const display = element.getProperty("Отображение")?.toString().toLowerCase()
    const behavior = element.getProperty("Поведение")?.toString().toLowerCase()

    const levelBehavior: Map<string, number> = new Map([
      ["свертываемая", 5],
      ["всплывающая", 6],
    ])

    if (behavior && levelBehavior.has(behavior)) {
      result.level = levelBehavior.get(behavior) ?? 1
      if (display && display !== "обычноевыделение") {
        result.display = true
      }
      return result
    }

    const levelDisplay: Map<string, number> = new Map([
      ["нет", 1],
      ["слабоевыделение", 2],
      ["обычноевыделение", 3],
      ["сильноевыделение", 4],
    ])

    if (display && levelDisplay.has(display)) {
      result.level = levelDisplay.get(display) ?? 1
    }

    return result
  }
}
