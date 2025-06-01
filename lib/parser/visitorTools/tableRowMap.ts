import { TableCellElement, TableColumnElement, TableElement, TableRowElement } from "./formElements"
import { HierarchyManager } from "./hierarchyManager"
import { TableHeaderMap } from "./tableHeaderMap"

export class TableRowMap {
  private readonly hierarchy: HierarchyManager
  private currentRow: TableRowElement = new TableRowElement()

  private readonly table: TableElement
  private readonly headerMap: TableHeaderMap
  private readonly headerCells: Map<TableColumnElement, TableCellElement[]> = new Map()

  private headerRowIndex: number = 0
  private headerColumnIndex: number = 0
  private currentLevel: number = 0

  constructor(table: TableElement, headerMap: TableHeaderMap) {
    this.table = table
    this.headerMap = headerMap
    this.hierarchy = new HierarchyManager({
      collectionField: "rows",
      defaultParent: (item: TableRowElement): TableRowElement => {
        this.table.rows.push(item)
        return item
      },
    })
  }

  public setColumnIndex(index: number): void {
    this.headerColumnIndex = index
  }

  public addRow(): void {
    if (this.headerRowIndex == 0) {
      this.hierarchy.set(this.currentRow, this.currentLevel)
      this.currentRow = new TableRowElement()
    }

    if (this.currentLevel) {
      this.table.type = "Дерево"
      this.table.typeDescription.types = ["ДеревоЗначений"]
    }

    this.headerColumnIndex = 0
    this.rollHeaderRow()
  }

  public addElement(item: TableCellElement, level: number): void {
    if (this.headerColumnIndex == 0) {
      this.currentLevel = level
    }

    let column = this.headerMap.getCellAt(this.headerRowIndex, this.headerColumnIndex)
    item.uuidColumn = column.uuid
    item.uuidCheckbox = column.uuidCheckbox

    if (item.hasCheckbox) {
      column.hasCheckbox = true
    }

    if (item.value) {
      column.hasValue = true
    }

    let cells = this.headerCells.get(column) as TableCellElement[]
    cells.push(item)

    this.currentRow.items.push(item)
  }

  public getHeaderCells(): Map<TableColumnElement, TableCellElement[]> {
    return this.headerCells
  }

  public initializeHeaderCellsMap(): void {
    let columns = this.headerMap.getColumns()
    for (let column of columns) {
      this.headerCells.set(column, [])
    }
  }

  private rollHeaderRow(): void {
    this.headerRowIndex++
    if (this.headerRowIndex >= this.headerMap.getRowsCount()) {
      this.headerRowIndex = 0
    }
  }
}
