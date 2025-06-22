import { Expose, Transform, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"
import { elementsManager } from "@/elementsManager"

export class FormElement extends BaseElementWithoutAttributes {
  public type = "Форма"
  public elementType = "Форма"
  public elementKind = "БезВида"

  @Expose({ name: "Элементы" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform, { toClassOnly: true })
  public items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  protected get defaultId(): string {
    return "Форма"
  }

  public get isContainer(): boolean {
    return true
  }
}

PlainToClassDiscriminator.addClass(FormElement, "Форма")

elementsManager.addElement(FormElement, "FormElement", "Форма")
