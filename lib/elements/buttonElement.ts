import { Expose } from "class-transformer"
import { ElementListType } from "./baseElement"
import { ButtonGroupElement } from "./buttonGroupElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"

export class ButtonElement extends BaseElementWithoutAttributes {
  public type = "КнопкаФормы"
  public elementType = "КнопкаФормы"
  public elementKind = "БезВида"

  protected get defaultId(): string {
    return this.type === "Подменю" ? "Подменю" : "Кнопка"
  }

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
      buttons.push(...item.getAllButtons())
    }
    return buttons
  }
}
