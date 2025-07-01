import { IdFormatter, IdFormatterRule } from "@/parser/visitorTools/idFormatter"
import { IdGeneratorQueueInboxItem, IdGeneratorRequest, IdGeneratorType } from "@/parser/visitorTools/idGenerator"
import { BaseElement } from "./baseElement"
import { Expose } from "class-transformer"

export abstract class BaseElementWithAttributes extends BaseElement {
  @Expose({ name: "УИДАтрибута", groups: ["production"] })
  public attributeId: string = ""

  protected abstract get defaultId(): string

  public override getIdTemplate(request: IdGeneratorRequest): string {
    if (request.type === IdGeneratorType.Attribute) {
      return this.getAttributeIdTemplate(request)
    }
    return this.getElementIdTemplate(request)
  }

  public override getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    const highPriority: boolean = this.getProperty("Путь") !== undefined || this.getProperty("Имя") !== undefined

    return [
      { type: IdGeneratorType.Attribute, highPriority: highPriority },
      { type: IdGeneratorType.Element, highPriority: highPriority },
    ]
  }

  private getAttributeIdTemplate(_request: IdGeneratorRequest): string {
    const rules: IdFormatterRule[] = [{ property: "Путь" }, { property: "Имя" }, { property: "Заголовок" }]
    return IdFormatter.format(this, rules) ?? this.defaultId
  }

  private getElementIdTemplate(_request: IdGeneratorRequest): string {
    const rules: IdFormatterRule[] = [{ property: "Имя" }]
    let result = IdFormatter.format(this, rules)
    if (result) {
      return result
    }

    return this.attributeId
  }
}
