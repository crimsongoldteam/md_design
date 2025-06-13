import { TableHeaderElement } from "@/elements/tableHeaderElement"
import { TableColumnGroupElement } from "@/elements/tableColumnGroupElement"
import { TableCellAlignment } from "@/elements/baseElement"
import { BaseTableFormatterCell } from "./baseTableFormatterCell"
import { FormFormatterFactory } from "../formatterFactory"
import { FormatterUtils } from "../formatterUtils"
import { TableFormatterRowCell } from "./tableFormatterRowCell"

export class TableFormatterColumn extends BaseTableFormatterCell {
  private readonly element: TableHeaderElement
  private readonly rowIndex: number = 0
  private readonly rowCompactIndex: number = 0
  private readonly MIN_COLUMN_WIDTH: number = 5
  private calculatedLength: number = 0

  private colSpan: number = 1
  private readonly columns: TableFormatterColumn[] = []
  private readonly cells: TableFormatterRowCell[] = []

  constructor(element: TableHeaderElement, parent: TableFormatterColumn | undefined = undefined) {
    super()
    this.element = element
    this.value = FormFormatterFactory.getFormatter(element).format(element).join("")
    this.calculatedLength = Math.max(this.MIN_COLUMN_WIDTH, this.value.length + this.columns.length)

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
    this.calculatedLength = Math.max(this.calculatedLength, cell.getLength())
    this.cells.push(cell)
  }

  public getCalulatedLength(): number {
    return this.calculatedLength
  }

  public setCalulatedLength(length: number): void {
    this.calculatedLength = length
  }

  public calculateMaxLength(): void {
    let childrenLength = 0
    for (const cell of this.columns) {
      cell.calculateMaxLength()
      childrenLength += cell.getCalulatedLength()
    }

    this.calculatedLength = Math.max(this.calculatedLength, childrenLength)
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
