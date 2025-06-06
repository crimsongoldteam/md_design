import { CheckboxElement } from "../parser/visitorTools/formElements"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"
import { FormatterUtils } from "./formatterUtils"

export class CheckboxFormatter implements IFormatter<CheckboxElement> {
  public format(element: CheckboxElement): string[] {
    const excludeProperties = ["Заголовок", "ГоризонтальноеПоложениеВГруппе", "ПоложениеЗаголовка", "ВидФлажка"]

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    const header = element.properties["Заголовок"]

    let result = FormatterUtils.getCheckboxString(
      header,
      true,
      element.properties["ВидФлажка"],
      element.value,
      element.properties["ПоложениеЗаголовка"]
    )

    result += properties.join("")

    return [result]
  }
}
