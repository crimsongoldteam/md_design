import { Expose } from "class-transformer"
import { ElementListType } from "./baseElement"
import { VerticalGroupElement } from "./verticalGroupElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"

export class HorizontalGroupElement extends BaseElementWithoutAttributes {
  public type = "ГоризонтальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  protected get defaultId(): string {
    return "ГоризонтальнаяГруппа"
  }

  @Expose({ name: "Элементы" })
  public readonly items: VerticalGroupElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}
