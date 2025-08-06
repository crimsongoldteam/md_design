import { DateFractions } from "@/elements/types"
import { ITypeDescriptionDetectorRequest } from "./interfaces"
import { Expose, Type } from "class-transformer"

export class TypeDescriptionDetectorRequest implements ITypeDescriptionDetectorRequest {
  @Expose({ name: "Идентификатор" })
  id: string = ""

  @Expose({ name: "Варианты" })
  @Type(() => TypeDescriptionDetectorRequestTerm)
  terms: TypeDescriptionDetectorRequestTerm[] = []

  @Expose({ name: "ПредпочтительныйТип" })
  preferedType: string = ""

  @Expose({ name: "БазовыйТип" })
  baseType: string = ""

  @Expose({ name: "ДлинаЧисла" })
  public digits: number = 0

  @Expose({ name: "ТочностьЧисла" })
  public fractionDigits: number = 0

  @Expose({ name: "ДлинаСтроки" })
  public length: number = 0

  @Expose({ name: "ЧастиДаты" })
  public dateFractions: DateFractions = DateFractions.Date
}

export class TypeDescriptionDetectorRequestTerm {
  @Expose({ name: "ЕдинственноеЧисло" })
  public singular: string = ""

  @Expose({ name: "МножественноеЧисло" })
  public plural: string = ""
}
