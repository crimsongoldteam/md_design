import { Exclude, Expose } from "class-transformer"
import "reflect-metadata"
import { v4 as uuid } from "uuid"

export enum DateFractions {
  Time,
  Date,
  DateTime,
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
  public uuid: string = uuid()

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
  public childrenFields: string[] = []

  @Exclude()
  public location: Map<number, ElementLocation> = new Map<number, ElementLocation>()
}

export class FormElement extends BaseFormElement {
  public type = "Форма"
  public elementType = "Форма"
  public elementKind = "БезВида"

  @Expose({ name: "Элементы" })
  public items: BaseFormElement[] = []

  public childrenFields = ["items"]
}

export class HorizontalGroupElement extends BaseFormElement {
  public type = "ГоризонтальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  @Expose({ name: "Элементы" })
  public items: VerticalGroupElement[] = []

  public childrenFields = ["items"]
}

export class VerticalGroupElement extends BaseFormElement {
  public type = "ВертикальнаяГруппа"
  public elementType = "ГруппаФормы"
  public elementKind = "ОбычнаяГруппа"

  @Expose({ name: "Элементы" })
  public items: PageElement[] = []

  public childrenFields = ["items"]
}

export class PagesElement extends BaseFormElement {
  public type = "Страницы"
  public elementType = "ГруппаФормы"
  public elementKind = "Страницы"

  @Expose({ name: "Элементы" })
  public items: PageElement[] = []

  public childrenFields = ["items"]
}

export class PageElement extends BaseFormElement {
  public type = "Страница"
  public elementType = "ГруппаФормы"
  public elementKind = "Страница"

  @Expose({ name: "Элементы" })
  public items: BaseFormElement[] = []

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

  @Expose({ name: "Значение" })
  public value: string = ""

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription()
}

export class CheckboxElement extends BaseFormElement {
  public type = "ПолеФлажка"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеФлажка"

  @Expose({ name: "Значение" })
  public value: boolean = false

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription("Булево")
}

export class CommandBarElement extends BaseFormElement {
  public type = "КоманднаяПанель"
  public elementType = "ГруппаФормы"
  public elementKind = "КоманднаяПанель"

  @Expose({ name: "Элементы" })
  public items: (BaseFormElement | ButtonGroupElement)[] = []

  public childrenFields = ["items"]
}

export class ButtonElement extends BaseFormElement {
  public type = "КнопкаФормы"
  public elementType = "КнопкаФормы"
  public elementKind = "БезВида"

  @Expose({ name: "Элементы" })
  public items: BaseFormElement[] = []
}

export class ButtonGroupElement extends BaseFormElement {
  public type = "ГруппаКнопок"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКнопок"

  @Expose({ name: "Элементы" })
  public items: ButtonElement[] = []
}

export class TableElement extends BaseFormElement {
  public type = "Таблица"
  public elementType = "ТаблицаФормы"
  public elementKind = "БезВида"

  @Expose({ name: "Колонки" })
  public columns: (TableColumnElement | TableColumnGroupElement)[] = []

  @Expose({ name: "Строки" })
  public rows: TableRowElement[] = []

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription("ТаблицаЗначений")

  public childrenFields = ["columns", "rows"]
}

export class TableEmptyElement extends BaseFormElement {
  public type = "ПустойЭлементТаблицы"
}

export class TableColumnGroupElement extends BaseFormElement {
  public type = "ГруппаКолонокТаблицы"
  public elementType = "ГруппаФормы"
  public elementKind = "ГруппаКолонок"

  @Expose({ name: "Элементы" })
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  public childrenFields = ["items"]
}

export class TableColumnElement extends BaseFormElement {
  public type = "КолонкаТаблицы"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  @Expose({ name: "ЕстьФлажок" })
  public hasCheckbox: boolean = false

  @Expose({ name: "ЕстьЗначение" })
  public hasValue: boolean = false

  @Expose({ name: "Колонки" })
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription()

  @Expose({ name: "ОписаниеТиповФлажок" })
  public typeDescriptionCheckbox: TypeDescription = new TypeDescription("Булево")

  public childrenFields = ["items"]
}

export class TableRowElement extends BaseFormElement {
  public type = "СтрокаТаблицы"

  @Expose({ name: "Ячейки" })
  public items: TableCellElement[] = []

  @Expose({ name: "Строки" })
  public rows: TableRowElement[] = []

  public childrenFields = ["items", "rows"]
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
}

export type TableHeaderElement = TableColumnGroupElement | TableColumnElement
export type TableHeaderElementExt = TableColumnGroupElement | TableColumnElement | TableEmptyElement
