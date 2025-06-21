import { Expose, Transform, Type } from "class-transformer"
import { BaseElement } from "./baseElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"

export class OneLineGroupElement extends BaseElementWithoutAttributes {
  public type = "ОднострочнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  protected get defaultId(): string {
    return "Группа"
  }

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform)
  public items: BaseElement[] = []

  public childrenFields = ["items"]
}

PlainToClassDiscriminator.addClass(OneLineGroupElement, "ОднострочнаяГруппа")
