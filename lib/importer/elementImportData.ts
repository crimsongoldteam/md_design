import { Expose, Type, Transform, ClassTransformOptions } from "class-transformer"
import { BaseElement } from "../elements/baseElement"
import { PlainToClassDiscriminator } from "./plainToClassDiscriminator"
import { PlainToClassTransformer } from "./plaintToClassTransformer"
import { TableColumnElement } from "@/elements/tableColumnElement"

export class ElementImportData {
  @Expose()
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform)
  public data: BaseElement[] = []
}
export interface TableClassTransformOptions extends ClassTransformOptions {
  columns: TableColumnElement[]
}
