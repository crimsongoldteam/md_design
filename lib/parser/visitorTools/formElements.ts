import { Exclude, Expose } from "class-transformer"
import "reflect-metadata"
import { v4 as uuid } from "uuid"
import { NameGenerator } from "./nameGenerator"

export enum DateFractions {
  Time = "Время",
  Date = "Дата",
  DateTime = "ДатаВремя",
}

export enum TableCellAlignment {
  Left = "Лево",
  Center = "Центр",
  Right = "Право",
}

export abstract class BaseFormElement {
  @Expose({ name: "Тип" })
  public type: string = ""

  @Expose({ name: "ТипЭлемента", groups: ["production"] })
  public elementType: string = ""

  @Expose({ name: "ВидЭлемента", groups: ["production"] })
  public elementKind: string = ""

  @Expose({ name: "НаборСвойств" })
  public properties: { [key: string]: any } = {}

  @Expose({ name: "УИД", groups: ["production"] })
  public uuid: string = ""

  @Expose({ name: "НеизвестныеСвойства", groups: ["production"] })
  public unknownProperties: string[] = []

  @Expose({ name: "ТипыСвойств", groups: ["production"] })
  public propertyTypes: {} = {}

  @Expose({ name: "Формат", groups: ["production"] })
  public format: {} = {
    Результат: [],
    Длина: 0,
    РазрывСтрок: false,
  }

  @Exclude()
  public parent: BaseFormElement = this

  @Exclude()
  public childrenFields: string[] = []

  @Exclude()
  public location: Map<number, ElementLocation> = new Map<number, ElementLocation>()

  public add(field: string, items: BaseFormElement[]): void {
    const propertyName = field as keyof BaseFormElement
    ;(this[propertyName] as BaseFormElement[]).push(...items)

    for (let item of items) {
      item.parent = this
    }
  }

