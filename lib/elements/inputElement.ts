import { Expose } from "class-transformer"
import { BaseElement } from "./baseElement"
import { TypeDescription } from "./typeDescription"
import { NameGenerator } from "../parser/visitorTools/nameGenerator"

export class InputElement extends BaseElement {
  public type = "ПолеВвода"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  @Expose({ name: "ИмяРеквизита" })
  public dataAttribute: string = ""

  @Expose({ name: "Значение" })
  public value: string = ""

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription()

  public getBaseElementName(): string {
    return super.getBaseElementName("ПолеВвода")
  }

  public defineDataAttributeName(nameGenerator: NameGenerator) {
    this.dataAttribute = nameGenerator.generateName(this)
  }
}
