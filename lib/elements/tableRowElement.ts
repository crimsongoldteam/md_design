import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { TableCellElement } from "./tableCellElement"
import { TableColumnElement } from "./tableColumnElement"

export class TableRowElement extends BaseElement {
  public type = "СтрокаТаблицы"

  @Expose({ name: "Ячейки" })
  public readonly items: Map<string, TableCellElement> = new Map()

  @Expose({ name: "Строки" })
  public readonly rows: TableRowElement[] = []

  public static readonly childrenFields = [ElementListType.Rows]

  public getByColumn(column: TableColumnElement): TableCellElement | undefined {
    return this.items.get(column.id)
  }
}
