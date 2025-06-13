import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"

export class PageElement extends BaseElement {
  public type = "Страница"
  public elementType = "ГруппаФормы"
  public elementKind = "Страница"

  @Expose({ name: "Элементы" })
  public readonly items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}
