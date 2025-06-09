import { CheckboxElement } from "../parser/visitorTools/formElements"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"
import { FormatterUtils } from "./formatterUtils"

export class CheckboxFormatter implements IFormatter<CheckboxElement> {
  public format(element: CheckboxElement): string[] {
    let excludeProperties = ["Заголовок", "ГоризонтальноеПоложениеВГруппе", "ПоложениеЗаголовка", "ВидФлажка"]

    FormatterUtils.excludeStretchProperties(excludeProperties, element)

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    let header = element.properties["Заголовок"]

    let result = FormatterUtils.getAlignmentAtLeft(element)

    result += FormatterUtils.getCheckboxString(
      header,
      true,
      element.properties["ВидФлажка"],
      element.value,
      element.properties["ПоложениеЗаголовка"]
    )

    result += properties.join("")
    result += FormatterUtils.getAlignmentAtRight(element)

    return [result]
  }
}
