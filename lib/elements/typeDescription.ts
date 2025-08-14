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

  @Expose({ name: "Авто" })
  public auto: boolean = true

  constructor(
    type?: string,
    options?: {
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
      this.auto = options.auto ?? true
      this.digits = options.digits ?? 0
      this.fractionDigits = options.fractionDigits ?? 0
      this.length = options.length ?? 0
      this.dateFractions = options.dateFractions ?? DateFractions.Date
    }
  }

  public isEmpty() {
    return this.types.length === 0
  }
}
