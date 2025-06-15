import { TableCellElement } from "@/elements/tableCellElement"
import { TableColumnElement } from "@/elements/tableColumnElement"
import { TableElement } from "@/elements/tableElement"
import { TableRowElement } from "@/elements/tableRowElement"
import { HierarchyManager } from "./hierarchyManager"
import { TableHeaderMap } from "./tableHeaderMap"
import { ElementListType } from "@/elements/baseElement"

export class TableRowMap {
  private readonly hierarchy: HierarchyManager
  private currentRow: TableRowElement = new TableRowElement()

  private readonly table: TableElement
  private readonly headerMap: TableHeaderMap
  private readonly headerCells: Map<TableColumnElement, TableCellElement[]> = new Map()

  private currentLevel: number = 0

  constructor(table: TableElement, headerMap: TableHeaderMap) {
    this.table = table
    this.headerMap = headerMap
    this.hierarchy = new HierarchyManager("rows", (item) => this.getDefaultParent(item))
  }

  public addRow(): void {
    this.headerMap.rollHeaderRow()

    if (this.headerMap.onFirstRow()) {
      this.hierarchy.set(this.currentRow, this.currentLevel)
      this.currentRow = new TableRowElement()
    }

    if (this.currentLevel) {
      this.table.type = "Дерево"
      this.table.typeDescription.types = ["ДеревоЗначений"]
    }
  }

  public addElement(item: TableCellElement, level: number): void {
    const isEmpty = !item.hasCheckbox && item.value.trim() == ""

    if (this.headerMap.isSkipableColumn() && isEmpty) return

    if (isEmpty) {
      this.headerMap.nextColumn()
      return
    }

    if (this.headerMap.onFirstColumn()) {
      this.currentLevel = level
    }

    const column = this.headerMap.getCurrentColumn()
    if (!column) {
      return
    }

    if (item.hasCheckbox) {
      column.hasCheckbox = true
    }

    if (item.value) {
      column.hasValue = true
    }

    this.currentRow.items.set(column, item)

    this.headerMap.nextColumn()
  }

  public getHeaderCells(): Map<TableColumnElement, TableCellElement[]> {
    return this.headerCells
  }

  public initializeHeaderCellsMap(): void {
    let columns = this.headerMap.getColumns()
    for (let column of columns) {
      this.headerCells.set(column, [])
    }
    this.headerMap.resetColumnsCounter()
  }

  private getDefaultParent(item: TableRowElement): TableRowElement {
    this.table.add(ElementListType.Rows, [item])
    return item
  }
}
