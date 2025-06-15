import { Exclude, Expose } from "class-transformer"
import "reflect-metadata"
import { IdGeneratorQueueInboxItem, IdGeneratorRequest } from "../parser/visitorTools/idGenerator"
import { CstPathHelper } from "./cstPathHelper"

export type CstPath = Array<{ type: any; parentIndex: number; parentList: ElementListType }>

export enum ElementListType {
  Items = "items",
  Columns = "columns",
  Rows = "rows",
}

export enum TableCellAlignment {
  Left = "Лево",
  Center = "Центр",
  Right = "Право",
}

export abstract class BaseElement {
  @Expose({ name: "Тип" })
  public type: string = ""

  @Expose({ name: "ТипЭлемента", groups: ["production"] })
  public elementType: string = ""

  @Expose({ name: "ВидЭлемента", groups: ["production"] })
  public elementKind: string = ""

  @Expose({ name: "НаборСвойств" })
  public properties: { [key: string]: any } = {}

  @Expose({ name: "УИД", groups: ["production"] })
  public elementId: string = ""

  @Expose({ name: "НеизвестныеСвойства", groups: ["production"] })
  public unknownProperties: string[] = []

  @Expose({ name: "ТипыСвойств", groups: ["production"] })
  public propertyTypes: {} = {}

  @Exclude()
  public parent: BaseElement | undefined = undefined

  @Exclude()
  public parentList: ElementListType | undefined

  public static readonly childrenFields: ElementListType[] = []

  public getList(listType: ElementListType): Array<BaseElement> | undefined {
    if (!this.getChildrenFields().includes(listType)) return undefined

    const itemsArray = this[listType as unknown as keyof BaseElement] as Array<BaseElement>
    return itemsArray
  }

  public add(listType: ElementListType, items: BaseElement[]): void {
    const itemsArray = this.getList(listType)
    if (!itemsArray) {
      throw new Error(`List ${listType} not found in ${this.type}`)
    }

    itemsArray.push(...items)

    for (let item of items) {
      item.parent = this
      item.parentList = listType
    }
  }

  public getCstPath(): CstPath {
    return CstPathHelper.getCstPath(this)
  }

  public findElementByCstPath(path: CstPath): BaseElement | undefined {
    return CstPathHelper.findElementByCstPath(this, path)
  }

  public getProperty(key: string): any {
    const lowerKey = key.toLowerCase()
    for (const propKey in this.properties) {
      if (propKey.toLowerCase() === lowerKey) {
        return this.properties[propKey]
      }
    }
    return undefined
  }

  public getAlignment(): TableCellAlignment {
    const alignment = this.getProperty("ГоризонтальноеПоложение")
    if (!alignment) {
      return TableCellAlignment.Left
    }

    return alignment as TableCellAlignment
  }

  public getChildrenFields(): ElementListType[] {
    return (this.constructor as any).childrenFields
  }

  public abstract getIdTemplate(request: IdGeneratorRequest): string

  public abstract getIdGeneratorQueue(): IdGeneratorQueueInboxItem[]
}
