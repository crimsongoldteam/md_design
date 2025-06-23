import { TableColumnElement } from "@/elements/tableColumnElement"
import * as t from "../../parser/lexer"

import { IFormatter } from "../formFormatter"
import { PropertiesFormatter } from "../propertiesFormatter"

export class TableColumnFormatter implements IFormatter<TableColumnElement> {
  private readonly groupSymbol = t.Dash.LABEL

  public format(element: TableColumnElement): string[] {
    const excludeProperties = ["Заголовок"]

    let horizontalPosition = element.properties.get("ГоризонтальноеПоложение") ?? "Лево"

    if (horizontalPosition === "Лево" || element.items.length === 0) {
      excludeProperties.push("ГоризонтальноеПоложение")
    }

    let description = element.properties.get("Заголовок") ?? ""

    if (element.type === "ГруппаКолонокТаблицы") {
      description = `${this.groupSymbol} ${description} ${this.groupSymbol}`
    }

    const propertiesFormatter = new PropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })
    description += properties.join("")

    description = ` ${description} `

    return [description]
  }
}
