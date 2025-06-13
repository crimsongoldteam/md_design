import { Exclude, Expose } from "class-transformer"
import "reflect-metadata"
import { NameGenerator } from "../parser/visitorTools/nameGenerator"
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
  public id: string = ""

  @Expose({ name: "НеизвестныеСвойства", groups: ["production"] })
  public unknownProperties: string[] = []

  @Expose({ name: "ТипыСвойств", groups: ["production"] })
  public propertyTypes: {} = {}

  @Exclude()
  public parent: BaseElement = this

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

  public defineElementName(nameGenerator: NameGenerator) {
    this.id = nameGenerator.generateName(this)
  }

  public getBaseElementName(fallback: string = this.type): string {
    let text =
      this.toPascalCase(this.getPropertyCaseInsensitive("Имя"), fallback) ??
      this.toPascalCase(this.getPropertyCaseInsensitive("Заголовок"), fallback) ??
      fallback
    return text
  }

  protected getPropertyCaseInsensitive(key: string): any {
    const lowerKey = key.toLowerCase()
    for (const propKey in this.properties) {
      if (propKey.toLowerCase() === lowerKey) {
        return this.properties[propKey]
      }
    }
    return undefined
  }

  public getAlignment(): TableCellAlignment {
    const alignment = this.getPropertyCaseInsensitive("ГоризонтальноеПоложение")
    if (!alignment) {
      return TableCellAlignment.Left
    }

    return alignment as TableCellAlignment
  }

  public getChildrenFields(): ElementListType[] {
    return (this.constructor as any).childrenFields
  }

  /**
   * Преобразует строку в PascalCase формат
   * @param input - Входная строка для преобразования
   * @param prefixIfStartsWithDigit - Префикс, если строка начинается с цифры
   * @returns Строка в PascalCase формате
   */
  private toPascalCase(input: string | undefined, prefixIfStartsWithDigit: string): string | undefined {
    if (!input || typeof input !== "string") return undefined

    const withNumberReplaced = input.replace(/№/g, "Номер")

    const cleaned = withNumberReplaced.replace(/[^a-zA-Zа-яА-Я0-9_ \t]/g, "")

    if (!cleaned) {
      return undefined
    }

    const parts = cleaned.split(/[ \t]+/).filter(Boolean)

    if (parts.length === 0) return undefined

    let result = parts.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join("")

    if (/^\d/.test(cleaned)) {
      result = prefixIfStartsWithDigit + result
    }

    return result
  }
}
