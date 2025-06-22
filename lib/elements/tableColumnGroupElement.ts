import { Expose, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { TableColumnElement } from "./tableColumnElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class TableColumnGroupElement extends BaseElementWithoutAttributes {
  public type = "ГруппаКолонокТаблицы"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКолонок"

  protected static aligmentProperty: string = "ГоризонтальноеПоложение"

  @Expose({ name: "Колонки" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  public static readonly childrenFields = [ElementListType.Items]

  protected get defaultId(): string {
    return "ГруппаКолонок"
  }

  public get isContainer(): boolean {
    return false
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

elementsManager.addElement(TableColumnGroupElement, "TableColumnGroupElement", "ГруппаКолонокТаблицы")
