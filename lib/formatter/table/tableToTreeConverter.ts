import { ConvertableTreeNode } from "./interfaces"

export class TreeToTableConverter {
  private readonly _table: ConvertableTreeNode[][] = []
  private _columnIndent: number = 0

  constructor(private readonly filter?: ((item: ConvertableTreeNode) => boolean) | undefined) {}

  public add(item: ConvertableTreeNode): void {
    this.addItem(item, 0)

    if (this._table.length > 0) {
      this._columnIndent = this._table[0].length
    }

    this.fillColumns()
  }

  public get table(): ConvertableTreeNode[][] {
    return this._table
  }

  private addItem(item: ConvertableTreeNode, rowIndex: number = 0): void {
    const row = this.getOrCreateRow(rowIndex)

    let childRowIndex = rowIndex
    if (!this.filter || this.filter(item)) {
      row.push(item)
      childRowIndex++
    }

    for (const child of item.items) {
      this.addItem(child, childRowIndex)
    }

    if (rowIndex === 0) {
      return
    }

    const prevRow = this.getOrCreateRow(rowIndex - 1)
    this.fillRow(prevRow, row.length)
  }

  private fillRow(row: ConvertableTreeNode[], length: number): void {
    if (row.length === 0) {
      return
    }

    const last = row[row.length - 1]
    row.push(...Array(length - row.length).fill(last))
  }

  private fillColumns(): void {
    if (this._table.length === 0) {
      return
    }

    const targetLength = this._table[0].length

    for (let rowIndex = 1; rowIndex < this._table.length; rowIndex++) {
      const row = this._table[rowIndex]
      const prevRow = this._table[rowIndex - 1]

      if (row.length === targetLength) {
        continue
      }

      const elementsToAdd = prevRow.slice(row.length)
      row.push(...elementsToAdd)
    }
  }

  private getOrCreateRow(rowIndex: number): ConvertableTreeNode[] {
    if (this._table.length > rowIndex) {
      return this._table[rowIndex]
    }

    const result: ConvertableTreeNode[] =
      rowIndex === 0 ? [] : [...this._table[rowIndex - 1].slice(0, this._columnIndent)]
    this._table.push(result)
    return result
  }
}
