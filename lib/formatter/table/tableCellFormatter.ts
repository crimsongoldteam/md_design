import { TableCellElement } from "../elements/tableCellElement"
import { FormatterUtils } from "../formatterUtils"
import { IFormatter } from "../formFormatter"

export class TableCellFormatter implements IFormatter<TableCellElement> {
  public format(element: TableCellElement, params: { isFirst: boolean; level: number }): string[] {
    let text = ""

    if (params.isFirst && params.level > 0) {
      text += ".".repeat(params.level)
    }

    const checkboxText = FormatterUtils.getCheckboxString(
      element.value,
      element.hasCheckbox,
      "Авто",
      element.valueCheckbox,
      "Право"
    )

    text = text + " " + checkboxText + " "

    return [text]
  }
}
