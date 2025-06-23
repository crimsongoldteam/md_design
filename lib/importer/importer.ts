import { ClassTransformOptions, plainToInstance } from "class-transformer"
import { TableColumnElement } from "@/elements/tableColumnElement"
import { ElementPathData } from "../elementPathData"

export interface TableClassTransformOptions extends ClassTransformOptions {
  columns: TableColumnElement[]
}

export class Importer {
  public static readonly import = (text: string): ElementPathData => {
    const plainObject = JSON.parse(text)
    const options: ClassTransformOptions = {
      strategy: "excludeAll",
    }

    const data = plainToInstance(ElementPathData, plainObject, options) as unknown as ElementPathData

    const result = new ElementPathData(data.item, data.path, data.isNew)

    data.item.updateParents()

    return result
  }
}
