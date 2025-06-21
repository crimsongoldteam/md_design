import { Expose } from "class-transformer"
import { TypeDescription } from "./typeDescription"
import { BaseElementWithAttributes } from "./baseElementWithAttributes "
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"

export class CheckboxElement extends BaseElementWithAttributes {
  public type = "ПолеФлажка"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеФлажка"

  @Expose({ name: "Значение" })
  public value: boolean = false

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription("Булево")

  protected get defaultId(): string {
    return "Флажок"
  }
}

PlainToClassDiscriminator.addClass(CheckboxElement, "ПолеФлажка")
