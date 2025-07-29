import { Expose } from "class-transformer"
import { IAttribute, IAttributes } from "./interfaces"
import { TypeDescription } from "./typeDescription"

export class Attribute implements IAttribute {
  @Expose({ name: "ОписаниеТипов" })
  typeDescription: TypeDescription

  @Expose({ name: "Значения" })
  items?: IAttributes[]

  constructor(typeDescription: TypeDescription) {
    this.typeDescription = typeDescription
  }
}

export class Attributes extends Map<string, IAttribute> {}
