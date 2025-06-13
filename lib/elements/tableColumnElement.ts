import { Expose } from "class-transformer"
import { v4 as uuid } from "uuid"
import { BaseElement, ElementListType } from "./baseElement"
import { TypeDescription } from "./typeDescription"
import { TableColumnGroupElement } from "./tableColumnGroupElement"

export class TableColumnElement extends BaseElement {
  public type = "КолонкаТаблицы"
  public elementType = "ПолеФормы"
  public elementKind = "ПолеВвода"

  @Expose({ name: "ОписаниеТипов" })
  public typeDescription: TypeDescription = new TypeDescription()

  @Expose({ name: "ЕстьФлажок" })
  public hasCheckbox: boolean = false

  @Expose({ name: "ЕстьЗначение" })
  public hasValue: boolean = false

  @Expose({ name: "ЕстьГруппаВместе" })
  public hasCheckboxGroup: boolean = false

  @Expose({ name: "ЕстьВертикальнаяГруппа" })
  public hasVerticalGroup: boolean = false

  @Expose({ name: "ЕстьГоризонтальнаяГруппа" })
  public hasHorizontalGroup: boolean = false

  @Expose({ name: "Колонки" })
  public items: (TableColumnElement | TableColumnGroupElement)[] = []

  @Expose({ name: "УИДФлажок", groups: ["production"] })
  public idCheckbox: string = uuid()

  @Expose({ name: "УИДГруппаВместе", groups: ["production"] })
  public idCheckboxGroup: string = uuid()

  @Expose({ name: "УИДВертикальнаяГруппа", groups: ["production"] })
  public idVerticalGroup: string = uuid()

  @Expose({ name: "УИДГоризонтальнаяГруппа", groups: ["production"] })
  public idHorizontalGroup: string = uuid()

  @Expose({ name: "ОписаниеТиповФлажок" })
  public typeDescriptionCheckbox: TypeDescription = new TypeDescription("Булево")

  public static readonly childrenFields = [ElementListType.Items]

  public getBaseElementName(): string {
    return "Колонка" + super.getBaseElementName("")
  }
}
