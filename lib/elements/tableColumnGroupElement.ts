import { Expose, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { TableColumnElement } from "./tableColumnElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"

export class TableColumnGroupElement extends BaseElementWithoutAttributes {
  public type = "ГруппаКолонокТаблицы"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКолонок"

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  public static readonly childrenFields = [ElementListType.Items]

  protected get defaultId(): string {
    return "ГруппаКолонок"
  }

  public getAllColumns(): TableColumnElement[] {
    const columns: TableColumnElement[] = []
    for (const column of this.items) {
      if (column instanceof TableColumnElement) {
        columns.push(column)
      }
      columns.push(...column.getAllColumns())
    }
    return columns
  }
}

PlainToClassDiscriminator.addClass(TableColumnGroupElement, "ГруппаКолонокТаблицы")
