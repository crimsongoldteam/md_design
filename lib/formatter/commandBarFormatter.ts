import * as t from "../parser/lexer"

import { ButtonElement, ButtonGroupElement, CommandBarElement } from "../parser/visitorTools/formElements"
import { FormFormatterFactory } from "./formatterFactory"
import { FormatterUtils } from "./formatterUtils"
import { IFormatter } from "./formFormatter"

const SEPARATOR = " " + t.VBar.LABEL + " "
const MENU_LEVEL_INDICATOR = t.Dots.LABEL as string
const GROUP_INDICATOR = t.Dash.LABEL as string

export class CommandBarFormatter implements IFormatter<CommandBarElement> {
  public format(element: CommandBarElement): string[] {
    const excludeProperties = ["ГоризонтальноеПоложениеВГруппе"]
    FormatterUtils.excludeStretchProperties(excludeProperties, element)

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    const buttons = element.getAllButtons()
    const { firstLineText, hasMenu } = this.formatFirstLine(buttons)

    if (!hasMenu) {
      return [this.formatSingleLine(firstLineText, element, properties)]
    }

    return this.formatWithMenu(firstLineText, buttons, element, properties)
  }

  private formatFirstLine(buttons: (ButtonElement | ButtonGroupElement)[]): {
    firstLineText: string
    hasMenu: boolean
  } {
    const firstLine: string[] = []
    let hasMenu = false

    for (const button of buttons) {
      if (button.elementKind === "Подменю") {
        hasMenu = true
      }

      const text = FormFormatterFactory.getFormatter(button).format(button)
      firstLine.push(text.join(""))
    }

    return {
      firstLineText: firstLine.join(SEPARATOR),
      hasMenu,
    }
  }

  private formatSingleLine(content: string, element: CommandBarElement, properties: string[]): string {
    let result = FormatterUtils.getAlignmentAtLeft(element)

    result += t.LAngle.LABEL + " " + content + " " + t.RAngle.LABEL + properties.join("")
    result += FormatterUtils.getAlignmentAtRight(element)

    return result
  }

  private formatWithMenu(
    firstLineText: string,
    buttons: (ButtonElement | ButtonGroupElement)[],
    element: CommandBarElement,
    properties: string[]
  ): string[] {
    const result: string[] = [firstLineText]

    for (const button of buttons) {
      if (button.elementKind === "Подменю") {
        this.formatMenuLine(result, button, 0)
      }
    }

    const lastLine = result.pop()!
    result.push(lastLine + " " + t.RAngle.LABEL + properties.join("") + FormatterUtils.getAlignmentAtRight(element))

    return result
  }

  private formatMenuLine(result: string[], element: ButtonElement | ButtonGroupElement, level: number): void {
    if (element.elementKind === "ГруппаКнопок") {
      result.push(this.getTextWithLevel(GROUP_INDICATOR, level))
      this.formatMenuLineSubitems(result, element, level + 1)
      return
    }

    const isMenu = level === 0
    const text = FormFormatterFactory.getFormatter(element).format(element, isMenu).join("")
    result.push(this.getTextWithLevel(text, level))

    if (element.elementKind === "Подменю") {
      this.formatMenuLineSubitems(result, element as ButtonElement, level + 1)
    }
  }

  private formatMenuLineSubitems(result: string[], element: ButtonElement | ButtonGroupElement, level: number): void {
    const items = element.items
    for (const item of items) {
      this.formatMenuLine(result, item, level)
    }
  }

  private getTextWithLevel(text: string, level: number): string {
    if (level === 0) {
      return text
    }

    const levelText = MENU_LEVEL_INDICATOR.repeat(level)
    return levelText ? levelText + " " + text : text
  }
}
