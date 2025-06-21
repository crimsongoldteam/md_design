import { IdGeneratorRequest, IdGeneratorQueueInboxItem } from "@/parser/visitorTools/idGenerator"
import { BaseElement, ElementListType } from "./baseElement"
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"

export class EditorContainerElement extends BaseElement {
  public readonly items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public getIdTemplate(_request: IdGeneratorRequest): string {
    return ""
  }
  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    return []
  }
}

PlainToClassDiscriminator.addClass(EditorContainerElement, "КонтейнерРедактора")
