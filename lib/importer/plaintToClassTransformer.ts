import { TransformFnParams } from "class-transformer"
import { TableElement } from "../elements/tableElement"
import { BaseElement } from "@/elements/baseElement"

export class PlainToClassTransformer {
  public static readonly transform = (params: TransformFnParams) => {
    const valueAsArray = Array.isArray(params.value) ? params.value : [params.value]

    for (const element of valueAsArray) {
      if (!this.isTable(element)) continue
      this.transformTable(element)
    }

    return params.value
  }

  private static isTable(element: BaseElement): element is TableElement {
    return element instanceof TableElement
  }

  private static transformTable(table: TableElement) {
    table.afterImport()
  }
}
