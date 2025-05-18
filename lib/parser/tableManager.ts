import { CstChildrenDictionary, CstNode } from "chevrotain"
import { FormItem, TableColumnItem, TableItem } from "./formExport"

export class TableManager {
  private table: TableItem

  constructor(table: TableItem) {
    this.table = table
  }

  public addCell(cell: CstChildrenDictionary): void {
    // let column = new TableColumnItem()
    // this.setProperty(column, "Заголовок", content)
    // this.table.columns.push(column)
  }

  public addSeparator(separator: CstChildrenDictionary): void {}

  public endLine(): void {}

  private setProperty(element: FormItem, key: string, value: string | boolean | undefined) {
    const properties = element.properties
    const lowerKey = key.toLowerCase()

    for (const prop in properties) {
      if (prop.toLowerCase() === lowerKey) {
        delete properties[prop]
      }
    }

    properties[key] = value
  }
}
