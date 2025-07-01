import * as t from "@/parser/lexer"

import { TableColumnElement } from "@/elements/tableColumnElement"
import { TableElement, TableHeaderElement } from "@/elements/tableElement"
import { TableRowElement } from "@/elements/tableRowElement"
import { FormFormatterFactory } from "../formatterFactory"
import { IFormatter } from "../formFormatter"
import { TableFormatterColumn, TableHeaderRow } from "./tableFormatterColumn"
import { TableFormatterRowCell } from "./tableFormatterRowCell"
import { TableFormatterSeparator } from "./tableFormatterSeparator"
import { TreeToTableConverter } from "./tableToTreeConverter"
import { ConvertableTreeNode, ITableFormatterCell } from "./interfaces"
import { TableCellElement } from "@/elements"

export class TableFormatter implements IFormatter<TableElement> {
  private readonly rowSeparator: string = t.VBar.LABEL as string

  public format(element: TableElement): string[] {
    let result: string[] = []

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.formatSingleLine(element)
    if (properties.length > 0) {
      result.push(properties.join(""))
    }

    const columns: TableHeaderRow = element.columns.map((column: TableHeaderElement) => this.getFormatterColumn(column))

    const header = this.getHeaderTable(columns)
    const compactHeader = this.getHeaderTable(columns, this.compactHeaderFilter)

    const table: ITableFormatterCell[][] = []

    this.addHeaderRows(table, header)
    this.addSeparatorRow(table, compactHeader)
    this.addBodyRows(table, compactHeader, element.rows, 0)

    this.calculateLength(header)

    result.push(...this.renderTable(table))

    return result
  }

  private compactHeaderFilter(item: ConvertableTreeNode): boolean {
    return !(item as TableFormatterColumn).isColumnGroup()
  }

  private getFormatterColumn(column: TableHeaderElement): TableFormatterColumn {
    const result = new TableFormatterColumn(column)
    column.items.forEach((child: TableHeaderElement) => {
      result.add(this.getFormatterColumn(child))
    })
    return result
  }

  private getHeaderTable(
    columns: TableHeaderRow,
    filter?: ((item: ConvertableTreeNode) => boolean) | undefined
  ): TableHeaderRow[] {
    const converter = new TreeToTableConverter(filter)

    columns.forEach((child: TableFormatterColumn) => {
      converter.add(child)
    })

    return converter.table as TableHeaderRow[]
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
    compactHeader: TableFormatterColumn[][],
    rows: TableRowElement[],
    level: number = 0
  ) {
    for (const row of rows) {
      this.addBodyRow(result, compactHeader, row, level)
    }
  }

  private addBodyRow(
    result: ITableFormatterCell[][],
    compactHeader: TableFormatterColumn[][],
    row: TableRowElement,
    level: number
  ) {
    const cellsCache: Map<TableColumnElement, TableFormatterRowCell> = new Map()
    for (const headerRow of compactHeader) {
      const currentRow: ITableFormatterCell[] = []

      let isFirst = true
      for (const column of headerRow) {
        const columnElement = column.getElement() as TableColumnElement
        let cell = cellsCache.get(columnElement)

        if (!cell) {
          let cellElement = row.getByColumn(columnElement) ?? new TableCellElement()
          cell = new TableFormatterRowCell(cellElement, column, isFirst, level)
          cellsCache.set(columnElement, cell)
        }

        currentRow.push(cell)

        isFirst = false
      }
      result.push(currentRow)
    }

    this.addBodyRows(result, compactHeader, row.rows, level + 1)
  }

  private renderTable(rows: ITableFormatterCell[][]): string[] {
    const result: string[] = []
    const used: ITableFormatterCell[] = []
    for (const row of rows) {
      const usedInRow: ITableFormatterCell[] = []
      const currentRow: string[] = []
      for (const cell of row) {
        currentRow.push(this.getCellValue(cell, used, usedInRow))
        usedInRow.push(cell)
      }
      result.push(this.rowSeparator + currentRow.join(this.rowSeparator) + this.rowSeparator)
      used.push(...usedInRow)
    }

    return result
  }

  private getCellValue(
    cell: ITableFormatterCell,
    used: ITableFormatterCell[],
    usedInRow: ITableFormatterCell[]
  ): string {
    if (usedInRow.includes(cell)) {
      return ""
    }

    if (used.includes(cell)) {
      return cell.getEmptyValue()
    }

    return cell.getValue()
  }

  private calculateLength(header: TableFormatterColumn[][]) {
    const firstRow = header[0]
    for (const cell of firstRow) {
      cell.calculateMaxLength()
      cell.calculateLength()
    }
  }
}
