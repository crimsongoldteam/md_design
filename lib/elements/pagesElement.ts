import { Expose } from "class-transformer"
import { ElementListType } from "./baseElement"
import { PageElement } from "./pageElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"

export class PagesElement extends BaseElementWithoutAttributes {
  public type = "Страницы"
  public elementType = "ГруппаФормы"
  public elementKind = "Страницы"

  protected get defaultId(): string {
    return "Страницы"
  }

  @Expose({ name: "Элементы" })
  public readonly items: PageElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}
