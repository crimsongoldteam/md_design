import { CstChildrenDictionary, CstNode } from "chevrotain"
import { TableHeaderMap } from "./tableHeaderMap"
import { TableCellElement, TableElement, TableHeaderElement, TableHeaderElementExt } from "./formElements"
import { TableRowMap } from "./tableRowMap"

export enum TableRowType {
  Header,
  Separator,
  Row,
}

export class TableManager {
  private readonly headerMap: TableHeaderMap
  private readonly rowMap: TableRowMap

  private columnIndex: number = 0

  private currentRowType: TableRowType = TableRowType.Header

  constructor(tableElement: TableElement) {
    this.headerMap = new TableHeaderMap(tableElement)
    this.rowMap = new TableRowMap(tableElement, this.headerMap)
  }

  public nextColumn(): void {
    this.columnIndex++
    this.rowMap.setColumnIndex(this.columnIndex)
  }

  public nextRow() {
    this.columnIndex = 0
    this.rowMap.setColumnIndex(this.columnIndex)

    if (this.currentRowType == TableRowType.Header) {
      this.headerMap.addRow()
      return
    }

    if (this.currentRowType == TableRowType.Separator) {
      return
    }

    this.rowMap.addRow()
  }
  // public getHeaderCell(): TableColumnElement | undefined {}

  public addHeaderElement(item: TableHeaderElementExt): void {
    this.headerMap.addElement(item)
  }

  public addRowElement(item: TableCellElement, level: number): void {
    this.rowMap.addElement(item, level)
  }

  public getHeaderLastRowCell(): TableHeaderElement {
    const rowIndex = this.headerMap.getRowsCount() - 1
    return this.headerMap.getCellAt(rowIndex, this.columnIndex)
  }

  public getRowType(): TableRowType {
    return this.currentRowType
  }

  public defineRowType(row: CstNode[]) {
    if (this.currentRowType == TableRowType.Row) {
      this.currentRowType = TableRowType.Row
      return
    }

    if (this.currentRowType == TableRowType.Separator) {
      this.currentRowType = TableRowType.Row
      return
    }

    if (this.isSeparatorRow(row)) {
      this.currentRowType = TableRowType.Separator
      this.doneHeader()
    }
  }

  public isSeparatorRow(row: CstNode[]): boolean {
    for (const tableCell of row) {
      if (this.isEmptyNode(tableCell.children)) {
        continue
      }
      if (!this.isSeparatorNode(tableCell.children)) {
        return false
      }
    }
    return true
  }

  public isSeparatorNode(ctx: CstChildrenDictionary): boolean {
    return ctx.tableSeparatorCell !== undefined
  }
  public isCellNode(ctx: CstChildrenDictionary): boolean {
    let tableDataCells = ctx.tableDataCell
    if (tableDataCells == undefined) {
      return false
    }
    let tableDataCell = tableDataCells[0] as CstNode
    return Object.values(tableDataCell.children).length > 0
  }

  public isEmptyNode(ctx: CstChildrenDictionary): boolean {
    return !this.isSeparatorNode(ctx) && !this.isCellNode(ctx)
  }

  private doneHeader() {
    this.headerMap.done()
  }
}
