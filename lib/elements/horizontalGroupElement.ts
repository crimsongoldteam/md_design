import { Expose, Type } from "class-transformer"
import { BaseElement } from "./baseElement"
import { ElementListType } from "./types"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class HorizontalGroupElement extends BaseElementWithoutAttributes {
  public type = "ГоризонтальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  protected get defaultId(): string {
    return "Группа"
  }

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  public items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(HorizontalGroupElement, "ГоризонтальнаяГруппа")

elementsManager.addElement(HorizontalGroupElement, "HorizontalGroupElement", "ГоризонтальнаяГруппа")
