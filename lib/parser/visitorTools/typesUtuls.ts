import { isValid, parse } from "date-fns"
import { TypeDescription } from "@/elements/typeDescription"
import { DateFractions } from "@/elements/types"

export class TypesUtils {
  public static getTypeByContent(content: string | undefined): TypeDescription {
    const result = new TypeDescription()

    if (!content) {
      result.types.push("Строка")
      return result
    }

    if (this.isNumber(content)) {
      result.types.push("Число")
      result.digits = 15
      result.fractionDigits = this.getNumberPrecision(content)
      return result
    }

    const dataInfo = this.getDateFractions(content)
    if (dataInfo) {
      result.types.push("Дата")
      result.dateFractions = dataInfo
      return result
    }

    result.types.push("Строка")

    return result
  }

  private static isNumber(value: any): boolean {
    value = value.trim()
    value = value.replace(",", ".")
    return !isNaN(value)
  }

  /**
   * Determines the precision of a number by counting decimal places.
   * @param value - String representation of the number.
   * @returns Number of decimal places.
   */
  private static getNumberPrecision(value: string): number {
    value = value.replace(",", ".")
    const numberParts = value.split(".")

    if (numberParts.length === 1) {
      return 0
    }

    return numberParts[1].length
  }

  private static getDateFractions(input: string): DateFractions | undefined {
    const formats: { format: string; type: DateFractions }[] = [
      { format: "dd.MM.yyyy HH:mm:ss", type: DateFractions.DateTime },
      { format: "dd.MM.yyyy HH:mm", type: DateFractions.DateTime },
      { format: "dd.MM.yyyy", type: DateFractions.Date },
      { format: "dd.MM.yy", type: DateFractions.Date },
      { format: "HH:mm:ss", type: DateFractions.Time },
      { format: "HH:mm", type: DateFractions.Time },
      { format: "H:mm:ss", type: DateFractions.Time },
      { format: "H:mm", type: DateFractions.Time },
    ]

    for (const { format: fmt, type } of formats) {
      const parsedDate = parse(input, fmt, new Date())
      if (isValid(parsedDate)) {
        return type
      }
    }

    return undefined
  }
}
