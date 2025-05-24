import {
  TableColumnElement,
  TableColumnGroupElement,
  TableElement,
  TableEmptyElement,
  TableHeaderElement,
  TableHeaderElementExt,
} from "./formElements"

export class TableHeaderMap {
  public map: TableHeaderElementExt[][] = []
  private readonly table: TableElement
  private currentRow: TableHeaderElementExt[] = []

  // private rowIndex: number = 0
  // private colIndex: number = 0

  constructor(table: TableElement) {
    this.table = table
  }

  public addElement(item: TableHeaderElementExt): void {
    this.currentRow.push(item)
  }

  public addRow(): void {
    this.map.push(this.currentRow)

    this.currentRow = []
  }

  public getRowsCount(): number {
    return this.map.length
  }

  public getCellAt(row: number, col: number): TableColumnElement {
    return this.map[row][col] as TableColumnElement
  }

  public done(): void {
    let parentRow: TableHeaderElementExt[] = Array(this.map[0].length)

    for (let row = 0; row < this.map.length; row++) {
      this.fillRow(row, parentRow)
      parentRow = this.map[row]
    }

    this.collapse()
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

    let items = parent instanceof TableElement ? parent.columns : (parent as TableHeaderElement).items
    items.push(item as TableHeaderElement)
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

    let currentRow: TableHeaderElementExt[] = this.map.at(-1) as TableHeaderElementExt[]
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
