import { IdGeneratorQueueInboxItem, IdGeneratorRequest } from "@/parser/visitorTools/idGenerator"
import { BaseElement } from "./baseElement"
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class TableEmptyElement extends BaseElement {
  public type = "ПустойЭлементТаблицы"

  public getIdTemplate(_request: IdGeneratorRequest): string {
    return ""
  }
  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    return []
  }

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(TableEmptyElement, "ПустойЭлементТаблицы")

elementsManager.addElement(TableEmptyElement, "TableEmptyElement", "ПустойЭлементТаблицы")
