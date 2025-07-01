import { Expose, Transform } from "class-transformer"
import { BaseElement } from "./baseElement"
import { PropertyValue } from "./types"
import { IdGeneratorRequest, IdGeneratorQueueInboxItem } from "@/parser/visitorTools/idGenerator"
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"
import { PropertiesTransformer } from "@/importer/propertiesTransformer"

export class TableCellElement extends BaseElement {
  public type = "ЯчейкаТаблицы"

  @Expose({ name: "НаборСвойств" })
  @Transform(PropertiesTransformer.transform, { toClassOnly: true })
  public readonly properties: Map<string, PropertyValue> = new Map()

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

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(TableCellElement, "ЯчейкаТаблицы")

elementsManager.addElement(TableCellElement, "TableCellElement", "ЯчейкаТаблицы")
