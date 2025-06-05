import { CheckboxElement } from "../parser/visitorTools/formElements"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"

export class CheckboxFormatter implements IFormatter<CheckboxElement> {
  public format(element: CheckboxElement): string[] {
    const excludeProperties = ["Заголовок", "ГоризонтальноеПоложениеВГруппе", "ПоложениеЗаголовка", "ВидФлажка"]

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    const header = element.properties["Заголовок"]

    let result = this.getCheckboxString(
      header,
      true,
      element.properties["ВидФлажка"],
      element.value,
      element.properties["ПоложениеЗаголовка"]
    )

    result += properties.join("")

    return [result]
  }

  private getCheckboxString(
    text: string,
    hasCheckbox: boolean,
    checkboxType: string = "Флажок",
    checkboxValue: boolean = false,
    captionPosition: string = "Лево"
  ): string {
    if (!hasCheckbox) {
      return text
    }

    let value = ""

    if (checkboxType === "Выключатель") {
      value = checkboxValue ? " |1" : "0| "
    } else {
      value = checkboxValue ? "X" : " "
    }

    const checkbox = `[${value}]`

    if (!text) {
      return checkbox
    }

    return captionPosition === "Право" ? `${checkbox} ${text}` : `${text} ${checkbox}`
  }
}
