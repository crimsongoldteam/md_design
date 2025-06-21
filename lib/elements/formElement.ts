import { Expose, Transform, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"

export class FormElement extends BaseElementWithoutAttributes {
  public type = "Форма"
  public elementType = "Форма"
  public elementKind = "БезВида"

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform)
  public items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  protected get defaultId(): string {
    return "Форма"
  }
}

PlainToClassDiscriminator.addClass(FormElement, "Форма")
