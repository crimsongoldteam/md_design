import { LabelElement } from "../parser/visitorTools/formElements"
import { PropertiesFormatter } from "./propertiesFormatter"
import { IFormatter } from "./formFormatter"

export class LabelFormatter implements IFormatter<LabelElement> {
  public format(element: LabelElement): string[] {
    const excludeProperties = ["ГоризонтальноеПоложениеВГруппе", "Заголовок"]

    const propertiesFormatter = new PropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    let result = element.properties["Заголовок"] ?? ""
    result += properties.join("")

    return [result]
  }
}
