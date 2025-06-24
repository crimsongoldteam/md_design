import { Exclude, Expose, Type } from "class-transformer"
import { BaseElement } from "./baseElement"
import { ElementListType } from "./types"
import { TypeDescription } from "./typeDescription"
import { TableColumnGroupElement } from "./tableColumnGroupElement"
import { IdGeneratorType, IdGeneratorQueueInboxItem, IdGeneratorRequest } from "@/parser/visitorTools/idGenerator"
import { TableElement } from "./tableElement"
import { IdFormatter, IdFormatterRule } from "@/parser/visitorTools/idFormatter"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class TableColumnElement extends BaseElement {
  public type = "КолонкаТаблицы"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  private _hasValue: boolean = false

  protected static aligmentProperty: string = "ГоризонтальноеПоложение"

  @Expose({ name: "УИДАтрибута", groups: ["production"] })
  public attributeId: string = ""

  @Expose({ name: "ОписаниеТипов" })
  @Type(() => TypeDescription)
  public typeDescription: TypeDescription = new TypeDescription()

  @Expose({ name: "ЕстьЗначение" })
  public get hasValue(): boolean {
    return this._hasValue || !this.hasCheckbox
  }

  public set hasValue(value: boolean) {
    this._hasValue = value
  }

  @Expose({ name: "ЕстьГруппаВместе" })
  public get needCheckboxGroup(): boolean {
    return this.hasCheckbox && this._hasValue
  }

  @Expose({ name: "ЕстьВертикальнаяГруппа" })
  public get needVerticalGroup(): boolean {
    return this.items.length > 0
  }

  @Expose({ name: "ЕстьГоризонтальнаяГруппа" })
  public get needHorizontalGroup(): boolean {
    return this.items.length > 1
  }

  @Expose({ name: "ЕстьФлажок" })
  public hasCheckbox: boolean = false

  @Expose({ name: "УИДФлажок", groups: ["production"] })
  public checkboxElementId: string = ""

  @Expose({ name: "УИДАтрибутаФлажок", groups: ["production"] })
  public checkboxAttributeId: string = ""

  @Expose({ name: "УИДГруппаВместе", groups: ["production"] })
  public checkboxGroupElementId: string = ""

  @Expose({ name: "УИДВертикальнаяГруппа", groups: ["production"] })
  public verticalGroupElementId: string = ""

  @Expose({ name: "УИДГоризонтальнаяГруппа", groups: ["production"] })
  public horizontalGroupElementId: string = ""

  @Expose({ name: "ОписаниеТиповФлажок" })
  public typeDescriptionCheckbox: TypeDescription = new TypeDescription("Булево")

  @Expose({ name: "Колонки" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  @Exclude()
  public table: TableElement | undefined = undefined

  public static readonly childrenFields = [ElementListType.Items]

  public get isContainer(): boolean {
    return false
  }

  public getAllColumns(): TableColumnElement[] {
    const columns: TableColumnElement[] = []
    for (const column of this.items) {
      if (column instanceof TableColumnElement) {
        columns.push(column)
      }
      columns.push(...column.getAllColumns())
    }
    return columns
  }

  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    if (!this.table) {
      throw new Error("Table is not set")
    }

    const highPriority: boolean = this.getProperty("Путь") !== undefined || this.getProperty("Имя") !== undefined

    let result: IdGeneratorQueueInboxItem[] = []
    if (this._hasValue) {
      result.push({ type: IdGeneratorType.Attribute, highPriority: highPriority, parent: this.table })
      result.push({ type: IdGeneratorType.Element, highPriority: highPriority })
    }

    if (this.hasCheckbox) {
      result.push({ type: IdGeneratorType.TableCheckboxAttibute, highPriority: highPriority, parent: this.table })
      result.push({ type: IdGeneratorType.TableCheckboxElement, highPriority: highPriority })
    }

    if (this.needCheckboxGroup) {
      result.push({ type: IdGeneratorType.TableCheckboxGroupElement, highPriority: highPriority })
    }

    if (this.needVerticalGroup) {
      result.push({ type: IdGeneratorType.TableVerticalGroupElement, highPriority: highPriority })
    }

    if (this.needHorizontalGroup) {
      result.push({ type: IdGeneratorType.TableHorizontalGroupElement, highPriority: highPriority })
    }

    return result
  }

  public getIdTemplate(request: IdGeneratorRequest): string {
    if (request.type === IdGeneratorType.Attribute) {
      return this.getAttributeIdTemplate()
    }
    if (request.type === IdGeneratorType.Element) {
      return this.getElementIdTemplate()
    }

    if (request.type === IdGeneratorType.TableCheckboxAttibute) {
      return this.getTableCheckboxAttributeIdTemplate()
    }

    if (request.type === IdGeneratorType.TableCheckboxElement) {
      return this.getTableCheckboxElementIdTemplate()
    }

    if (request.type === IdGeneratorType.TableCheckboxGroupElement) {
      return this.getTableCheckboxGroupElementIdTemplate()
    }

    if (request.type === IdGeneratorType.TableVerticalGroupElement) {
      return this.getTableVerticalGroupElementIdTemplate()
    }

    if (request.type === IdGeneratorType.TableHorizontalGroupElement) {
      return this.getTableHorizontalGroupElementIdTemplate()
    }

    throw new Error("Unknown request type")
  }

  private getAttributeIdTemplate(): string {
    const rules: IdFormatterRule[] = [{ property: "Путь" }, { property: "Имя" }, { property: "Заголовок" }]
    return IdFormatter.format(this, rules) ?? "Колонка"
  }

  private getElementIdTemplate(): string {
    if (!this.table) {
      throw new Error("Table is not set")
    }

    const tableId = this.table.elementId
    return this.getBaseElementIdTemplate(tableId)
  }

  getTableCheckboxAttributeIdTemplate(): string {
    if (!this.table) {
      throw new Error("Table is not set")
    }

    const tableId = this.table.elementId

    const prefix = "Флажок"

    const rules: IdFormatterRule[] = [{ property: "ПутьФлажок" }]

    if (this._hasValue) {
      rules.push({ property: "ИмяФлажок" })
      rules.push({ property: "Путь", prefix: prefix })
      rules.push({ property: "Заголовок", prefix: prefix })
    } else {
      rules.push({ property: "Путь" })
      rules.push({ property: "ИмяФлажок" })
      rules.push({ property: "Заголовок" })
    }

    return tableId + (IdFormatter.format(this, rules) ?? prefix)
  }

  getTableCheckboxElementIdTemplate(): string {
    if (!this.table) {
      throw new Error("Table is not set")
    }

    const tableId = this.table.elementId

    const rules: IdFormatterRule[] = [{ property: "ИмяФлажок" }]
    let result = IdFormatter.format(this, rules)
    if (result) {
      return result
    }

    return tableId + this.checkboxElementId
  }

  getTableCheckboxGroupElementIdTemplate(): string {
    return this.getBaseElementIdTemplate("ГруппаВместе")
  }

  getTableVerticalGroupElementIdTemplate(): string {
    return this.getBaseElementIdTemplate("ГруппаВертикальная")
  }

  getTableHorizontalGroupElementIdTemplate(): string {
    return this.getBaseElementIdTemplate("ГруппаГоризонтальная")
  }

  private getBaseElementIdTemplate(prefix: string): string {
    const rules: IdFormatterRule[] = [{ property: "Имя" }]
    let result = IdFormatter.format(this, rules)
    if (result) {
      return result
    }

    return prefix + this.attributeId
  }
}

PlainToClassDiscriminator.addClass(TableColumnElement, "КолонкаТаблицы")

elementsManager.addElement(TableColumnElement, "TableColumnElement", "КолонкаТаблицы")
