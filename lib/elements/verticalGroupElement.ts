import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"

export class VerticalGroupElement extends BaseElement {
  public type = "ВертикальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  @Expose({ name: "Элементы" })
  public readonly items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}
