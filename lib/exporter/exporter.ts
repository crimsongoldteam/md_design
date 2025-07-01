import { instanceToPlain } from "class-transformer"
import { ElementPathData } from "@/elementPathData"

export class Exporter {
  public static readonly export = (element: any): string | undefined => {
    if (element === undefined) return undefined

    const plainObject = instanceToPlain(element, {
      strategy: "excludeAll",
      groups: ["production"],
    })
    return JSON.stringify(plainObject)
  }
  public static readonly exportTableData = (element: ElementPathData) => {
    const plain = instanceToPlain(element, {
      strategy: "excludeAll",
      groups: ["production"],
    })

    return JSON.stringify(plain)
  }
}
