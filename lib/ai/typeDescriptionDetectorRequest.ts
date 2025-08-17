import { DateFractions } from "@/elements/types"
import { ITypeDescriptionDetectorRequest, ITypeDescriptionDetectorRequestTerm } from "./interfaces"
import { Expose, Type } from "class-transformer"
import { TypeDescription } from "@/elements"

export class TypeDescriptionDetectorRequest implements ITypeDescriptionDetectorRequest {
  @Expose({ name: "Идентификатор" })
  id: string = ""

  @Expose({ name: "Варианты" })
  @Type(() => TypeDescriptionDetectorRequestTerm)
  terms: TypeDescriptionDetectorRequestTerm[] = []
}

export class TypeDescriptionDetectorRequestTerm implements ITypeDescriptionDetectorRequestTerm {
  @Expose({ name: "Тип" })
  public type: string = ""

  @Expose({ name: "ЕдинственноеЧисло" })
  public singular?: string

  @Expose({ name: "МножественноеЧисло" })
  public plural?: string

  @Expose({ name: "ДлинаЧисла" })
  public digits?: number

  @Expose({ name: "ТочностьЧисла" })
  public fractionDigits?: number

  @Expose({ name: "ДлинаСтроки" })
  public length?: number

  @Expose({ name: "ЧастиДаты" })
  public dateFractions?: DateFractions

  constructor(params: {
    type: string
    singular?: string
    plural?: string
    digits?: number
    fractionDigits?: number
    length?: number
    dateFractions?: DateFractions
  }) {
    Object.assign(this, params)
  }

  isPrimitive(): boolean {
    return this.type === "Строка" || this.type === "Число" || this.type === "Дата" || this.type === "Булево"
  }

  createPrimitiveTypeDescription(): TypeDescription {
    let result = new TypeDescription(this.type, { isNew: false })
    result.auto = false
    if (this.digits) {
      result.digits = this.digits
    }
    if (this.fractionDigits) {
      result.fractionDigits = this.fractionDigits
    }
    if (this.length) {
      result.length = this.length
    }
    if (this.dateFractions) {
      result.dateFractions = this.dateFractions
    }
    return result
  }
}
