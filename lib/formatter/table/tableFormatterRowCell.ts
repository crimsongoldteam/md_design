import { TableCellElement } from "../../parser/visitorTools/formElements"
import { BaseTableFormatterCell } from "./BaseTableFormatterCell"
import { FormFormatterFactory } from "../formatterFactory"
import { TableCellFormatter } from "./tableCellFormatter"
import { TableFormatterColumn } from "./tableFormatterColumn"

export class TableFormatterRowCell extends BaseTableFormatterCell {
  private readonly column: TableFormatterColumn

  constructor(element: TableCellElement, column: TableFormatterColumn, isFirst: boolean, level: number) {
    super()
    const formatter = FormFormatterFactory.getFormatter(element) as TableCellFormatter
    this.value = formatter.format(element, { isFirst: isFirst, level: level }).join("")

    this.column = column
    this.column.addCell(this)
  }

  public getColSpan(): number {
    return this.column.getColSpan()
  }

  public getCalulatedLength(): number {
    return this.column.getCalulatedLength()
  }

  public popValue(): string {
    const result = this.getAlignedValue(this.column.getAlignment())

    this.value = ""
    return result
  }
}
