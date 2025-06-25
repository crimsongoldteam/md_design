import { PageElement } from "../elements/pageElement"
import * as t from "../parser/lexer"
import { IFormatter } from "./formFormatter"
import { PropertiesFormatter } from "./propertiesFormatter"
import { InlineItemsFormatterUtils } from "./inlineItemsFormatterUtils"

export class PageFormatter implements IFormatter<PageElement> {
  public format(element: PageElement): string[] {
    const indent = "  "
    const result: string[] = []

    const header = this.getHeader(element)
    result.push(header)

    result.push(...InlineItemsFormatterUtils.format(element.items, indent))

    return result
  }

  private getHeader(element: PageElement): string {
    const excludeProperties = ["Заголовок"]

    const propertiesFormatter = new PropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    let result = t.Slash.LABEL as string

    result += element.properties.get("Заголовок") ?? ""

    result += properties

    return result
  }
}
