import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { TableColumnElement } from "./tableColumnElement"
import { TableColumnGroupElement } from "./tableColumnGroupElement"
import { TableRowElement } from "./tableRowElement.ts"
import { TypeDescription } from "./typeDescription"

export class TableElement extends BaseElement {
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

  public getBaseElementName(): string {
    return this.type + super.getBaseElementName("")
  }
}
