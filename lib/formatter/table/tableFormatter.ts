import * as t from "../../parser/lexer"

import { TableColumnElement, TableElement, TableRowElement } from "../../parser/visitorTools/formElements"
import { FormFormatterFactory } from "../formatterFactory"
import { IFormatter } from "../formFormatter"
import { TableFormatterColumn } from "./tableFormatterColumn"
import { TableFormatterRowCell } from "./tableFormatterRowCell"
import { TableFormatterSeparator } from "./TableFormatterSeparator"

type TableHeaderRow = TableFormatterColumn[]

export interface ITableFormatterCell {
  getColSpan(): number
  getLength(): number
  getCalulatedLength(): number
  popValue(): string
}

export class TableFormatter implements IFormatter<TableElement> {
  private readonly rowSeparator: string = t.VBar.LABEL as string

  public format(element: TableElement): string[] {
    let result: string[] = []

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element)
    if (properties.length > 0) {
      result.push(properties.join(""))
    }

    const { header, compactHeader } = this.getHeaderTable(element)
    const table: ITableFormatterCell[][] = []

    this.addHeaderRows(table, header)
    this.addSeparatorRow(table, compactHeader)
    this.addBodyRows(table, compactHeader, element.rows, 0)

    this.calculateLength(header)

    result.push(...this.renderTable(table))

    return result
  }

  private getHeaderTable(root: TableElement): { header: TableHeaderRow[]; compactHeader: TableHeaderRow[] } {
    const header: TableHeaderRow[] = []
    const compactHeader: TableHeaderRow[] = []

    if (root.columns.length === 0) return { header: header, compactHeader: header }

    const queue: TableFormatterColumn[] = []

    root.columns.forEach((child) => {
      queue.push(new TableFormatterColumn(child))
    })

    while (queue.length > 0) {
      this.proceedQueue(queue, header, compactHeader)
    }

    return { header: header, compactHeader: compactHeader }
  }

  private proceedQueue(queue: TableFormatterColumn[], header: TableHeaderRow[], compactHeader: TableHeaderRow[]) {
    const parent = queue.shift()!
    const node = parent.getElement()

    const rowData = parent.getRowIndices()

    this.addToHeader(header, parent, rowData.rowIndex)
    if (!parent.isColumnGroup()) {
      this.addToHeader(compactHeader, parent, rowData.rowCompactIndex)
    }

    node.items.forEach((child) => {
      const childCell = new TableFormatterColumn(child, parent)

      queue.push(childCell)
    })
  }

  private addToHeader(table: TableHeaderRow[], current: TableFormatterColumn, level: number) {
    const currentRow = this.getOrCreateHeaderRow(table, level)
    currentRow.push(current)

    this.fillHeaderRows(table, level)
  }

  private getOrCreateHeaderRow(table: TableHeaderRow[], level: number): TableHeaderRow {
    if (table.length > level) {
      return table[level]
    }

    if (level === 0) {
      const result: TableHeaderRow = []
      table.push(result)
      return result
    }

    const previousRow = table[level - 1]
    const result: TableHeaderRow = previousRow.slice(0, -1)
    table.push(result)
    return result
  }

  private fillHeaderRows(table: TableHeaderRow[], level: number) {
    for (const prevLevel of table.slice(0, level)) {
      const lastCell = prevLevel[prevLevel.length - 1]
      lastCell.incColSpan(table[level].length - prevLevel.length)
    }
  }

  private addHeaderRows(table: ITableFormatterCell[][], headers: TableHeaderRow[]): void {
    headers.forEach((headerRow) => {
      table.push([...headerRow])
    })
  }

  addSeparatorRow(table: ITableFormatterCell[][], compactHeader: TableHeaderRow[]) {
    if (compactHeader.length === 0) {
      return
    }

    const separatorRow: ITableFormatterCell[] = []
    for (const column of compactHeader[compactHeader.length - 1]) {
      separatorRow.push(new TableFormatterSeparator(column))
    }
    table.push(separatorRow)
  }

  private addBodyRows(
    result: ITableFormatterCell[][],
    compactHeader: TableHeaderRow[],
    rows: TableRowElement[],
    level: number = 0
  ) {
    for (const row of rows) {
      this.addBodyRow(result, compactHeader, row, level)
    }
  }

  private addBodyRow(
    result: ITableFormatterCell[][],
    compactHeader: TableHeaderRow[],
    row: TableRowElement,
    level: number
  ) {
    for (const headerRow of compactHeader) {
      const currentRow: ITableFormatterCell[] = []

      let isFirst = true
      for (const column of headerRow) {
        const cellElement = row.getByColumn(column.getElement() as TableColumnElement)
        if (!cellElement) continue

        const cell = new TableFormatterRowCell(cellElement, column, isFirst, level)
        currentRow.push(cell)

        isFirst = false
      }
      result.push(currentRow)
    }

    this.addBodyRows(result, compactHeader, row.rows, level + 1)
  }

  private renderTable(rows: ITableFormatterCell[][]): string[] {
    const result: string[] = []
    for (const row of rows) {
      const currentRow: string[] = []
      for (const cell of row) {
        currentRow.push(cell.popValue())
        this.addSpanCells(cell, currentRow)
      }
      result.push(this.rowSeparator + currentRow.join(this.rowSeparator) + this.rowSeparator)
    }

    return result
  }

  private addSpanCells(cell: ITableFormatterCell, currentRow: string[]) {
    for (let col = 1; col < cell.getColSpan(); col++) {
      currentRow.push("")
    }
  }

  private calculateLength(compactHeader: TableHeaderRow[]) {
    for (const cell of compactHeader[0]) {
      cell.calculateMaxLength()
      cell.calculateLength()
    }
  }
}
