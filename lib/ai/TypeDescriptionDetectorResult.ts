import { Expose, Type } from "class-transformer"
import { ITypeDescriptionDetectorResultItem } from "./interfaces"
import { TypeDescription } from "@/elements"

export class TypeDescriptionDetectorResultItem implements ITypeDescriptionDetectorResultItem {
  @Expose({ name: "Идентификатор" })
  public id: string

  @Expose({ name: "ОписаниеТипов" })
  @Type(() => TypeDescription)
  public type: TypeDescription

  @Expose({ name: "Новый" })
  public isNew: boolean

  constructor(id: string, type: TypeDescription, isNew: boolean) {
    this.id = id
    this.type = type
    this.isNew = isNew
  }
}
