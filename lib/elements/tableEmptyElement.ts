import { IdGeneratorQueueInboxItem, IdGeneratorRequest } from "@/parser/visitorTools/idGenerator"
import { BaseElement } from "./baseElement"
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"

export class TableEmptyElement extends BaseElement {
  public type = "ПустойЭлементТаблицы"

  public getIdTemplate(_request: IdGeneratorRequest): string {
    return ""
  }
  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    return []
  }
}

PlainToClassDiscriminator.addClass(TableEmptyElement, "ПустойЭлементТаблицы")
