import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { ButtonElement } from "./buttonElement"
import { ButtonGroupElement } from "./buttonGroupElement"

export class CommandBarElement extends BaseElement {
  public type = "КоманднаяПанель"
  public elementType = "ГруппаФормы"
  public elementKind = "КоманднаяПанель"

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
