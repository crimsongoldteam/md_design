import { ElementListType } from "@/elements/baseElement"
import { TableColumnElement } from "@/elements/tableColumnElement"
import { TableColumnGroupElement } from "@/elements/tableColumnGroupElement"
import { TableElement, TableHeaderElementExt } from "@/elements/tableElement"
import { TableEmptyElement } from "@/elements/tableEmptyElement"

export class TableHeaderMap {
  private map: TableHeaderElementExt[][] = []
  private readonly columns: TableColumnElement[] = []
  private readonly table: TableElement

  private currentRow: TableHeaderElementExt[] = []

  private currentRowIndex: number = 0
  private currentColumnIndex: number = 0

  private isShortLeft: boolean = false
  private isFirstColumn: boolean = true

  constructor(table: TableElement) {
    this.table = table
  }

  public addElement(item: TableHeaderElementExt): void {
    this.checkShortLeft(item)

    const isSkipableColumn = this.isShortLeft && this.onFirstColumn() && this.isEmpty(item)
    this.isFirstColumn = false

    if (isSkipableColumn) return

    this.currentRow.push(item)
    if (item instanceof TableColumnElement && !this.columns.includes(item)) {
      this.columns.push(item)
    }

    this.nextColumn()
  }

  public rollHeaderRow(): void {
    this.currentRowIndex++
    if (this.currentRowIndex >= this.map.length) {
      this.currentRowIndex = 0
    }

    this.resetColumnsCounter()
  }
  public resetColumnsCounter(): void {
    this.currentRow = []
    this.currentColumnIndex = 0
    this.isFirstColumn = true
  }

  public getLastRowColumn(): TableColumnElement {
    return this.map[this.map.length - 1][this.currentColumnIndex] as TableColumnElement
  }

  public getCurrentColumn(): TableColumnElement {
    return this.map[this.currentRowIndex][this.currentColumnIndex] as TableColumnElement
  }

  public onFirstRow(): boolean {
    return this.currentRowIndex == 0
  }

  public onFirstColumn(): boolean {
    return this.isFirstColumn
  }

  public nextColumn(): void {
    this.isFirstColumn = false
    this.currentColumnIndex++
  }

  public isSkipableColumn(): boolean {
    return this.isShortLeft && this.currentColumnIndex == 0
  }

  private checkShortLeft(item: TableHeaderElementExt): void {
    if (this.isShortLeft) return

    if (!this.onFirstRow()) return
    if (!this.onFirstColumn()) return
    if (!this.isEmpty(item)) return

    this.isShortLeft = true
  }

  public getColumns(): TableColumnElement[] {
    return this.columns
  }

  public addRow(): void {
    this.map.push(this.currentRow)

    this.currentRowIndex++

    this.resetColumnsCounter()
  }

  public getRowsCount(): number {
    return this.map.length
  }

  public done(): void {
    let parentRow: TableHeaderElementExt[] = Array(this.map[0].length)

    for (let row = 0; row < this.map.length; row++) {
      this.fillRow(row, parentRow)
      parentRow = this.map[row]
    }

    this.collapse()

    this.currentRowIndex = 0
    this.currentColumnIndex = 0
  }

  private fillAbove(cell: TableHeaderElementExt, toRow: number, col: number): void {
    for (let row = toRow; row >= 0; row--) {
      this.map[row] ??= []
      this.map[row][col] = cell
    }
  }

  private isEmpty(cell: TableHeaderElementExt): boolean {
    return cell instanceof TableEmptyElement
  }

  private isTableColumnGroupElement(cell: TableHeaderElementExt): boolean {
    return cell instanceof TableColumnGroupElement
  }

  private addChild(parent: TableHeaderElementExt, item: TableHeaderElementExt) {
    if (this.isEmpty(parent)) {
      return
    }

    let field = parent instanceof TableElement ? ElementListType.Columns : ElementListType.Items
    parent.add(field, [item])
  }

  private fillRow(rowIndex: number, parentRow: TableHeaderElementExt[]): void {
    let currentRow = this.map[rowIndex]

    let prevParent: TableHeaderElementExt = this.table
    let prevItem: TableHeaderElementExt = new TableEmptyElement()

    for (let col = 0; col < this.map[rowIndex].length; col++) {
      const cell = currentRow[col]

      if (col >= parentRow.length) {
        this.fillAbove(cell, rowIndex, col)
        prevItem = cell
        prevParent = cell
        this.addChild(this.table, cell)
        continue
      }

      const parent = parentRow[col] ?? this.table

      if (!this.isEmpty(cell)) {
        prevItem = cell
        prevParent = parent
        this.addChild(parent, cell)
        continue
      }

      if (parent == prevParent) {
        currentRow[col] = prevItem
        continue
      }

      currentRow[col] = parent
      prevItem = parent
      prevParent = parent
    }
  }

  private collapse(): void {
    if (this.map.length <= 1) {
      return
    }

    let currentRow: TableHeaderElementExt[] = this.map[this.map.length - 1]
    const result: TableHeaderElementExt[][] = [currentRow]
    const numColumns = currentRow.length

    for (let rowIndex = this.getRowsCount() - 2; rowIndex >= 0; rowIndex--) {
      const row = this.map[rowIndex]

      let equal = true
      for (let colIndex = 0; colIndex < numColumns; colIndex++) {
        let lastColumn = currentRow[colIndex]
        let column = row[colIndex]

        if (this.isTableColumnGroupElement(column)) {
          row[colIndex] = lastColumn
          continue
        }

        if (lastColumn != column) {
          equal = false
        }
      }

      if (!equal) {
        result.unshift(row)
      }
    }

    this.map = result
  }
}
