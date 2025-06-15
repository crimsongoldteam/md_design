import { Expose } from "class-transformer"
import { BaseElement } from "./baseElement"
import { IdGeneratorRequest, IdGeneratorQueueInboxItem } from "@/parser/visitorTools/idGenerator"

export class TableCellElement extends BaseElement {
  public type = "ЯчейкаТаблицы"

  @Expose({ name: "НаборСвойств" })
  public properties: { [key: string]: any } = {}

  @Expose({ name: "НеизвестныеСвойства", groups: ["production"] })
  public unknownProperties: string[] = []

  @Expose({ name: "Значение" })
  public value: string = ""

  @Expose({ name: "ЕстьФлажок" })
  public hasCheckbox: boolean = false

  @Expose({ name: "ЗначениеФлажка" })
  public valueCheckbox: boolean = false

  public isEmpty(): boolean {
    return this.value.trim() == ""
  }

  public getIdTemplate(_request: IdGeneratorRequest): string {
    return ""
  }
  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    return []
  }
}
