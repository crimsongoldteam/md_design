import * as t from "../parser/lexer"

import { ButtonElement, ButtonGroupElement, CommandBarElement } from "../parser/visitorTools/formElements"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"

export class CommandBarFormatter implements IFormatter<CommandBarElement> {
  public format(element: CommandBarElement): string[] {
    const firstLineSeparator = " " + t.VBar.LABEL + " "

    const result: string[] = []

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element)

    const buttons = element.getAllButtons()

    const firstLine: string[] = []
    let withMenu = false
    for (const button of buttons) {
      if (button.elementKind === "Подменю") {
        withMenu = true
      }

      const text = FormFormatterFactory.getFormatter(button).format(button)
      firstLine.push(text.join(""))
    }

    let firstLineText = firstLine.join(firstLineSeparator)
    if (!withMenu) {
      firstLineText = t.LAngle.LABEL + " " + firstLineText + " " + t.RAngle.LABEL + properties

      return [firstLineText]
    }

    result.push(firstLineText)

    for (const button of buttons) {
      if (button.elementKind !== "Подменю") {
        continue
      }

      this.formatMenu(result, button, 0)
    }

    const lastLine = result.pop()
    result.push(lastLine + " " + t.RAngle.LABEL + properties)

    return result
  }

  formatMenu(result: string[], element: ButtonElement | ButtonGroupElement, level: number): void {
    let text = ""
    if (element.elementKind === "ГруппаКнопок") {
      text = t.Dash.LABEL as string
      result.push(this.getTextWithLevel(text, level))
      return
    }

    const isMenu = level === 0
    text = FormFormatterFactory.getFormatter(element).format(element, isMenu).join("")

    result.push(this.getTextWithLevel(text, level))

    if (element.elementKind === "Подменю") {
      this.formatMenuItems(result, element as ButtonElement, level + 1)
    }
  }

  formatMenuItems(result: string[], element: ButtonElement, level: number): void {
    let items = element.getAllButtons()
    for (const item of items) {
      this.formatMenu(result, item, level)
    }
  }

  getTextWithLevel(text: string, level: number): string {
    if (level === 0) {
      return text
    }

    const levelText = (t.Dots.LABEL as string).repeat(level)

    if (levelText) {
      return levelText + " " + text
    }

    return text
  }
}
