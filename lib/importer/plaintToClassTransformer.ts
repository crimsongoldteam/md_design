import { plainToInstance, TransformFnParams } from "class-transformer"
import { TableClassTransformOptions } from "./importer"
import { TableElement } from "../elements/tableElement"
import { TableRowElement } from "../elements/tableRowElement"
import { BaseElement } from "@/elements/baseElement"

export class PlainToClassTransformer {
  public static readonly transform = (params: TransformFnParams) => {
    if (Array.isArray(params.value)) {
      for (let index = 0; index < params.value.length; index++) {
        const element = params.value[index]
        if (!this.isTable(element)) continue
        this.transformTable(element, params.obj[params.key][index])
      }
      return params.value
    }
    if (!this.isTable(params.value)) return params.value

    this.transformTable(params.value, params.obj[params.key])

    return params.value
  }

  private static isTable(element: BaseElement): element is TableElement {
    return element instanceof TableElement
  }

  private static transformTable(table: TableElement, obj: any) {
    const columns = table.getAllColumns()
    for (const column of columns) {
      column.table = table
    }

    const options: TableClassTransformOptions = {
      columns: columns,
      strategy: "excludeAll",
    }
    const rows: TableRowElement[] = plainToInstance(
      TableRowElement,
      obj["Строки"],
      options
    ) as unknown as TableRowElement[]
    table.rows.push(...rows)
  }
}
