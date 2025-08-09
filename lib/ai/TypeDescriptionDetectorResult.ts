import { Expose, Type } from "class-transformer"
import { ITypeDescriptionDetectorResultItem } from "./interfaces"
import { TypeDescription } from "@/elements"

export class TypeDescriptionDetectorResultItem implements ITypeDescriptionDetectorResultItem {
  @Expose({ name: "Идентификатор" })
  public id: string

  @Expose({ name: "ОписаниеТипов" })
  @Type(() => TypeDescription)
  public types: TypeDescription[]

  constructor(id: string, types: TypeDescription[]) {
    this.id = id
    this.types = types
  }
}
