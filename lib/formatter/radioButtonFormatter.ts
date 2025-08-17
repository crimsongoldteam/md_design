import { RadioButtonElement } from "../elements/radioButtonElement"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"
import { FormatterUtils } from "./formatterUtils"

export class RadioButtonFormatter implements IFormatter<RadioButtonElement> {
  public format(element: RadioButtonElement): string[] {
    let excludeProperties = ["Заголовок", "ГоризонтальноеПоложениеВГруппе", "СписокВыбора"]

    FormatterUtils.excludeStretchProperties(excludeProperties, element)

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    let result = FormatterUtils.getAlignmentAtLeft(element)

    let header = element.getProperty("Заголовок")
    if (header) {
      result += header + ": "
    }

    let items = element.getProperty("СписокВыбора") as string[]

    result += this.formatItems(items, element.value).join(" ")

    result += properties.join("")
    result += FormatterUtils.getAlignmentAtRight(element)

    return [result]
  }

  private formatItems(items: string[], value: number): string[] {
    let result = []
    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      result.push(FormatterUtils.getRadioButtonItemString(item, index === value))
    }
    return result
  }
}
