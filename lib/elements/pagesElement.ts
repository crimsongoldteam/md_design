import { Expose, Transform, Type } from "class-transformer"
import { BaseElement } from "./baseElement"
import { ElementListType } from "./types"
import { PageElement } from "./pageElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"
import { elementsManager } from "@/elementsManager"

export class PagesElement extends BaseElementWithoutAttributes {
  public type = "Страницы"
  public elementType = "ГруппаФормы"
  public elementKind = "Страницы"

  protected get defaultId(): string {
    return "Страницы"
  }

  @Expose({ name: "Страницы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform, { toClassOnly: true })
  public items: PageElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(PagesElement, "Страницы")

elementsManager.addElement(PagesElement, "PagesElement", "Страницы")
