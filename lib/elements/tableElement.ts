import { Expose } from "class-transformer"
import { ElementListType } from "./baseElement"
import { TableColumnElement } from "./tableColumnElement"
import { TableColumnGroupElement } from "./tableColumnGroupElement"
import { TableRowElement } from "./tableRowElement.ts"
import { TypeDescription } from "./typeDescription"
import { BaseElementWithAttributes } from "./baseElementWithAttributes .ts"

export class TableElement extends BaseElementWithAttributes {
  public type = "Таблица"
  public elementType = "ТаблицаФормы"
  public elementKind = "БезВида"

  @Expose({ name: "Колонки" })
  public readonly columns: (TableColumnElement | TableColumnGroupElement)[] = []

  @Expose({ name: "Строки" })
  public readonly rows: TableRowElement[] = []

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription("ТаблицаЗначений")

  public static readonly childrenFields = [ElementListType.Columns, ElementListType.Rows]

  protected get defaultId(): string {
    return this.type
  }
}
