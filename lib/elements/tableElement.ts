import { Expose, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { TableColumnElement } from "./tableColumnElement"
import { TableColumnGroupElement } from "./tableColumnGroupElement"
import { TableRowElement } from "./tableRowElement.ts"
import { TypeDescription } from "./typeDescription"
import { BaseElementWithAttributes } from "./baseElementWithAttributes .ts"
import { TableCellElement } from "./tableCellElement.ts"
import { TableValueData } from "@/editor/formModel.ts"
import { FormatterUtils } from "@/formatter/formatterUtils.ts"
import { TableEmptyElement } from "./tableEmptyElement.ts"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator.ts"
import { elementsManager } from "@/elementsManager"

export type TableHeaderElement = TableColumnGroupElement | TableColumnElement
export type TableHeaderElementExt = TableColumnGroupElement | TableColumnElement | TableEmptyElement

export class TableElement extends BaseElementWithAttributes {
  public type = "Таблица"
  public elementType = "ТаблицаФормы"
  public elementKind = "БезВида"

  @Expose({ name: "Колонки" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  public columns: (TableColumnElement | TableColumnGroupElement)[] = []

  @Expose({ name: "Строки", toPlainOnly: true })
  public readonly rows: TableRowElement[] = []

  @Expose({ name: "ОписаниеТипов" })
  @Type(() => TypeDescription)
  public typeDescription: TypeDescription = new TypeDescription("ТаблицаЗначений")

  public static readonly childrenFields = [ElementListType.Columns, ElementListType.Rows]

  protected get defaultId(): string {
    return this.type
  }

  public getAllColumns(): TableColumnElement[] {
    const columns: TableColumnElement[] = []
    for (const column of this.columns) {
      if (column instanceof TableColumnElement) {
        columns.push(column)
      }
      columns.push(...column.getAllColumns())
    }
    return columns
  }

  public getColumnByAttributeId(attributeId: string): TableColumnElement | undefined {
    const columns = this.getAllColumns()
    return columns.find((column) => column.attributeId === attributeId)
  }

  public setValues(value: TableValueData): void {
    this.updateRows(this.rows, value)
  }

  private updateRows(rows: TableRowElement[], value: TableValueData): void {
    let index = 0
    for (const dataRow of value.items) {
      let currentRow = rows[index]
      if (!currentRow) {
        currentRow = new TableRowElement()
        rows.push(currentRow)
      }
      this.updateRow(currentRow, dataRow)
      index++
    }

    rows.splice(index)
  }

  private updateRow(row: TableRowElement, valueData: TableValueData): void {
    const columns = this.getAllColumns()

    for (const column of columns) {
      this.updateCell(row, column, valueData)
    }

    this.updateRows(row.rows, valueData)
  }

  private updateCell(row: TableRowElement, column: TableColumnElement, valueData: TableValueData) {
    let cell = row.getByColumn(column)
    if (!cell) {
      cell = new TableCellElement()
      row.items.set(column, cell)
    }

    if (column.hasCheckbox && valueData.data[column.checkboxAttributeId]) {
      cell.valueCheckbox = valueData.data[column.checkboxAttributeId] as boolean
    }

    if (column.hasValue && valueData.data[column.attributeId]) {
      cell.value = FormatterUtils.formatValue(valueData.data[column.attributeId], column.typeDescription)
    }
  }

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(TableElement, "Таблица")
PlainToClassDiscriminator.addClass(TableElement, "Дерево")

elementsManager.addElement(TableElement, "TableElement", "Таблица")
