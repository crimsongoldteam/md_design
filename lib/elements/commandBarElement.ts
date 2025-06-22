import { Expose, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { ButtonElement } from "./buttonElement"
import { ButtonGroupElement } from "./buttonGroupElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class CommandBarElement extends BaseElementWithoutAttributes {
  public type = "КоманднаяПанель"
  public elementType = "ГруппаФормы"
  public elementKind = "КоманднаяПанель"

  protected get defaultId(): string {
    return "КоманднаяПанель"
  }

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
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

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(CommandBarElement, "КоманднаяПанель")

elementsManager.addElement(CommandBarElement, "CommandBarElement", "КоманднаяПанель")
