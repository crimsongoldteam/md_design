import { Expose, instanceToPlain, Transform } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { TableCellElement } from "./tableCellElement"
import { TableColumnElement } from "./tableColumnElement"
import { IdGeneratorRequest, IdGeneratorQueueInboxItem } from "@/parser/visitorTools/idGenerator"

export class TableRowElement extends BaseElement {
  public type = "СтрокаТаблицы"

  @Expose({ name: "Ячейки" })
  @Transform(({ value }): Map<string, Record<string, any>> => {
    const transformedMap = new Map<string, Record<string, any>>()

    value.forEach((value: TableCellElement, key: TableColumnElement) => {
      return transformedMap.set(key.attributeId, instanceToPlain(value))
    })

    return transformedMap
  })
  public readonly items: Map<TableColumnElement, TableCellElement> = new Map()

  @Expose({ name: "Строки" })
  public readonly rows: TableRowElement[] = []

  public static readonly childrenFields = [ElementListType.Rows]

  public getByColumn(column: TableColumnElement): TableCellElement | undefined {
    return this.items.get(column)
  }

  public getByCheckboxColumn(column: TableColumnElement): TableCellElement | undefined {
    return this.items.get(column)
  }

  public getIdTemplate(_request: IdGeneratorRequest): string {
    return ""
  }
  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    return []
  }
}
