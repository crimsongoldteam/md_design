import { Expose, Type } from "class-transformer"
import { BaseElement } from "./baseElement"
import { ElementListType } from "./types"
import { ButtonGroupElement } from "./buttonGroupElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class ButtonElement extends BaseElementWithoutAttributes {
  public type = "КнопкаФормы"
  public elementType = "КнопкаФормы"
  public elementKind = "БезВида"

  protected get defaultId(): string {
    return this.type === "Подменю" ? "Подменю" : "Кнопка"
  }

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  public items: (ButtonElement | ButtonGroupElement)[] = []

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

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(ButtonElement, "КнопкаФормы")
PlainToClassDiscriminator.addClass(ButtonElement, "Подменю")

elementsManager.addElement(ButtonElement, "ButtonElement", "КнопкаФормы")
