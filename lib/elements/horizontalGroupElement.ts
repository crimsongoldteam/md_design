import { Expose, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"

export class HorizontalGroupElement extends BaseElementWithoutAttributes {
  public type = "ГоризонтальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  protected get defaultId(): string {
    return "ГоризонтальнаяГруппа"
  }

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  public items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}

PlainToClassDiscriminator.addClass(HorizontalGroupElement, "ГоризонтальнаяГруппа")
