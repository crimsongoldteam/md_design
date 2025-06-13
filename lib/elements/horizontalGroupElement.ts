import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { VerticalGroupElement } from "./verticalGroupElement"

export class HorizontalGroupElement extends BaseElement {
  public type = "ГоризонтальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  @Expose({ name: "Элементы" })
  public readonly items: VerticalGroupElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}
