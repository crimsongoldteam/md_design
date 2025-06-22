import { IdGeneratorRequest, IdGeneratorQueueInboxItem } from "@/parser/visitorTools/idGenerator"
import { BaseElement, ElementListType } from "./baseElement"
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class EditorContainerElement extends BaseElement {
  public readonly items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]

  public getIdTemplate(_request: IdGeneratorRequest): string {
    return ""
  }
  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    return []
  }

  public get isContainer(): boolean {
    return true
  }
}

PlainToClassDiscriminator.addClass(EditorContainerElement, "КонтейнерРедактора")

elementsManager.addElement(EditorContainerElement, "EditorContainerElement", "КонтейнерРедактора")
