import { Expose, Type } from "class-transformer"
import { TypeDescription, BaseElementWithAttributes } from "./index"
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class InputElement extends BaseElementWithAttributes {
  public type = "ПолеВвода"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  @Expose({ name: "Значение" })
  public value: string = ""

  @Expose({ name: "ОписаниеТипов" })
  @Type(() => TypeDescription)
  public typeDescription: TypeDescription = new TypeDescription()

  protected get defaultId(): string {
    return "ПолеВвода"
  }

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(InputElement, "ПолеВвода")

elementsManager.addElement(InputElement, "InputElement", "ПолеВвода")
