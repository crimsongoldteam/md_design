import { Expose, Transform, Type } from "class-transformer"
import { BaseElement } from "./baseElement"
import { ElementListType } from "./types"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"
import { elementsManager } from "@/elementsManager"

export class VerticalGroupElement extends BaseElementWithoutAttributes {
  public type = "ВертикальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform, { toClassOnly: true })
  public items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  protected get defaultId(): string {
    return "ВертикальнаяГруппа"
  }

  public get isContainer(): boolean {
    return true
  }
}

PlainToClassDiscriminator.addClass(VerticalGroupElement, "ВертикальнаяГруппа")

elementsManager.addElement(VerticalGroupElement, "VerticalGroupElement", "ВертикальнаяГруппа")
