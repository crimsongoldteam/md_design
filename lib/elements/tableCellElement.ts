import { Expose } from "class-transformer"
import { BaseElement } from "./baseElement"

export class TableCellElement extends BaseElement {
  public type = "ЯчейкаТаблицы"

  @Expose({ name: "Значение" })
  public value: string = ""

  @Expose({ name: "ЕстьФлажок" })
  public hasCheckbox: boolean = false

  @Expose({ name: "ЗначениеФлажка" })
  public valueCheckbox: boolean = false

  @Expose({ name: "УИДКолонки" })
  public uuidColumn: string = ""

  @Expose({ name: "УИДКолонкиФлажок" })
  public uuidCheckbox: string = ""

  public isEmpty(): boolean {
    return this.value.trim() == ""
  }
}
