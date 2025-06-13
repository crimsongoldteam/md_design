import { InputElement } from "../elements/inputElement"
import * as t from "../parser/lexer"
import { IFormatter } from "./formFormatter"
import { FormFormatterFactory } from "./formatterFactory"
import { FormatterUtils } from "./formatterUtils"

export class InputFormatter implements IFormatter<InputElement> {
  public format(element: InputElement): string[] {
    const underline = t.Underscore.LABEL as string

    let header: string = FormatterUtils.getAlignmentAtLeft(element)

    header += element.properties["Заголовок"] ?? ""
    header += t.Colon.LABEL

    let value = ""
    if (element.value) {
      value = " " + element.value
    }

    const modificators = this.getModificators(element)
    if (modificators.length > 0) {
      value += underline.repeat(2) + modificators
    }

    let excludeProperties = [
      "КнопкаВыпадающегоСписка",
      "КнопкаВыбора",
      "КнопкаОчистки",
      "КнопкаРегулирования",
      "КнопкаОткрытия",
      "ГоризонтальноеПоложениеВГруппе",
      "Заголовок",
    ]

    FormatterUtils.excludeStretchProperties(excludeProperties, element)

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element, {
      excludeProperties: excludeProperties,
    })

    let result = header + value + properties + FormatterUtils.getAlignmentAtRight(element)

    result += this.getMultilineString(element, header.length, value.length)

    return [result]
  }

  private isMultiline(element: InputElement): boolean {
    return (
      element.properties["МногострочныйРежим"] &&
      element.properties["МногострочныйРежим"] === "true" &&
      element.properties["Высота"] &&
      element.properties["Высота"] > 1
    )
  }

  private getMultilineString(element: InputElement, headerLength: number, valueLength: number): string {
    if (!this.isMultiline(element)) {
      return ""
    }

    const underline = t.Underscore.LABEL as string
    const height = element.properties["Высота"]

    let multilineString = "\n" + " ".repeat(headerLength) + underline.repeat(valueLength)
    for (let i = 2; i <= height; i++) {
      multilineString += multilineString + "\n"
    }

    return multilineString
  }

  private getModificators(element: InputElement): string {
    const propertyMap: { [key: string]: string } = {
      КнопкаВыбора: "В",
      КнопкаВыпадающегоСписка: "С",
      КнопкаОчистки: "Х",
      КнопкаОткрытия: "О",
      КнопкаРегулирования: "Д",
    }

    return Object.keys(propertyMap)
      .filter((key) => element.properties[key])
      .map((key) => propertyMap[key])
      .join("")
  }
}
