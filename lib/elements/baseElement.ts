import { Expose, Transform } from "class-transformer"
import "reflect-metadata"
import { IdGeneratorQueueInboxItem, IdGeneratorRequest } from "../parser/visitorTools/idGenerator"
import { CstElementPosition, CstPath, CstPathHelper } from "./cstPathHelper"
import { PropertiesTransformer } from "@/importer/propertiesTransformer"
import { PropertyValue, ElementListType, PropertyAlignment } from "./types"
import { IBaseElement } from "./interfaces"

export abstract class BaseElement implements IBaseElement {
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

  public parent: IBaseElement | undefined = undefined

  public parentList: ElementListType | undefined

  public static readonly childrenFields: ElementListType[] = []

  public getList(listType: ElementListType): Array<IBaseElement> | undefined {
    if (!this.getChildrenFields().includes(listType)) return undefined

    const itemsArray = this[listType as unknown as keyof BaseElement] as Array<IBaseElement>
    return itemsArray
  }

  public add(listType: ElementListType, items: IBaseElement[]): void {
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

  public getElementByElementId(id: string): IBaseElement | undefined {
    if (this.elementId === id) return this

    for (let listType of this.getChildrenFields()) {
      const list = this.getList(listType)
      if (!list) continue

      for (let item of list) {
        const result = item.getElementByElementId(id)
        if (result) return result
      }
    }
  }

  public getAllElements(): IBaseElement[] {
    const result: IBaseElement[] = [this]
    for (let listType of this.getChildrenFields()) {
      const list = this.getList(listType)
      if (!list) continue

      for (let item of list) {
        result.push(...item.getAllElements())
      }
    }

    return result
  }

  public findElementByCstPath(path: CstPath): IBaseElement | undefined {
    return CstPathHelper.findElementByCstPath(this, path)
  }

  public getInContainerPosition(path: CstPath): CstElementPosition {
    return CstPathHelper.getInContainerPosition(this, path)
  }

  public getElementPosition(element: IBaseElement, path: CstPath): CstElementPosition | undefined {
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
    const existingKey = this.getNormalizedKey(key)
    return existingKey ? this.properties.get(existingKey) : undefined
  }

  public setProperty(key: string, value: PropertyValue | undefined) {
    const properties = this.properties
    const existingKey = this.getNormalizedKey(key)
    if (existingKey) {
      properties.delete(existingKey)
    }

    if (value === undefined) return

    properties.set(key, value)
  }

  private getNormalizedKey(key: string): string | undefined {
    return Array.from(this.properties.keys()).find((existingKey) => existingKey.toLowerCase() === key.toLowerCase())
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
