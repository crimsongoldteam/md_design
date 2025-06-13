import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { TableColumnElement } from "./tableColumnElement"

export class TableColumnGroupElement extends BaseElement {
  public type = "ГруппаКолонокТаблицы"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКолонок"

  @Expose({ name: "Элементы" })
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public getBaseElementName(): string {
    return "ГруппаКолонок" + super.getBaseElementName("")
  }
}
