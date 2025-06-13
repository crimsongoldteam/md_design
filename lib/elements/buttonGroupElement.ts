import { Expose } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { ButtonElement } from "./buttonElement"

export class ButtonGroupElement extends BaseElement {
  public type = "ГруппаКнопок"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКнопок"

  @Expose({ name: "Элементы" })
  public readonly items: ButtonElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public getBaseElementName(): string {
    return this.type + super.getBaseElementName("")
  }

  public getAllButtons(): (ButtonElement | ButtonGroupElement)[] {
    return [this, ...this.items]
  }
}
