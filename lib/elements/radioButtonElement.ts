import { Expose, Type } from "class-transformer"
import { TypeDescription } from "./typeDescription"
import { BaseElementWithAttributes } from "./baseElementWithAttributes "
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class RadioButtonElement extends BaseElementWithAttributes {
  public type = "ПолеПереключателя"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеПереключателя"

  @Expose({ name: "Значение" })
  public value: number = 0

  @Expose({ name: "ОписаниеТипов" })
  @Type(() => TypeDescription)
  public typeDescription: TypeDescription = new TypeDescription("Число", { digits: 10 })

  protected get defaultId(): string {
    return "Переключатель"
  }

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(RadioButtonElement, "ПолеПереключателя")

elementsManager.addElement(RadioButtonElement, "RadioButtonElement", "ПолеПереключателя")
