import { Expose, Type, Transform } from "class-transformer"
import { CstPathItem } from "./elements/cstPathHelper"
import type { CstPath } from "./elements/cstPathHelper"
import { PlainToClassDiscriminator } from "./importer/plainToClassDiscriminator"
import { PlainToClassTransformer } from "./importer/plaintToClassTransformer"
import type { IBaseElement } from "./elements/interfaces"
import { BaseElement } from "./elements/baseElement"
import { IElementPathData } from "./editor/interfaces"

export class ElementPathData implements IElementPathData {
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
