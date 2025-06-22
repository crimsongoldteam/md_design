import { Expose, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { ButtonElement } from "./buttonElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

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

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(ButtonGroupElement, "ГруппаКнопок")

elementsManager.addElement(ButtonGroupElement, "ButtonGroupElement", "ГруппаКнопок")
