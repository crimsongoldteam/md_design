import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"

export class PageElement extends BaseElementWithoutAttributes {
  public type = "Страница"
  public elementType = "ГруппаФормы"
  public elementKind = "Страница"

  protected get defaultId(): string {
    return "Страница"
  }

  @Expose({ name: "Элементы" })
  public readonly items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}
