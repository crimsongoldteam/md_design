import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { ButtonElement } from "./buttonElement"
import { ButtonGroupElement } from "./buttonGroupElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"

export class CommandBarElement extends BaseElementWithoutAttributes {
  public type = "КоманднаяПанель"
  public elementType = "ГруппаФормы"
  public elementKind = "КоманднаяПанель"

  protected get defaultId(): string {
    return "КоманднаяПанель"
  }

  @Expose({ name: "Элементы" })
  public items: (BaseElement | ButtonGroupElement)[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public getAllButtons(): (ButtonElement | ButtonGroupElement)[] {
    const buttons: (ButtonElement | ButtonGroupElement)[] = []
    for (const item of this.items) {
      if (item instanceof ButtonElement) {
        buttons.push(item)
        continue
      }
      buttons.push(...(item as ButtonGroupElement).getAllButtons())
    }
    return buttons
  }
}
