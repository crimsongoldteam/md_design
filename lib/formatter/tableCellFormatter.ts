import { TableCellElement } from "../parser/visitorTools/formElements"
import { IFormatter } from "./formFormatter"
import { FormatterUtils } from "./formatterUtils"

export class TableCellFormatter implements IFormatter<TableCellElement> {
  public format(element: TableCellElement): string[] {
    // const excludeProperties = ["Заголовок", "ГоризонтальноеПоложениеВГруппе", "ПоложениеЗаголовка", "ВидФлажка"]

    // const propertiesFormatter = new PropertiesFormatter()
    // const properties = propertiesFormatter.format(element, { excludeProperties })

    // if (element.hasCheckbox) {
    //   return [CheckboxUtils.getCheckboxString(element.value, true, "Флажок", element.valueCheckbox, "Лево")]
    // }
    return [element.value]
  }
}
