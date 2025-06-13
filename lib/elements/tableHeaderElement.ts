import { TableColumnGroupElement } from "./tableColumnGroupElement"
import { TableColumnElement } from "./tableColumnElement"
import { TableEmptyElement } from "./tableEmptyElement"

export type TableHeaderElement = TableColumnGroupElement | TableColumnElement
export type TableHeaderElementExt = TableColumnGroupElement | TableColumnElement | TableEmptyElement
