import * as t from "../parser/lexer"

import { VerticalGroupElement } from "../parser/visitorTools/formElements"
import { PropertiesFormatter } from "./propertiesFormatter"
import { IFormatter } from "./formFormatter"
import { FormFormatterFactory } from "./formatterFactory"

export class VerticalGroupFormatter implements IFormatter<VerticalGroupElement> {
  public format(element: VerticalGroupElement, params: { addIndent: boolean }): string[] {
    const indent = params.addIndent ? "  " : ""
    let textLines: string[] = []
    const header = this.getHeader(element, params.addIndent)
    textLines.push(header)

    for (const item of element.items) {
      const text = FormFormatterFactory.getFormatter(item).format(item)
      textLines.push(...text.map((line) => indent + line))
    }

    textLines = this.addSpaces(textLines)
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

    result += element.properties["Заголовок"] ?? ""

    result += properties

    return result
  }

  private getLevelDisplay(element: VerticalGroupElement): { level: number; display: boolean } {
    const result: { level: number; display: boolean } = { level: 1, display: false }

    const display = element.properties["Отображение"]
    const behavior = element.properties["Поведение"]

    const levelBehavior = {
      Свертываемая: 5,
      Всплывающая: 6,
    }

    if (behavior && levelBehavior[behavior as keyof typeof levelBehavior]) {
      result.level = levelBehavior[behavior as keyof typeof levelBehavior]
      if (display && display !== "ОбычноеВыделение") {
        result.display = true
      }
    }

    const levelDisplay = {
      Нет: 1,
      СлабоеВыделение: 2,
      ОбычноеВыделение: 3,
      СильноеВыделение: 4,
    }

    if (display && levelDisplay[display as keyof typeof levelDisplay]) {
      result.level = levelDisplay[display as keyof typeof levelDisplay]
    }

    return result
  }
}
