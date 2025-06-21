import { plainToInstance, TransformFnParams } from "class-transformer"
import { TableClassTransformOptions } from "@/importer/elementImportData"
import { TableElement } from "../elements/tableElement"
import { TableRowElement } from "../elements/tableRowElement"

export class PlainToClassTransformer {
  public static readonly transform = (params: TransformFnParams) => {
    const result = []
    for (let index = 0; index < params.value.length; index++) {
      const element = params.value[index]

      if (element.Тип == "Таблица" || element.Тип == "Дерево") {
        const value = params.obj["Колонки"][index]
        PlainToClassTransformer.transformTable(element, value)
      }

      result.push(element)
    }

    return result
  }

  private static transformTable(table: TableElement, value: any) {
    const options: TableClassTransformOptions = {
      columns: table.getAllColumns(),
    }
    const rows: TableRowElement[] = plainToInstance(
      TableRowElement,
      value["Строки"],
      options
    ) as unknown as TableRowElement[]
    table.rows.push(...rows)
  }
}
