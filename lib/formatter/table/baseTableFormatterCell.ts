import { TableCellAlignment } from "@/elements/baseElement"
import { ITableFormatterCell } from "./tableFormatter"

export abstract class BaseTableFormatterCell implements ITableFormatterCell {
  protected value: string = ""

  public abstract getCalulatedLength(): number
  public abstract getColSpan(): number
  public abstract popValue(): string

  public getLength(): number {
    return this.value.length
  }

  protected getAlignedValue(alignment: TableCellAlignment): string {
    const padding = this.getCalulatedLength() - this.getLength()

    if (alignment === TableCellAlignment.Left) {
      return this.value + " ".repeat(padding)
    }

    if (alignment === TableCellAlignment.Right) {
      return " ".repeat(padding) + this.value
    }

    const leftPad = Math.floor(padding / 2)
    const rightPad = padding - leftPad
    return " ".repeat(leftPad) + this.value + " ".repeat(rightPad)
  }
}
