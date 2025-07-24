import { Expose, Type } from "class-transformer"
import { TypeDescription, BaseElementWithAttributes } from "./index"
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"
import { IAttributes } from "./interfaces"
import { Attribute } from "./attributes"

export class InputElement extends BaseElementWithAttributes {
  public type = "ПолеВвода"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  @Expose({ name: "Значение" })
  public value: string = ""

  @Expose({ name: "ОписаниеТипов" })
  @Type(() => TypeDescription)
  public typeDescription: TypeDescription = new TypeDescription()

  public getAttributes(): IAttributes {
    const attributes: IAttributes = super.getAttributes()
    attributes.set(this.attributeId, new Attribute(this.typeDescription))
    return attributes
  }

  protected get defaultId(): string {
    return "ПолеВвода"
  }

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(InputElement, "ПолеВвода")

elementsManager.addElement(InputElement, "InputElement", "ПолеВвода")
