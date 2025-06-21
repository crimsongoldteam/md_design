import { Expose, Transform, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"

export class PageElement extends BaseElementWithoutAttributes {
  public type = "Страница"
  public elementType = "ГруппаФормы"
  public elementKind = "Страница"

  protected get defaultId(): string {
    return "Страница"
  }

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform)
  public readonly items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}

PlainToClassDiscriminator.addClass(PageElement, "Страница")
