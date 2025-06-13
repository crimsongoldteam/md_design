import { Expose } from "class-transformer"
import { BaseElement } from "./baseElement"

export class OneLineGroupElement extends BaseElement {
  public type = "ОднострочнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  @Expose({ name: "Элементы" })
  public readonly items: BaseElement[] = []

  public childrenFields = ["items"]
}
