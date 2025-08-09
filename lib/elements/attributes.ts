import { Expose, Type } from "class-transformer"
import { IAttribute } from "./interfaces"
import { TypeDescription } from "./typeDescription"

export class Attribute implements IAttribute {
  @Expose({ name: "ОписаниеТипов" })
  typeDescription: TypeDescription

  @Expose({ name: "Значения" })
  @Type(() => Attribute)
  items?: Map<string, IAttribute>

  constructor(typeDescription: TypeDescription) {
    this.typeDescription = typeDescription
  }
}

export class Attributes extends Map<string, IAttribute> {}
