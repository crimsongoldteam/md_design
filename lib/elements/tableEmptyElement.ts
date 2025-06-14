import { IdGeneratorQueueInboxItem, IdGeneratorRequest } from "@/parser/visitorTools/idGenerator"
import { BaseElement } from "./baseElement"

export class TableEmptyElement extends BaseElement {
  public type = "ПустойЭлементТаблицы"
  public getBaseElementName(): string {
    throw new Error("Method not implemented.")
  }

  public getIdTemplate(_request: IdGeneratorRequest): string {
    return ""
  }
  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    return []
  }
}
