import { FormFormatterFactory } from "../formatterFactory"
import { TableCellFormatter } from "./tableCellFormatter"
import { TableFormatterColumn } from "./tableFormatterColumn"
import { TableCellElement } from "@/elements/tableCellElement"
import { CellTextAligner } from "./cellTextAligner"
import { ITableFormatterCell } from "./interfaces"

export class TableFormatterRowCell implements ITableFormatterCell {
  private readonly column: TableFormatterColumn
  private readonly value: string = ""

  constructor(element: TableCellElement, column: TableFormatterColumn, isFirst: boolean, level: number) {
    const formatter = FormFormatterFactory.getFormatter(element) as TableCellFormatter
    this.value = formatter.format(element, { isFirst: isFirst, level: level }).join("")

    this.column = column
    this.column.addCell(this)
  }

  public getLength(): number {
    return this.value.length
  }

  public getCalulatedLength(): number {
    return this.column.getCalulatedLength()
  }

  public getValue(): string {
    return CellTextAligner.alignText(this.value, this.getCalulatedLength(), this.column.getAlignment())
  }

  public getEmptyValue(): string {
    return CellTextAligner.alignText("", this.getCalulatedLength(), this.column.getAlignment())
  }
}
