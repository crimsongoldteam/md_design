import { Expose } from "class-transformer"
import { ITypeDescription } from "./interfaces"
import { DateFractions } from "./types"

export class TypeDescription implements ITypeDescription {
  @Expose({ name: "Типы" })
  public types: string[] = []

  @Expose({ name: "ДлинаЧисла" })
  public digits: number = 0

  @Expose({ name: "ТочностьЧисла" })
  public fractionDigits: number = 0

  @Expose({ name: "ДлинаСтроки" })
  public length: number = 0

  @Expose({ name: "ЧастиДаты" })
  public dateFractions: DateFractions = DateFractions.Date

  @Expose({ name: "ЭтоНовый" })
  public isNew: boolean = false

  @Expose({ name: "Авто" })
  public auto: boolean = true

  constructor(
    type?: string,
    options?: {
      isNew?: boolean
      auto?: boolean
      digits?: number
      fractionDigits?: number
      length?: number
      dateFractions?: DateFractions
    }
  ) {
    if (type) {
      this.types.push(type)
    }

    if (options) {
      this.isNew = options.isNew ?? false
      this.auto = options.auto ?? true
      this.digits = options.digits ?? 0
      this.fractionDigits = options.fractionDigits ?? 0
      this.length = options.length ?? 0
      this.dateFractions = options.dateFractions ?? DateFractions.Date
    }
  }

  public isEqual(other: TypeDescription): boolean {
    const thisTypesSorted = [...this.types].sort((a, b) => a.localeCompare(b))
    const otherTypesSorted = [...other.types].sort((a, b) => a.localeCompare(b))

    for (let i = 0; i < thisTypesSorted.length; i++) {
      if (thisTypesSorted[i] !== otherTypesSorted[i]) {
        return false
      }
    }

    // Сравнение остальных свойств
    return (
      this.isNew === other.isNew &&
      this.auto === other.auto &&
      this.digits === other.digits &&
      this.fractionDigits === other.fractionDigits &&
      this.length === other.length &&
      this.dateFractions === other.dateFractions
    )
  }

  public isEmpty() {
    return this.types.length === 0
  }

  public isTable(): boolean {
    return this.types.length === 1 && (this.types[0] === "ТаблицаЗначений" || this.types[0] === "ДеревоЗначений")
  }
}
