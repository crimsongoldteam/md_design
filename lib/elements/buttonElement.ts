import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { ButtonGroupElement } from "./buttonGroupElement"

export class ButtonElement extends BaseElement {
  public type = "КнопкаФормы"
  public elementType = "КнопкаФормы"
  public elementKind = "БезВида"

  @Expose({ name: "Элементы" })
  public readonly items: (ButtonElement | ButtonGroupElement)[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public switchToSubmenu() {
    this.type = "Подменю"
    this.elementType = "ГруппаФормы"
    this.elementKind = "Подменю"
  }
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
