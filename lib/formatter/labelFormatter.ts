import { LabelElement } from "../elements/labelElement"
import { PropertiesFormatter } from "./propertiesFormatter"
import { IFormatter } from "./formFormatter"
import { FormatterUtils } from "./formatterUtils"

export class LabelFormatter implements IFormatter<LabelElement> {
  public format(element: LabelElement): string[] {
    let excludeProperties = ["ГоризонтальноеПоложениеВГруппе", "Заголовок"]

    FormatterUtils.excludeStretchProperties(excludeProperties, element)

    const propertiesFormatter = new PropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    let result = FormatterUtils.getAlignmentAtLeft(element)
    result += element.properties.get("Заголовок") ?? ""
    result += properties.join("")
    result += FormatterUtils.getAlignmentAtRight(element)
    return [result]
  }
}
