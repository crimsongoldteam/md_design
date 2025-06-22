import { Expose, Transform } from "class-transformer"
import "reflect-metadata"
import { IdGeneratorQueueInboxItem, IdGeneratorRequest } from "../parser/visitorTools/idGenerator"
import { CstElementPosition, CstPath, CstPathHelper } from "./cstPathHelper"
import { PropertiesTransformer } from "@/importer/propertiesTransformer"

export enum ElementListType {
  Items = "items",
  Columns = "columns",
  Rows = "rows",
}

export enum PropertyAlignment {
  Left = "Лево",
  Center = "Центр",
  Right = "Право",
}

export type ProperyPrimitiveValue = string | boolean | number
export type PropertyValue = ProperyPrimitiveValue | ProperyPrimitiveValue[]

export abstract class BaseElement {
  protected static aligmentProperty: string = "ГоризонтальноеПоложениеВГруппе"

  @Expose({ name: "Тип" })
  public type: string = ""

  @Expose({ name: "ТипЭлемента", groups: ["production"] })
  public elementType: string = ""

  @Expose({ name: "ВидЭлемента", groups: ["production"] })
  public elementKind: string = ""

  @Expose({ name: "НаборСвойств" })
  @Transform(PropertiesTransformer.transform, { toClassOnly: true })
  public readonly properties: Map<string, PropertyValue> = new Map()

  @Expose({ name: "УИД", groups: ["production"] })
  public elementId: string = ""

  @Expose({ name: "НеизвестныеСвойства", groups: ["production"], toPlainOnly: true })
  public unknownProperties: string[] = []

  @Expose({ name: "ТипыСвойств", groups: ["production"], toPlainOnly: true })
  public propertyTypes: {} = {}

  public abstract get isContainer(): boolean

  public parent: BaseElement | undefined = undefined

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

  public getInContainerPosition(path: CstPath): CstElementPosition {
    return CstPathHelper.getInContainerPosition(this, path)
  }

  public getElementPosition(element: BaseElement, path: CstPath): CstElementPosition | undefined {
    return CstPathHelper.getElementPosition(this, element, path)
  }

  public updateParents() {
    for (let listType of this.getChildrenFields()) {
      const list = this.getList(listType)
      if (!list) continue

      for (let item of list) {
        item.parent = this
        item.parentList = listType
      }
    }
  }

  public getProperty(key: string): PropertyValue | undefined {
    const lowerKey = key.toLowerCase()
    for (const propKey in this.properties) {
      if (propKey.toLowerCase() === lowerKey) {
        return this.properties.get(propKey)
      }
    }
    return undefined
  }

  public setProperty(key: string, value: PropertyValue | undefined) {
    const properties = this.properties
    const lowerKey = key.toLowerCase()

    for (const prop in properties) {
      if (prop.toLowerCase() === lowerKey) {
        properties.delete(prop)
      }
    }

    if (value === undefined) return

    properties.set(key, value)
  }

  public get alignment(): PropertyAlignment {
    const alignment = this.getProperty((this.constructor as any).aligmentProperty)
    if (!alignment) {
      return PropertyAlignment.Left
    }

    return alignment as PropertyAlignment
  }

  public set alignment(alignment: PropertyAlignment) {
    this.setProperty((this.constructor as any).aligmentProperty, alignment)
  }

  public getChildrenFields(): ElementListType[] {
    return (this.constructor as any).childrenFields
  }

  public abstract getIdTemplate(request: IdGeneratorRequest): string

  public abstract getIdGeneratorQueue(): IdGeneratorQueueInboxItem[]
}
