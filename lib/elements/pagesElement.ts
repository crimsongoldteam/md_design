import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { PageElement } from "./pageElement"

export class PagesElement extends BaseElement {
  public type = "Страницы"
  public elementType = "ГруппаФормы"
  public elementKind = "Страницы"

  @Expose({ name: "Элементы" })
  public readonly items: PageElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}
