import { IdNumberDistributor } from "./idNumberDistributor"
import { IBaseElement } from "@/elements/interfaces"

export enum IdGeneratorType {
  Attribute = "attributeId",
  TableCheckboxAttibute = "checkboxAttributeId",
  Element = "elementId",
  TableCheckboxElement = "checkboxElementId",
  TableCheckboxGroupElement = "checkboxGroupElementId",
  TableVerticalGroupElement = "verticalGroupElementId",
  TableHorizontalGroupElement = "horizontalGroupElementId",
}

export interface IdGeneratorRequest {
  parent: IBaseElement | undefined
  type: IdGeneratorType
  generator: IdGenerator
}

export interface IdGeneratorQueueInboxItem {
  type: IdGeneratorType
  parent?: IBaseElement
  highPriority: boolean
}

export interface IdGeneratorQueueItem extends IdGeneratorQueueInboxItem {
  element: IBaseElement
  order: number
}

export class IdGenerator {
  private readonly elements: IBaseElement[] = []
  private readonly queue: IdGeneratorQueueItem[] = []
  private readonly elementNameDistributor: IdNumberDistributor = new IdNumberDistributor()
  private readonly attributeNameDistributor: IdNumberDistributor = new IdNumberDistributor()

  add(element: IBaseElement): void {
    this.elements.push(element)
  }

  public generate(): void {
    this.fillQueue()
    this.sort()
    this.generateNames()
  }

  reset(): void {
    this.elements.length = 0
    this.queue.length = 0
    this.elementNameDistributor.reset()
    this.attributeNameDistributor.reset()
  }

  private generateNames(): void {
    for (const item of this.queue) {
      const template = item.element.getIdTemplate({
        parent: item.parent,
        type: item.type,
        generator: this,
      })

      const numberedName = this.isAttribute(item.type)
        ? this.attributeNameDistributor.getNumberedName(template, item.parent)
        : this.elementNameDistributor.getNumberedName(template)

      ;(item.element as any)[item.type] = numberedName
    }
  }

  private isAttribute(type: IdGeneratorType): boolean {
    return type === IdGeneratorType.Attribute || type === IdGeneratorType.TableCheckboxAttibute
  }

  private fillQueue(): void {
    let order = 0
    for (const element of this.elements) {
      const queue = element.getIdGeneratorQueue()
      for (const item of queue) {
        const queueItem: IdGeneratorQueueItem = {
          ...item,
          element: element,
          order: order++,
        }
        this.queue.push(queueItem)
      }
    }
  }

  private sort(): void {
    this.queue.sort((a, b) => {
      // Сортировка по типу
      if (a.type !== b.type) {
        return this.getTypeOrder(a.type) - this.getTypeOrder(b.type)
      }

      if (a.highPriority !== b.highPriority) {
        return a.highPriority ? -1 : 1
      }

      // Сортировка по наличию родителя (элементы с родителем в конце)
      if (!a.parent && b.parent) return -1
      if (a.parent && !b.parent) return 1
      if (!a.parent && !b.parent) return a.order - b.order

      // Для элементов с родителем сортируем по order
      return a.order - b.order
    })
  }

  private getTypeOrder(type: IdGeneratorType): number {
    return {
      [IdGeneratorType.Attribute]: 0,
      [IdGeneratorType.TableCheckboxAttibute]: 1,
      [IdGeneratorType.Element]: 2,
      [IdGeneratorType.TableCheckboxElement]: 3,
      [IdGeneratorType.TableCheckboxGroupElement]: 4,
      [IdGeneratorType.TableVerticalGroupElement]: 5,
      [IdGeneratorType.TableHorizontalGroupElement]: 6,
    }[type]
  }
}
