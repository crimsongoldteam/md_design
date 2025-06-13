import { Expose } from "class-transformer"

export enum DateFractions {
  Time = "Время",
  Date = "Дата",
  DateTime = "ДатаВремя",
}

export class TypeDescription {
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

  constructor(type?: string) {
    if (!type) {
      return
    }
    this.types.push(type)
  }

  public isEmpty() {
    return this.types.length === 0
  }
}
