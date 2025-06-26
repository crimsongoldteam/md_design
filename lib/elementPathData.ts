import { Expose, Type, Transform } from "class-transformer"
import { CstPathItem, CstPath } from "./elements/cstPathHelper"
import { PlainToClassDiscriminator } from "./importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "./importer/plaintToClassTransformer"
import { IBaseElement } from "./elements/interfaces"
import { BaseElement } from "./elements/baseElement"

export class ElementPathData {
  @Expose({ name: "Элемент" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform, { toClassOnly: true })
  public item: IBaseElement

  @Expose({ name: "Путь" })
  @Type(() => CstPathItem)
  public path: CstPath

  @Expose({ name: "ЭтоНовый" })
  public isNew: boolean

  constructor(item: IBaseElement, path: CstPath, isNew: boolean) {
    this.item = item
    this.path = path
    this.isNew = isNew
  }
}
