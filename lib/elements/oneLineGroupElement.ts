import { Expose, Transform, Type } from "class-transformer"
import { BaseElement } from "./baseElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"
import { elementsManager } from "@/elementsManager"

export class OneLineGroupElement extends BaseElementWithoutAttributes {
  public type = "ОднострочнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  protected get defaultId(): string {
    return "Группа"
  }

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform, { toClassOnly: true })
  public items: BaseElement[] = []

  public childrenFields = ["items"]

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(OneLineGroupElement, "ОднострочнаяГруппа")

elementsManager.addElement(OneLineGroupElement, "OneLineGroupElement", "ОднострочнаяГруппа")
