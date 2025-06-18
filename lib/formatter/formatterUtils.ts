import { BaseElement } from "../elements/baseElement"
import * as t from "../parser/lexer"
import { DateFractions, TypeDescription } from "@/elements/typeDescription"
import { format as fnsFormat } from "date-fns"

export class FormatterUtils {
  public static formatValue(value: string | boolean | number | Date, typeDescription: TypeDescription): string {
    if (typeof value === "number") {
      return this.formatNumber(value, typeDescription)
    }

    if (value instanceof Date) {
      return this.formatDate(value, typeDescription)
    }

    return value.toString()
  }

  private static formatNumber(value: number, typeDescription: TypeDescription): string {
    return value.toFixed(typeDescription.fractionDigits)
  }

  private static formatDate(value: Date, typeDescription: TypeDescription): string {
    if (typeDescription.dateFractions == DateFractions.Date) {
      return fnsFormat(value, "dd.MM.yyyy")
    }

    if (typeDescription.dateFractions == DateFractions.Time) {
      return fnsFormat(value, "HH:mm:ss")
    }

    return fnsFormat(value, "dd.MM.yyyy HH:mm:ss")
  }

  public static getAlignmentAtLeft(element: BaseElement): string {
    if (
      element.properties["ГоризонтальноеПоложениеВГруппе"] === "Центр" ||
      element.properties["ГоризонтальноеПоложениеВГруппе"] === "Право"
    ) {
      return t.RArrow.LABEL + " "
    }

    if (element.properties["ГоризонтальноеПоложениеВГруппе"] === "Центр") {
      return t.LArrow.LABEL + " "
    }

    return ""
  }

  public static getAlignmentAtRight(element: BaseElement): string {
    if (element.properties["ГоризонтальноеПоложениеВГруппе"] === "Центр") {
      return " " + t.LArrow.LABEL
    }

    if (this.isStretch(element)) {
      return " " + t.RArrow.LABEL
    }

    return ""
  }

  public static excludeStretchProperties(excludeProperties: string[], element: BaseElement): void {
    if (!this.isStretch(element)) return

    excludeProperties.push("РастягиватьПоГоризонтали")
  }

  private static isStretch(element: BaseElement): boolean {
    return element.getProperty("РастягиватьПоГоризонтали") === true
  }

  public static getCheckboxString(
    text: string,
    hasCheckbox: boolean,
    checkboxType: string = "Флажок",
    checkboxValue: boolean = false,
    captionPosition: string = "Лево"
  ): string {
    if (!hasCheckbox) {
      return text
    }

    let value = ""

    if (checkboxType === "Выключатель") {
      value = checkboxValue ? " |1" : "0| "
    } else {
      value = checkboxValue ? "X" : " "
    }

    const checkbox = `[${value}]`

    if (!text) {
      return checkbox
    }

    return captionPosition === "Право" ? `${checkbox} ${text}` : `${text} ${checkbox}`
  }

  public static distributeNumberWithAlignment(numberToDistribute: number, valuesArray: number[]): number[] {
    const resultArray: number[] = []

    const sum = valuesArray.reduce((acc, val) => acc + val, 0)

    if (sum >= numberToDistribute) {
      return [...valuesArray]
    }

    const average = Math.floor(numberToDistribute / valuesArray.length)

    // Разделяем индексы на "максимальные" и "минимальные" значения
    const maxIndexes: number[] = []
    const minIndexes: number[] = []

    valuesArray.forEach((value, index) => {
      if (value >= average) {
        maxIndexes.push(index)
        resultArray[index] = value
      } else {
        minIndexes.push(index)
        resultArray[index] = 0
      }
    })

    // Распределяем остаток на "минимальные" значения
    let remainder = numberToDistribute - maxIndexes.reduce((acc, idx) => acc + valuesArray[idx], 0)
    const minValuesCount = minIndexes.length

    if (minValuesCount === 0) {
      return resultArray
    }

    const share = Math.floor(remainder / minValuesCount)

    minIndexes.forEach((index, i) => {
      // Последний элемент получает весь остаток
      const value = i === minIndexes.length - 1 ? share + (remainder - share * minValuesCount) : share

      resultArray[index] = value
    })

    return resultArray
  }
}
