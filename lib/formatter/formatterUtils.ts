export class FormatterUtils {
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
