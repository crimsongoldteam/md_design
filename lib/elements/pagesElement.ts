import { Expose, Transform, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { PageElement } from "./pageElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"

export class PagesElement extends BaseElementWithoutAttributes {
  public type = "Страницы"
  public elementType = "ГруппаФормы"
  public elementKind = "Страницы"

  protected get defaultId(): string {
    return "Страницы"
  }

  @Expose({ name: "Страницы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform)
  public items: PageElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}

PlainToClassDiscriminator.addClass(PagesElement, "Страницы")
