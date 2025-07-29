import { Expose, Type } from "class-transformer"
import { BaseElement } from "./baseElement"
import { ElementListType } from "./types.ts"
import { TableColumnElement } from "./tableColumnElement"
import { TableColumnGroupElement } from "./tableColumnGroupElement"
import { TableRowElement } from "./tableRowElement.ts"
import { TypeDescription } from "./typeDescription"
import { BaseElementWithAttributes } from "./baseElementWithAttributes .ts"
import { TableEmptyElement } from "./tableEmptyElement.ts"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator.ts"
import { elementsManager } from "@/elementsManager"
import { IAttributes } from "./interfaces.ts"
import { Attribute, Attributes } from "./attributes"

export type TableHeaderElement = TableColumnGroupElement | TableColumnElement
export type TableHeaderElementExt = TableColumnGroupElement | TableColumnElement | TableEmptyElement

export class TableElement extends BaseElementWithAttributes {
  public type = "Таблица"
  public elementType = "ТаблицаФормы"
  public elementKind = "БезВида"

  @Expose({ name: "Колонки" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  public columns: (TableColumnElement | TableColumnGroupElement)[] = []

  @Expose({ name: "Строки" })
  @Type(() => TableRowElement)
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

  public afterImport(): void {
    const columns = this.getAllColumns()
    for (const column of columns) {
      column.table = this
    }
    this.extractRowsFromCacheHierarchy(columns, this.rows)
  }

  public get isContainer(): boolean {
    return false
  }

  public override updateParents() {
    super.updateParents()
    const columns = this.getAllColumns()
    for (const column of columns) {
      column.table = this
    }
  }

  private extractRowsFromCacheHierarchy(columns: TableColumnElement[], rows: TableRowElement[]): void {
    for (const row of rows) {
      row.extractFromCache(columns)
      this.extractRowsFromCacheHierarchy(columns, row.rows)
    }
  }

  public getAttributes(): IAttributes {
    const attributes: IAttributes = new Attributes()
    attributes.set(this.attributeId, new Attribute(this.typeDescription))
    return attributes
  }
}

PlainToClassDiscriminator.addClass(TableElement, "Таблица")
PlainToClassDiscriminator.addClass(TableElement, "Дерево")

elementsManager.addElement(TableElement, "TableElement", "Таблица")
