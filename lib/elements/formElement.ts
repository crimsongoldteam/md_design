import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"

export class FormElement extends BaseElement {
  public type = "Форма"
  public elementType = "Форма"
  public elementKind = "БезВида"

  @Expose({ name: "Элементы" })
  public items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}
