import { Expose, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { ButtonElement } from "./buttonElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"

export class ButtonGroupElement extends BaseElementWithoutAttributes {
  public type = "ГруппаКнопок"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКнопок"

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  public items: ButtonElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public getAllButtons(): (ButtonElement | ButtonGroupElement)[] {
    return [this, ...this.items]
  }

  protected get defaultId(): string {
    return "Группа"
  }
}

PlainToClassDiscriminator.addClass(ButtonGroupElement, "ГруппаКнопок")
