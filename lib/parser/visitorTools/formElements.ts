import { Expose } from "class-transformer"
import "reflect-metadata"
import { v4 as uuid } from "uuid"

export abstract class BaseFormElement {
  @Expose({ name: "Тип" })
  public type: string = ""

  @Expose({ name: "ТипЭлемента", groups: ["production"] })
  public elementType: string = ""

  @Expose({ name: "ВидЭлемента", groups: ["production"] })
  public elementKind: string = ""

  @Expose({ name: "Свойства" })
  public properties: { [key: string]: any } = {}

  @Expose({ name: "Координаты", groups: ["production"] })
  public location: {} = {}

  @Expose({ name: "УИД", groups: ["production"] })
  public uuid: string = uuid()
}

export class FormElement extends BaseFormElement {
  public type = "Форма"
  public elementType = "Форма"
  public elementKind = "БезВида"

  @Expose({ name: "Элементы" })
  public items: BaseFormElement[] = []
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
}

export class CheckboxElement extends BaseFormElement {
  public type = "ПолеФлажка"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеФлажка"

  @Expose({ name: "Значение" })
  public value: boolean = false
}

export class CommandBarElement extends BaseFormElement {
  public type = "КоманднаяПанель"
  public elementType = "ГруппаФормы"
  public elementKind = "КоманднаяПанель"

  @Expose({ name: "Элементы" })
  public items: (BaseFormElement | ButtonGroupElement)[] = []
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

  @Expose({ name: "Столбцы" })
  public columns: (TableColumnElement | TableColumnGroupElement)[] = []

  @Expose({ name: "Строки" })
  public rows: TableRowElement[] = []
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
}

export class TableColumnElement extends BaseFormElement {
  public type = "КолонкаТаблицы"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  @Expose({ name: "ЕстьФлажок" })
  public hasCheckbox: boolean = false

  @Expose({ name: "ЕстьЗначение" })
  public hasValue: boolean = false

  @Expose({ name: "Элементы" })
  public items: (TableColumnElement | TableColumnGroupElement)[] = []
}

export class TableRowElement extends BaseFormElement {
  public type = "СтрокаТаблицы"

  @Expose({ name: "Элементы" })
  public items: TableCellElement[] = []

  @Expose({ name: "Строки" })
  public rows: TableRowElement[] = []
}

export class TableCellElement extends BaseFormElement {
  public type = "ЯчейкаТаблицы"

  @Expose({ name: "Значение" })
  public value?: string

  @Expose({ name: "ЕстьФлажок" })
  public hasCheckbox: boolean = false

  @Expose({ name: "ЗначениеФлажка" })
  public valueCheckbox: boolean = false

  @Expose({ name: "УИДКолонки" })
  public uuidColumn: string = ""

  @Expose({ name: "УИДКолонкиФлажок" })
  public uuidCheckbox: string = ""
}
export type TableHeaderElement = TableColumnGroupElement | TableColumnElement
export type TableHeaderElementExt = TableColumnGroupElement | TableColumnElement | TableEmptyElement
