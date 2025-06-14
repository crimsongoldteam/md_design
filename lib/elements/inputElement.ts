import { Expose } from "class-transformer"
import { TypeDescription } from "./typeDescription"
import { BaseElementWithAttributes } from "./baseElementWithAttributes "

export class InputElement extends BaseElementWithAttributes {
  public type = "ПолеВвода"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  @Expose({ name: "ИмяРеквизита" })
  public dataAttribute: string = ""

  @Expose({ name: "Значение" })
  public value: string = ""

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription()

  protected get defaultId(): string {
    return "ПолеВвода"
  }
}
