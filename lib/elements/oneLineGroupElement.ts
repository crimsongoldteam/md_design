import { Expose } from "class-transformer"
import { BaseElement } from "./baseElement"
import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"

export class OneLineGroupElement extends BaseElementWithoutAttributes {
  public type = "ОднострочнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  protected get defaultId(): string {
    return "Группа"
  }

  @Expose({ name: "Элементы" })
  public readonly items: BaseElement[] = []

  public childrenFields = ["items"]
}
