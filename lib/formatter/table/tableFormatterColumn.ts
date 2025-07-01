import { TableColumnGroupElement } from "@/elements/tableColumnGroupElement"
import { PropertyAlignment } from "@/elements/types"
import { FormFormatterFactory } from "../formatterFactory"
import { FormatterUtils } from "../formatterUtils"
import { TableFormatterRowCell } from "./tableFormatterRowCell"
import { TableHeaderElement, TableHeaderElementExt } from "@/elements/tableElement"
import { ConvertableTreeNode, ITableFormatterCell } from "./interfaces"
import { CellTextAligner } from "./cellTextAligner"

export type TableHeaderRow = TableFormatterColumn[]

export class TableFormatterColumn implements ITableFormatterCell, ConvertableTreeNode {
  private readonly element: TableHeaderElementExt
  private readonly MIN_COLUMN_WIDTH: number = 5
  private calculatedLength: number = 0
  public readonly items: TableFormatterColumn[] = []
  private readonly cells: TableFormatterRowCell[] = []
  private readonly value: string = ""

  constructor(element: TableHeaderElement) {
    this.element = element
    this.value = FormFormatterFactory.getFormatter(element).format(element).join("")
    this.calculatedLength = Math.max(this.MIN_COLUMN_WIDTH, this.value.length + this.items.length)
  }

  public getLength(): number {
    return this.value.length
  }

  public getAlignment(): PropertyAlignment {
    return this.element.alignment
  }

  public getValue(): string {
    return CellTextAligner.alignText(this.value, this.getCalulatedLength(), this.getAlignment())
  }

  public getEmptyValue(): string {
    return CellTextAligner.alignText("", this.getCalulatedLength(), this.getAlignment())
  }

  public getElement(): TableHeaderElement {
    return this.element as TableHeaderElement
  }

  public isColumnGroup(): boolean {
    return this.element instanceof TableColumnGroupElement
  }

  public add(column: TableFormatterColumn): void {
    this.items.push(column)
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
    for (const cell of this.items) {
      cell.calculateMaxLength()
      childrenLength += cell.getCalulatedLength()
    }

    this.calculatedLength = Math.max(this.calculatedLength, childrenLength)
  }

  public calculateLength(): void {
    const columnLengths: number[] = this.items.map((cell) => cell.getCalulatedLength())

    const distributedLengths = FormatterUtils.distributeNumberWithAlignment(this.getCalulatedLength(), columnLengths)

    for (let i = 0; i < this.items.length; i++) {
      const column = this.items[i]
      column.setCalulatedLength(distributedLengths[i])
      column.calculateLength()
    }
  }
}