  public defineElementName(nameGenerator: NameGenerator) {
    this.uuid = nameGenerator.generateName(this)
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

export class FormElement extends BaseFormElement {
  public type = "Форма"
  public elementType = "Форма"
  public elementKind = "БезВида"

  @Expose({ name: "Элементы" })
  public items: BaseFormElement[] = []

  public childrenFields = ["items"]
}

export class OneLineGroupElement extends BaseFormElement {
  public type = "ОднострочнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  @Expose({ name: "Элементы" })
  public readonly items: BaseFormElement[] = []

  public childrenFields = ["items"]
}

export class HorizontalGroupElement extends BaseFormElement {
  public type = "ГоризонтальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  @Expose({ name: "Элементы" })
  public readonly items: VerticalGroupElement[] = []

  public childrenFields = ["items"]
}

export class VerticalGroupElement extends BaseFormElement {
  public type = "ВертикальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  @Expose({ name: "Элементы" })
  public readonly items: PageElement[] = []

  public childrenFields = ["items"]
}

export class PagesElement extends BaseFormElement {
  public type = "Страницы"
  public elementType = "ГруппаФормы"
  public elementKind = "Страницы"

  @Expose({ name: "Элементы" })
  public readonly items: PageElement[] = []

  public childrenFields = ["items"]
}

export class PageElement extends BaseFormElement {
  public type = "Страница"
  public elementType = "ГруппаФормы"
  public elementKind = "Страница"

  @Expose({ name: "Элементы" })
  public readonly items: BaseFormElement[] = []

  public childrenFields = ["items"]
}

export class LabelElement extends BaseFormElement {
  public type = "Надпись"
  public elementType = "ДекорацияФормы"
  public elementKind = "Надпись"
}

export class InputElement extends BaseFormElement {
  public type = "ПолеВвода"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  @Expose({ name: "ИмяРеквизита" })
  public dataAttribute: string = ""

  @Expose({ name: "Значение" })
  public value: string = ""

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription()

  public getBaseElementName(): string {
    return super.getBaseElementName("ПолеВвода")
  }

  public defineDataAttributeName(nameGenerator: NameGenerator) {
    this.dataAttribute = nameGenerator.generateName(this)
  }
}

export class CheckboxElement extends BaseFormElement {
  public type = "ПолеФлажка"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеФлажка"

  @Expose({ name: "Значение" })
  public value: boolean = false

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription("Булево")

  public getBaseElementName(): string {
    return super.getBaseElementName("Флажок")
  }
}

export class CommandBarElement extends BaseFormElement {
  public type = "КоманднаяПанель"
  public elementType = "ГруппаФормы"
  public elementKind = "КоманднаяПанель"

  @Expose({ name: "Элементы" })
  public items: (BaseFormElement | ButtonGroupElement)[] = []

  public childrenFields = ["items"]

  public getAllButtons(): (ButtonElement | ButtonGroupElement)[] {
    const buttons: (ButtonElement | ButtonGroupElement)[] = []

    for (const item of this.items) {
      if (item instanceof ButtonElement) {
        buttons.push(item)
        continue
      }

      buttons.push(...(item as ButtonGroupElement).getAllButtons())
    }

    return buttons
  }
}

export class ButtonElement extends BaseFormElement {
  public type = "КнопкаФормы"
  public elementType = "КнопкаФормы"
  public elementKind = "БезВида"

  @Expose({ name: "Элементы" })
  public readonly items: (ButtonElement | ButtonGroupElement)[] = []

  public childrenFields = ["items"]

  public switchToSubmenu() {
    this.type = "Подменю"
    this.elementType = "ГруппаФормы"
    this.elementKind = "Подменю"
  }
  public getAllButtons(): (ButtonElement | ButtonGroupElement)[] {
    const buttons: (ButtonElement | ButtonGroupElement)[] = []

    for (const item of this.items) {
      if (item instanceof ButtonElement) {
        buttons.push(item)
        continue
      }

      buttons.push(...item.getAllButtons())
    }

    return buttons
  }
}

export class ButtonGroupElement extends BaseFormElement {
  public type = "ГруппаКнопок"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКнопок"

  @Expose({ name: "Элементы" })
  public readonly items: ButtonElement[] = []

  public childrenFields = ["items"]

  public getBaseElementName(): string {
    return this.type + super.getBaseElementName("")
  }

  public getAllButtons(): (ButtonElement | ButtonGroupElement)[] {
    return [this, ...this.items]
  }
}

export class TableElement extends BaseFormElement {
  public type = "Таблица"
  public elementType = "ТаблицаФормы"
  public elementKind = "БезВида"

  @Expose({ name: "Колонки" })
  public readonly columns: (TableColumnElement | TableColumnGroupElement)[] = []

  @Expose({ name: "Строки" })
  public readonly rows: TableRowElement[] = []

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription("ТаблицаЗначений")

  public childrenFields = ["columns", "rows"]

  public getBaseElementName(): string {
    return this.type + super.getBaseElementName("")
  }
}

export class TableEmptyElement extends BaseFormElement {
  public type = "ПустойЭлементТаблицы"
  public getBaseElementName(): string {
    throw new Error("Method not implemented.")
  }
}

export class TableColumnGroupElement extends BaseFormElement {
  public type = "ГруппаКолонокТаблицы"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКолонок"

  @Expose({ name: "Элементы" })
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  public childrenFields = ["items"]

  public getBaseElementName(): string {
    return "ГруппаКолонок" + super.getBaseElementName("")
  }
}

export class TableColumnElement extends BaseFormElement {
  public type = "КолонкаТаблицы"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription()

  @Expose({ name: "ЕстьФлажок" })
  public hasCheckbox: boolean = false

  @Expose({ name: "ЕстьЗначение" })
  public hasValue: boolean = false

  @Expose({ name: "Колонки" })
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  @Expose({ name: "УИДФлажок", groups: ["production"] })
  public uuidCheckbox: string = uuid()

  @Expose({ name: "ОписаниеТиповФлажок" })
  public typeDescriptionCheckbox: TypeDescription = new TypeDescription("Булево")

  public childrenFields = ["items"]

  public getBaseElementName(): string {
    return "Колонка" + super.getBaseElementName("")
  }
}

export class TableRowElement extends BaseFormElement {
  public type = "СтрокаТаблицы"

  @Expose({ name: "Ячейки" })
  public readonly items: Map<string, TableCellElement> = new Map()

  @Expose({ name: "Строки" })
  public readonly rows: TableRowElement[] = []

  public childrenFields = ["rows"]

  public getByColumn(column: TableColumnElement): TableCellElement | undefined {
    return this.items.get(column.uuid)
  }
}

export class TableCellElement extends BaseFormElement {
  public type = "ЯчейкаТаблицы"

  @Expose({ name: "Значение" })
  public value: string = ""

  @Expose({ name: "ЕстьФлажок" })
  public hasCheckbox: boolean = false

  @Expose({ name: "ЗначениеФлажка" })
  public valueCheckbox: boolean = false

  @Expose({ name: "УИДКолонки" })
  public uuidColumn: string = ""

  @Expose({ name: "УИДКолонкиФлажок" })
  public uuidCheckbox: string = ""

  public isEmpty(): boolean {
    return this.value.trim() == ""
  }
}

export class ElementLocation {
  @Expose({ name: "Лево" })
  public left: number = 0

  @Expose({ name: "Право" })
  public right: number = 0

  constructor(left: number, right: number) {
    this.left = left
    this.right = right
  }
}

export class TypeDescription {
  @Expose({ name: "Типы" })
  public types: string[] = []

  @Expose({ name: "ДлинаЧисла" })
  public digits: number = 0

  @Expose({ name: "ТочностьЧисла" })
  public fractionDigits: number = 0

  @Expose({ name: "ДлинаСтроки" })
  public length: number = 0

  @Expose({ name: "ЧастиДаты" })
  public dateFractions: DateFractions = DateFractions.Date

  @Expose({ name: "Авто" })
  public auto: boolean = true

  constructor(type?: string) {
    if (!type) {
      return
    }

    this.types.push(type)
  }

  public isEmpty() {
    return this.types.length === 0
  }
}

export type TableHeaderElement = TableColumnGroupElement | TableColumnElement
export type TableHeaderElementExt = TableColumnGroupElement | TableColumnElement | TableEmptyElement
