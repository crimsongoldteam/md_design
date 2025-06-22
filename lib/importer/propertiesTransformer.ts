import { TransformFnParams } from "class-transformer"
import { PropertyValue } from "@/elements/baseElement"

export class PropertiesTransformer {
  public static transform(params: TransformFnParams): Map<string, PropertyValue> {
    const properties = params.obj["НаборСвойств"]
    if (!properties) {
      return new Map<string, PropertyValue>()
    }

    return new Map<string, PropertyValue>(Object.entries(properties))
  }
}
