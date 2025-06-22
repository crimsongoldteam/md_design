import { Expose, instanceToPlain, plainToInstance, Transform, TransformFnParams, Type } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { TableCellElement } from "./tableCellElement"
import { TableColumnElement } from "./tableColumnElement"
import { IdGeneratorRequest, IdGeneratorQueueInboxItem } from "@/parser/visitorTools/idGenerator"
import { PlainToClassDiscriminator } from "@/importer/plainToClassDiscriminator"
import { TableClassTransformOptions } from "@/importer/importer"
import { elementsManager } from "@/elementsManager"

export class TableRowElement extends BaseElement {
  public type = "СтрокаТаблицы"

  @Expose({ name: "Ячейки" })
  @Transform(TableRowElement.transformCellsToPlain, { toPlainOnly: true })
  @Transform(TableRowElement.transformCellsToClass, { toClassOnly: true })
  public readonly items: Map<TableColumnElement, TableCellElement> = new Map()

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

  private static transformCellsToPlain(params: {
    value: Map<TableColumnElement, TableCellElement>
  }): Map<string, Record<string, any>> {
    const transformedMap = new Map<string, Record<string, any>>()

    params.value.forEach((value: TableCellElement, key: TableColumnElement) => {
      return transformedMap.set(
        key.attributeId,
        instanceToPlain(value, { groups: ["production"], strategy: "excludeAll" })
      )
    })

    return transformedMap
  }

  private static transformCellsToClass(params: TransformFnParams): Map<TableColumnElement, TableCellElement> {
    const options = params.options as TableClassTransformOptions
    const values = params.obj["Ячейки"]
    const transformedMap = new Map<TableColumnElement, TableCellElement>()
    for (const [key, value] of Object.entries(values)) {
      const column = options.columns.find((col) => col.attributeId === key)
      if (!column) {
        continue
      }
      transformedMap.set(column, plainToInstance(TableCellElement, value, { strategy: "excludeAll" }))
    }

    return transformedMap
  }

  public get isContainer(): boolean {
    return false
  }
}

PlainToClassDiscriminator.addClass(TableRowElement, "СтрокаТаблицы")

elementsManager.addElement(TableRowElement, "TableRowElement", "СтрокаТаблицы")
