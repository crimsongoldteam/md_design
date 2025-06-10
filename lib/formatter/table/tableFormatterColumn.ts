import { TableHeaderElement, TableColumnGroupElement, TableCellAlignment } from "../../parser/visitorTools/formElements"
import { BaseTableFormatterCell } from "./BaseTableFormatterCell"
import { FormFormatterFactory } from "../formatterFactory"
import { FormatterUtils } from "../formatterUtils"
import { TableFormatterRowCell } from "./tableFormatterRowCell"

export class TableFormatterColumn extends BaseTableFormatterCell {
  private readonly element: TableHeaderElement
  private readonly rowIndex: number = 0
  private readonly rowCompactIndex: number = 0
  private readonly MIN_COLUMN_WIDTH: number = 5
  private length: number = 0

  private colSpan: number
  private readonly columns: TableFormColumn[] = []
  private readonly cells: TableFormatterRowCell[] = []

  constructor(element: TableHeaderElement, parent: TableFormColumn | undefined = undefined) {
    super()
    this.element = element
    this.value = FormFormatterFactory.getFormatter(element).format(element).join("")
    this.length = Math.max(this.MIN_COLUMN_WIDTH, this.value.length)
    this.colSpan = 0

    if (!parent) {
      return
    }

    const rowData = parent.getRowIndices()

    this.rowIndex = rowData.rowIndex + 1
    const delta = parent.isColumnGroup() ? 0 : 1
    this.rowCompactIndex = rowData.rowCompactIndex + delta

    parent.columns.push(this)
  }

  public getAlignment(): TableCellAlignment {
    return this.element.getAlignment()
  }

  public popValue(): string {
    const result = this.getAlignedValue(this.getAlignment())

    this.value = ""
    return result
  }

  public getElement(): TableHeaderElement {
    return this.element
  }

  public getColSpan(): number {
    return this.colSpan
  }

  public incColSpan(count: number): void {
    this.colSpan += count
  }

  public getRowIndices(): { rowIndex: number; rowCompactIndex: number } {
    return { rowIndex: this.rowIndex, rowCompactIndex: this.rowCompactIndex }
  }

  public isColumnGroup(): boolean {
    return this.element instanceof TableColumnGroupElement
  }

  public addCell(cell: TableFormatterRowCell) {
    this.length = Math.max(this.length, cell.getLength())
    this.cells.push(cell)
  }

  public getCalulatedLength(): number {
    return this.length
  }

  public setCalulatedLength(length: number): void {
    this.length = length
  }

  public calculateMaxLength(): void {
    let childrenLength = 0
    for (const cell of this.columns) {
      cell.calculateMaxLength()
      childrenLength += cell.getLength()
    }

    this.length = Math.max(this.length, childrenLength)
  }

  public calculateLength(): void {
    const columnLengths: number[] = this.columns.map((cell) => cell.getCalulatedLength())

    const distributedLengths = FormatterUtils.distributeNumberWithAlignment(this.getCalulatedLength(), columnLengths)

    for (let i = 0; i < this.columns.length; i++) {
      const column = this.columns[i]
      column.setCalulatedLength(distributedLengths[i])
      column.calculateLength()
    }
  }
}
