import * as t from "../parser/lexer"

import {
  TableCellAlignment,
  TableCellElement,
  TableColumnElement,
  TableColumnGroupElement,
  TableElement,
  TableEmptyElement,
  TableHeaderElement,
  TableHeaderElementExt,
  TableRowElement,
} from "../parser/visitorTools/formElements"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"

type TableHeaderExtRow = (TableHeaderElementExt | undefined)[]

type TableHeaderRow = (TableHeaderElement | undefined)[]

class TableCellData {
  public isEmpty: boolean
  public value: string
  public alignment: TableCellAlignment
  public length: number

  constructor(options: { value?: string; alignment?: TableCellAlignment; isEmpty?: boolean }) {
    this.value = options.value ?? ""
    this.alignment = options.alignment ?? TableCellAlignment.Left
    this.isEmpty = options.isEmpty ?? false
    this.length = this.value.length
  }
}

class TableColumnCellData extends TableCellData {
  public element: TableColumnElement | undefined

  public columns: TableColumnCellData[] = []
  public cells: TableCellData[] = []
  private readonly MIN_COLUMN_WIDTH: number = 5

  // constructor(options: { value?: string; alignment?: TableCellAlignment; isEmpty?: boolean }) {
  //   this.value = options.value ?? ""
  //   this.alignment = options.alignment ?? TableCellAlignment.Left
  //   this.isEmpty = options.isEmpty ?? false
  //   this.length = this.value.length
  // }

  public calculateLength(): void {
    if (this.isEmpty) {
      return
    }
    const maxLength = Math.max(this.MIN_COLUMN_WIDTH, this.length, ...this.cells.map((cell) => cell.length))
    this.length = maxLength
  }
}

// 1. Строим шапку в виде таблицы
// 2. Делаем вариант свернутой таблицы для формирования тела
// 2. Строим тело в виде таблицы
// 3. И добавляем ячейки тела в шапку
// 4. Вычисляем максимальную ширину колонок
// 5. Распределяем ширину вышестоящих колонок на подчиненные
// 6. Записываем ширину для каждой ячейки
// 7. Выравниваем ячейки
// 8. Формируем таблицу

export class TableFormatter implements IFormatter<TableElement> {
  private readonly emptyElement = new TableEmptyElement()
  private readonly rowSeparator: string = t.VBar.LABEL as string
  private readonly MIN_COLUMN_WIDTH: number = 5

  public format(element: TableElement): string[] {
    let result: string[] = []

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element)
    if (properties.length > 0) {
      result.push(properties.join(""))
    }

    const headers: TableHeaderExtRow[] = this.getHeaderTable(element)

    const compactedHeaders = this.compactHeader(headers)

    const stringTable: TableCellData[][] = []
    this.addHeaderRows(stringTable, headers)

    const separatorRow: TableCellData[] = new Array(stringTable[0].length).fill(new TableCellData({}))
    stringTable.push(separatorRow)

    const separatorRowIndex = stringTable.length - 1

    this.addBodyRows(stringTable, compactedHeaders, element.rows, 0)

    this.alignColumns(stringTable, separatorRowIndex)

    result = this.formatTable(stringTable)

