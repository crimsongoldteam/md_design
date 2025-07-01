import { IdFormatter, IdFormatterRule } from "@/parser/visitorTools/idFormatter"
import { IdGeneratorQueueInboxItem, IdGeneratorRequest, IdGeneratorType } from "@/parser/visitorTools/idGenerator"
import { BaseElement } from "./baseElement"

export abstract class BaseElementWithoutAttributes extends BaseElement {
  protected abstract get defaultId(): string

  public getIdTemplate(request: IdGeneratorRequest): string {
    return this.getElementIdTemplate(request)
  }

  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    const highPriority: boolean = this.getProperty("Имя") !== undefined

    return [{ type: IdGeneratorType.Element, highPriority: highPriority }]
  }

  private getElementIdTemplate(_request: IdGeneratorRequest): string {
    const rules: IdFormatterRule[] = [{ property: "Имя" }, { property: "Заголовок" }]
    let result = IdFormatter.format(this, rules)
    if (result) {
      return result
    }

    return this.defaultId
  }
}
