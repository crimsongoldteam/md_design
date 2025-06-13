import { Expose } from "class-transformer"
import { BaseElement } from "./baseElement"
import { TypeDescription } from "./typeDescription"

export class CheckboxElement extends BaseElement {
  public type = "ПолеФлажка"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеФлажка"

  @Expose({ name: "Значение" })
  public value: boolean = false

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription("Булево")

  public getBaseElementName(): string {
    return super.getBaseElementName("Флажок")
  }
}
