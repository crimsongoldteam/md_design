import { Expose, Type } from "class-transformer"
import { ITypeDescriptionDetectorResultItem } from "./interfaces"
import { TypeDescription } from "@/elements"

export class TypeDescriptionDetectorResultItem implements ITypeDescriptionDetectorResultItem {
  @Expose({ name: "Идентификатор" })
  public id: string

  @Expose({ name: "ОписаниеТипов" })
  @Type(() => TypeDescription)
  public types: TypeDescription[]

  @Expose({ name: "ПредставлениеОписаниеТипов" })
  public typesFormat: string[]

  constructor(id: string, types: TypeDescription[], typesFormat: string[]) {
    this.id = id
    this.types = types
    this.typesFormat = typesFormat
  }
}
