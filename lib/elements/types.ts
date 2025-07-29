export enum ElementListType {
  Items = "items",
  Columns = "columns",
  Rows = "rows",
}

export enum PropertyAlignment {
  Left = "Лево",
  Center = "Центр",
  Right = "Право",
}

export type ProperyPrimitiveValue = string | boolean | number
export type PropertyValue = ProperyPrimitiveValue | ProperyPrimitiveValue[]
export enum DateFractions {
  Time = "Время",
  Date = "Дата",
  DateTime = "ДатаВремя",
}
