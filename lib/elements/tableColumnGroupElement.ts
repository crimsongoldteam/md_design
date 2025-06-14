import { Expose } from "class-transformer"
import { ElementListType } from "./baseElement"
import { TableColumnElement } from "./tableColumnElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"

export class TableColumnGroupElement extends BaseElementWithoutAttributes {
  public type = "ГруппаКолонокТаблицы"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКолонок"

  @Expose({ name: "Элементы" })
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  public static readonly childrenFields = [ElementListType.Items]

  protected get defaultId(): string {
    return "ГруппаКолонок"
  }
}
