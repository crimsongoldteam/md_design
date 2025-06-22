import { Expose, Transform, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"
import { elementsManager } from "@/elementsManager"

export class PageElement extends BaseElementWithoutAttributes {
  public type = "Страница"
  public elementType = "ГруппаФормы"
  public elementKind = "Страница"

  protected get defaultId(): string {
    return "Страница"
  }

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform, { toClassOnly: true })
  public readonly items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public get isContainer(): boolean {
    return true
  }
}

PlainToClassDiscriminator.addClass(PageElement, "Страница")

elementsManager.addElement(PageElement, "PageElement", "Страница")