    return result
  }

  getHeaderTable(root: TableElement): TableHeaderExtRow[] {
    const table: TableHeaderExtRow[] = []

    if (root.columns.length === 0) return []

    const queue: { node: TableHeaderElement; level: number }[] = []

    root.columns.forEach((child) => {
      queue.push({ node: child, level: 0 })
    })

    while (queue.length > 0) {
      const current = queue.shift()!
      const { node, level } = current

      const currentRow = this.getOrCreateHeaderRow(table, level)
      currentRow.push(node)

      this.fillHeaderRows(table, level)

      node.items.forEach((child) => {
        queue.push({ node: child, level: level + 1 })
      })
    }

    return table
  }

  private getOrCreateHeaderRow(table: TableHeaderExtRow[], level: number): TableHeaderExtRow {
    if (table.length > level) {
      return table[level]
    }

    if (level === 0) {
      const result: TableHeaderExtRow = []
      table.push(result)
      return result
    }

    const previousRowLength = table[level - 1].length - 1

    const result = Array(previousRowLength).fill(this.emptyElement)
    table.push(result)
    return result
  }

  private fillHeaderRows(table: TableHeaderExtRow[], level: number) {
    for (const prevLevel of table.slice(0, level)) {
      while (prevLevel.length < table[level].length) {
        prevLevel.push(undefined)
      }
    }
  }

  private compactHeader(headerRow: TableHeaderExtRow[]): TableHeaderRow[] {
    const result: TableHeaderRow[] = []

    if (headerRow.length === 0) return result

    const currentColumns: TableHeaderExtRow = new Array(headerRow[0].length)

    let lastRow: TableHeaderRow | undefined = undefined

    let isEqualRows = true
    for (let rowIndex = headerRow.length - 1; rowIndex >= 0; rowIndex--) {
      const newRow: TableHeaderRow = []

      for (let colIndex = 0; colIndex < headerRow[rowIndex].length; colIndex++) {
        let column = headerRow[rowIndex][colIndex]

        if (column instanceof TableColumnGroupElement) {
          column = currentColumns[colIndex]
        }

        newRow.push(column as TableHeaderElement | undefined)
        currentColumns[colIndex] = column

        if (isEqualRows && lastRow) {
          isEqualRows = this.isEqualColumns(lastRow[colIndex], column)
        }
      }

      if (!isEqualRows || !lastRow) {
        result.unshift(newRow)
        lastRow = newRow
      }
    }

    return result
  }
  private isEqualColumns(
    column1: TableHeaderElementExt | undefined,
    column2: TableHeaderElementExt | undefined
  ): boolean {
    if (column1 === column2) {
      return true
    }

    if (!column1 || !column2) {
      return true
    }

    if (column1 instanceof TableEmptyElement || column2 instanceof TableEmptyElement) {
      return true
    }

    return false
  }

  private addHeaderRows(result: TableCellData[][], headers: TableHeaderExtRow[]) {
    for (const headerRow of headers) {
      const currentRow: TableCellData[] = []

      for (const header of headerRow) {
        if (!header) {
          currentRow.push(new TableCellData({ isEmpty: true }))
          continue
        }
        if (header instanceof TableEmptyElement) {
          currentRow.push(new TableCellData({}))
          continue
        }

        let headerResult = FormFormatterFactory.getFormatter(header).format(header)
        currentRow.push(new TableCellData({ value: headerResult.join(""), alignment: header.getAlignment() }))
      }
      result.push(currentRow)
    }
  }

  private addBodyRows(result: TableCellData[][], headers: TableHeaderRow[], rows: TableRowElement[], level: number) {
    for (const row of rows) {
      this.addBodyRow(result, headers, row, level)
    }
  }

  private addBodyRow(result: TableCellData[][], headers: TableHeaderRow[], row: TableRowElement, level: number) {
    for (const headerRow of headers) {
      const currentRow: TableCellData[] = []

      for (const header of headerRow) {
        if (!header) {
          currentRow.push(new TableCellData({ isEmpty: true }))
          continue
        }
        if (header instanceof TableEmptyElement) {
          currentRow.push(new TableCellData({}))
          continue
        }

        const cell = row.getByColumn(header as TableColumnElement)
        if (!cell) {
          throw new Error("Cell not found")
        }
        let cellResult = FormFormatterFactory.getFormatter(cell).format(cell)
        currentRow.push(new TableCellData({ value: cellResult.join(""), alignment: header.getAlignment() }))
      }
      result.push(currentRow)
    }

    this.addBodyRows(result, headers, row.rows, level + 1)
  }

  private alignColumns(stringTable: TableCellData[][], separatorRowIndex: number) {
    const columnWidths: number[] = []
    for (let colIndex = 0; colIndex < stringTable[0].length; colIndex++) {
      let maxWidth = this.MIN_COLUMN_WIDTH
      for (const row of stringTable) {
        const cell = row[colIndex]
        maxWidth = Math.max(maxWidth, cell.value.length)
      }
      columnWidths.push(maxWidth)
    }

    for (let rowIndex = 0; rowIndex < stringTable.length; rowIndex++) {
      const row = stringTable[rowIndex]
      const isSeparatorRow = rowIndex === separatorRowIndex

      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cell = row[colIndex]

        if (cell.isEmpty) {
          continue
        }

        const width = columnWidths[colIndex]
        if (isSeparatorRow) {
          cell.value = this.alignSeparator(cell.alignment, width)
        } else {
          cell.value = this.alignCell(cell.value, cell.alignment, width)
        }
      }
    }
  }
  private alignSeparator(alignment: TableCellAlignment, width: number): string {
    let leftSymbol = " "
    let rightSymbol = " "

    if (alignment === TableCellAlignment.Right) {
      rightSymbol = ": "
    }

    if (alignment === TableCellAlignment.Center) {
      leftSymbol = " :"
      rightSymbol = ": "
    }

    const padding = width - leftSymbol.length - rightSymbol.length

    const separator = leftSymbol + "-".repeat(padding) + rightSymbol

    return separator
  }

  private alignCell(value: string, alignment: TableCellAlignment, length: number): string {
    const padding = length - value.length

    if (alignment === TableCellAlignment.Left) {
      return value + " ".repeat(padding)
    }

    if (alignment === TableCellAlignment.Right) {
      return " ".repeat(padding) + value
    }

    const leftPad = Math.floor(padding / 2)
    const rightPad = padding - leftPad
    return " ".repeat(leftPad) + value + " ".repeat(rightPad)
  }

  private formatTable(stringTable: TableCellData[][]): string[] {
    const result: string[] = []

    for (const row of stringTable) {
      result.push(row.map((cell) => cell.value).join(this.rowSeparator))
    }

    return result
  }
}
