import { CstChildrenDictionary, CstNode } from "chevrotain"
import { TableHeaderMap } from "./tableHeaderMap"

import { TableRowMap } from "./tableRowMap"
import { TypesUtils } from "./typesUtuls"
import { TableElement, TableHeaderElementExt } from "@/elements/tableElement"
import { TableCellElement } from "@/elements/tableCellElement"
import { TableColumnElement } from "@/elements/tableColumnElement"
import { TypeDescription } from "@/elements/typeDescription"
import { DateFractions } from "@/elements/types"

export enum TableRowType {
  Header,
  Separator,
  Row,
}

export class TableManager {
  private readonly tableElement: TableElement
  private readonly headerMap: TableHeaderMap
  private readonly rowMap: TableRowMap

  // private columnIndex: number = 0

  private currentRowType: TableRowType = TableRowType.Header

  constructor(tableElement: TableElement) {
    this.tableElement = tableElement
    this.headerMap = new TableHeaderMap(tableElement)
    this.rowMap = new TableRowMap(tableElement, this.headerMap)
  }

  getTableElement(): TableElement {
    return this.tableElement
  }

  public nextRow() {
    if (this.currentRowType == TableRowType.Header) {
      this.headerMap.addRow()
      return
    }

    if (this.currentRowType == TableRowType.Separator) {
      this.rowMap.initializeHeaderCellsMap()
      return
    }

    this.rowMap.addRow()
  }

  public addHeaderElement(item: TableHeaderElementExt): void {
    this.headerMap.addElement(item)
  }
  public addSeparator(ctx: CstChildrenDictionary): TableColumnElement | undefined {
    const isEmpty = this.isEmptyNode(ctx)
    if (this.headerMap.isSkipableColumn() && isEmpty) return

    const column = this.headerMap.getLastRowColumn()

    this.headerMap.nextColumn()

    return column
  }

  public addRowElement(item: TableCellElement, level: number): void {
    this.rowMap.addElement(item, level)
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

  public isEmptyNode(ctx: CstChildrenDictionary): boolean {
    return !this.isSeparatorNode(ctx) && !this.isCellNode(ctx)
  }

  public defineColumnsTypeDescription(): void {
    const headerCells = this.rowMap.getHeaderCells()

    for (let header of headerCells) {
      this.defineColumnTypeDescription(header)
    }
  }

  private defineColumnTypeDescription(header: [TableColumnElement, TableCellElement[]]): void {
    let column = header[0]
    if (!column.typeDescription.isEmpty()) {
      return
    }

    let resultTypeDescription: TypeDescription | undefined
    for (let cell of header[1]) {
      if (cell.isEmpty()) {
        continue
      }
      let currentTypeDefinition = TypesUtils.getTypeByContent(cell.value)

      let currentType = currentTypeDefinition.types[0].toLowerCase()
      if (currentType === "строка") {
        resultTypeDescription = undefined
        break
      }

      resultTypeDescription = this.updateTypeDescription(resultTypeDescription, currentTypeDefinition)

      if (resultTypeDescription === undefined) {
        break
      }
    }

    column.typeDescription = resultTypeDescription ?? new TypeDescription("Строка")
  }

  private updateTypeDescription(
    resultTypeDescription: TypeDescription | undefined,
    currentTypeDefinition: TypeDescription
  ): TypeDescription | undefined {
    let currentType = currentTypeDefinition.types[0].toLowerCase()

    if (resultTypeDescription === undefined) {
      return currentTypeDefinition
    }

    if (resultTypeDescription.types[0].toLowerCase() != currentType) {
      return undefined
    }

    if (currentType === "число") {
      resultTypeDescription.digits = Math.max(resultTypeDescription.digits, currentTypeDefinition.digits)
      resultTypeDescription.fractionDigits = Math.max(
        resultTypeDescription.fractionDigits,
        currentTypeDefinition.fractionDigits
      )
    }

    if (currentType === "дата" && resultTypeDescription.dateFractions != currentTypeDefinition.dateFractions) {
      resultTypeDescription.dateFractions = DateFractions.DateTime
    }

    return resultTypeDescription
  }

  private isSeparatorRow(row: CstNode[]): boolean {
    let isEmptyRow = true
    for (const tableCell of row) {
      if (this.isEmptyNode(tableCell.children)) {
        continue
      }
      if (this.isSeparatorNode(tableCell.children)) {
        isEmptyRow = false
        continue
      }

      return false
    }
    return !isEmptyRow
  }

  private isSeparatorNode(ctx: CstChildrenDictionary): boolean {
    return ctx.tableSeparatorCell !== undefined
  }

  private isCellNode(ctx: CstChildrenDictionary): boolean {
    let tableDataCells = ctx.tableDataCell
    if (tableDataCells == undefined) {
      return false
    }
    let tableDataCell = tableDataCells[0] as CstNode
    return Object.values(tableDataCell.children).length > 0
  }

  private doneHeader() {
    this.headerMap.done()
  }
}
