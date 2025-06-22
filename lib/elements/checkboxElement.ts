import { Expose, Type } from "class-transformer"
import { TypeDescription } from "./typeDescription"
import { BaseElementWithAttributes } from "./baseElementWithAttributes "
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class CheckboxElement extends BaseElementWithAttributes {
  public type = "ПолеФлажка"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеФлажка"

  @Expose({ name: "Значение" })
  public value: boolean = false

  @Expose({ name: "ОписаниеТипов" })
  @Type(() => TypeDescription)
  public typeDescription: TypeDescription = new TypeDescription("Булево")

  protected get defaultId(): string {
    return "Флажок"
  }

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(CheckboxElement, "ПолеФлажка")

elementsManager.addElement(CheckboxElement, "CheckboxElement", "ПолеФлажка")
