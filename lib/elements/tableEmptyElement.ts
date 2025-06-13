import { BaseElement } from "./baseElement"

export class TableEmptyElement extends BaseElement {
  public type = "ПустойЭлементТаблицы"
  public getBaseElementName(): string {
    throw new Error("Method not implemented.")
  }
}
