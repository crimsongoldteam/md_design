import { Expose, plainToInstance, Transform, TransformFnParams, Type } from "class-transformer"
import { BaseElement } from "./baseElement"
import { ElementListType } from "./types"
import { TableCellElement } from "./tableCellElement"
import { TableColumnElement } from "./tableColumnElement"
import { IdGeneratorRequest, IdGeneratorQueueInboxItem } from "@/parser/visitorTools/idGenerator"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { elementsManager } from "@/elementsManager"

export class TableRowElement extends BaseElement {
  public type = "СтрокаТаблицы"

  @Expose({ name: "Ячейки", toClassOnly: true })
  @Type(() => TableCellElement, {})
  @Transform(TableRowElement.transformCellsToClass, { toClassOnly: true })
  public itemsImportCache: Map<string, TableCellElement> = new Map()

  @Expose({ name: "Ячейки", toPlainOnly: true })
  @Type(() => TableCellElement)
  @Transform(TableRowElement.transformCellsToPlain, { toPlainOnly: true })
  public items: Map<TableColumnElement, TableCellElement> = new Map()

  public itemsDescription: Map<string, any> = new Map()

  @Expose({ name: "Строки" })
  @Type(() => TableRowElement)
  public readonly rows: TableRowElement[] = []

  public static readonly childrenFields = [ElementListType.Rows]

  public getByColumn(column: TableColumnElement): TableCellElement | undefined {
    return this.items.get(column)
  }

  public getByCheckboxColumn(column: TableColumnElement): TableCellElement | undefined {
    return this.items.get(column)
  }

  public getIdTemplate(_request: IdGeneratorRequest): string {
    return ""
  }
  public getIdGeneratorQueue(): IdGeneratorQueueInboxItem[] {
    return []
  }

  public extractFromCache(columns: TableColumnElement[]): void {
    this.items = new Map()

    for (const column of columns) {
      const value = this.itemsImportCache.get(column.attributeId)
      if (!value) {
        continue
      }
      this.items.set(column, value)
    }

    this.itemsImportCache.clear()
  }

  private static transformCellsToPlain(params: {
    value: Map<TableColumnElement, TableCellElement>
  }): Map<string, TableCellElement> {
    const transformedMap = new Map<string, TableCellElement>()

    for (const [key, value] of params.value.entries()) {
      transformedMap.set(key.attributeId, value)
    }

    return transformedMap
  }

  private static transformCellsToClass(params: TransformFnParams): Map<string, TableCellElement> {
    const cellsObject = params.obj["Ячейки"]
    const result = new Map<string, TableCellElement>()
    for (const [key, value] of Object.entries(cellsObject)) {
      result.set(key, plainToInstance(TableCellElement, value, { strategy: "excludeAll" }))
    }
    return result
  }

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(TableRowElement, "СтрокаТаблицы")

elementsManager.addElement(TableRowElement, "TableRowElement", "СтрокаТаблицы")
