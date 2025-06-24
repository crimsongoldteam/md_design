import { PropertyAlignment } from "@/elements/types"
import { TableFormatterColumn } from "./tableFormatterColumn"
import { ITableFormatterCell } from "./interfaces"

export class TableFormatterSeparator implements ITableFormatterCell {
  private readonly column: TableFormatterColumn

  constructor(column: TableFormatterColumn) {
    this.column = column
  }

  public getLength(): number {
    return this.column.getLength()
  }

  public getCalulatedLength(): number {
    return this.column.getCalulatedLength()
  }

  public getValue(): string {
    let leftSymbol = " "
    let rightSymbol = " "

    const alignment = this.column.getAlignment()

    if (alignment === PropertyAlignment.Right) {
      rightSymbol = ": "
    }

    if (alignment === PropertyAlignment.Center) {
      leftSymbol = " :"
      rightSymbol = ": "
    }

    const padding = this.getCalulatedLength() - leftSymbol.length - rightSymbol.length

    const separator = leftSymbol + "-".repeat(padding) + rightSymbol

    return separator
  }

  getEmptyValue(): string {
    throw new Error("Method not implemented.")
  }
}
