import * as t from "../parser/lexer"
import { InputElement } from "../parser/visitorTools/formElements"
import { IFormatter } from "./formFormatter"
import { FormFormatterFactory } from "./formatterFactory"

export class InputFormatter implements IFormatter<InputElement> {
  public format(element: InputElement): string[] {
    const underline = t.Underscore.LABEL as string

    let header = element.properties["Заголовок"] ?? ""
    header += t.Colon.LABEL

    let value = ""
    if (element.value) {
      value = " " + element.value
    }

    const modificators = this.getModificators(element)
    if (modificators.length > 0) {
      value += underline.repeat(2) + modificators
    }

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element, {
      excludeProperties: [
        "КнопкаВыпадающегоСписка",
        "КнопкаВыбора",
        "КнопкаОчистки",
        "КнопкаРегулирования",
        "КнопкаОткрытия",
        "ГоризонтальноеПоложениеВГруппе",
        "Заголовок",
      ],
    })

    let result = header + value + properties
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
