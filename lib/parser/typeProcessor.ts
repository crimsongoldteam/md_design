import { ITypeDescription } from "@/elements/interfaces"
import { TypeDescription } from "@/elements/typeDescription"
import { StringUtils } from "@/utils/stringUtils"

export class TypeProcessor {
  public static visit(types: any): ITypeDescription {
    const result = new TypeDescription()
    result.auto = false

    for (let typeInfo of types) {
      let value = typeInfo.value

      let { type, kind } = this.processType(value)

      let aliase = this.getAliase(type)
      if (!aliase) continue

      if (kind) {
        kind = StringUtils.clean(kind)
        if (kind === "") continue
      }

      const resultType = kind ? `${aliase}.${kind}` : aliase

      result.types.push(resultType)

      const processor = this.getTypeProcessor(type)
      if (processor) {
        processor(result, typeInfo)
      }
    }

    return result
  }

  private static processType(type: string): { type: string; kind: string | undefined } {
    const parts = type.split(".")

    if (parts.length === 2) {
      const baseType = parts[0]
      const kind = parts[1]

      return { type: baseType, kind: kind }
    }

    return { type: type, kind: undefined }
  }

  private static getTypeProcessor(
    typeLowerCase: string
  ): ((result: ITypeDescription, typeInfo: any) => void) | undefined {
    const typeProcessors: { [key: string]: (result: ITypeDescription, typeInfo: any) => void } = {
      Число: (result, typeInfo) => this.processNumberType(result, typeInfo),
      Строка: (result, typeInfo) => this.processStringType(result, typeInfo),
      Дата: (result, typeInfo) => this.processDateType(result, typeInfo),
    }

    return typeProcessors[typeLowerCase]
  }

  private static processNumberType(result: ITypeDescription, typeInfo: any): void {
    let options = typeInfo.options
    if (options && options.length > 0) {
      result.digits = parseInt(options[0])
    }
    if (options && options.length > 1) {
      result.fractionDigits = parseInt(options[1])
    }
  }

  private static processStringType(result: ITypeDescription, typeInfo: any): void {
    let options = typeInfo.options
    if (options && options.length > 0) {
      result.length = parseInt(options[0])
    }
  }

  private static processDateType(result: ITypeDescription, typeInfo: any): void {
    let options = typeInfo.options
    if (options && options.length > 0) {
      result.dateFractions = options[0]
    }
  }

  private static getAliase(type: string): string | undefined {
    const pairs: { [key: string]: string } = {
      справочник: "Справочник",
      справочники: "Справочник",
      спр: "Справочник",
      документ: "Документ",
      документы: "Документ",
      док: "Документ",
      перечисление: "Перечисление",
      перечисления: "Перечисление",
      переч: "Перечисление",
      число: "Число",
      строка: "Строка",
      дата: "Дата",
      булево: "Булево",
    }

    return pairs[type.toLowerCase()]
  }
}
