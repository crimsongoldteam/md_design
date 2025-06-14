import { Expose } from "class-transformer"
import { ElementListType } from "./baseElement"
import { ButtonElement } from "./buttonElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"

export class ButtonGroupElement extends BaseElementWithoutAttributes {
  public type = "ГруппаКнопок"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКнопок"

  @Expose({ name: "Элементы" })
  public readonly items: ButtonElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public getAllButtons(): (ButtonElement | ButtonGroupElement)[] {
    return [this, ...this.items]
  }

  protected get defaultId(): string {
    return "Группа"
  }
}
