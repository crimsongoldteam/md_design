import { TableCellAlignment } from "@/elements/baseElement"
import { BaseTableFormatterCell } from "./baseTableFormatterCell"
import { TableFormatterColumn } from "./tableFormatterColumn"

export class TableFormatterSeparator extends BaseTableFormatterCell {
  private readonly column: TableFormatterColumn

  constructor(column: TableFormatterColumn) {
    super()
    this.column = column
  }

  public getColSpan(): number {
    return this.column.getColSpan()
  }

  public getCalulatedLength(): number {
    return this.column.getCalulatedLength()
  }

  public popValue(): string {
    let leftSymbol = " "
    let rightSymbol = " "

    const alignment = this.column.getAlignment()

    if (alignment === TableCellAlignment.Right) {
      rightSymbol = ": "
    }

    if (alignment === TableCellAlignment.Center) {
      leftSymbol = " :"
      rightSymbol = ": "
    }

    const padding = this.getCalulatedLength() - leftSymbol.length - rightSymbol.length

    const separator = leftSymbol + "-".repeat(padding) + rightSymbol

    return separator
  }
}
