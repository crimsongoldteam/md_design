import { Expose, Transform, Type } from "class-transformer"

import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "../importer/plaintToClassTransformer"
import { elementsManager } from "@/elementsManager"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { BaseElement } from "./baseElement"
import { ElementListType } from "./types"

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
