import { Expose, Type, Transform } from "class-transformer"
import { BaseElement } from "./elements/baseElement"
import { CstPathItem, CstPath } from "./elements/cstPathHelper"
import { PlainToClassDiscriminator } from "./importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "./importer/plaintToClassTransformer"

export class ElementPathData {
  @Expose({ name: "Элемент" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform, { toClassOnly: true })
  public item: BaseElement

  @Expose({ name: "Путь" })
  @Type(() => CstPathItem)
  public path: CstPath

  @Expose({ name: "ЭтоНовый" })
  public isNew: boolean

  constructor(item: BaseElement, path: CstPath, isNew: boolean) {
    this.item = item
    this.path = path
    this.isNew = isNew
  }
}
