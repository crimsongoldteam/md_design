import { ClassTransformOptions, plainToInstance } from "class-transformer"
import { ElementImportData } from "./elementImportData"

export class Importer {
  public static readonly import = (text: string) => {
    const plainObject = JSON.parse(text)
    const options: ClassTransformOptions = {
      strategy: "excludeAll",
    }
    const data: ElementImportData = plainToInstance(ElementImportData, plainObject, options)
    return data.data
  }
}
