import { ITypeDescription } from "@/elements/interfaces"
import { TypeDescription } from "@/elements/typeDescription"
import { DateFractions } from "@/elements/types"

export interface ITypeDescriptionDetectorResultItem {
  id: string
  types: ITypeDescription[]
}

export interface IMetadata {
  description: string
  type: string
  section: string
}

export type TypeDescriptionDetectorResult = ITypeDescriptionDetectorResultItem[]

export interface ITypeDescriptionDetectorRequestTerm {
  type: string

  singular?: string
  plural?: string

  digits?: number
  fractionDigits?: number
  length?: number
  dateFractions?: DateFractions

  isPrimitive(): boolean
  createPrimitiveTypeDescription(): ITypeDescription
}

export interface ITypeDescriptionDetectorRequest {
  id: string
  terms: ITypeDescriptionDetectorRequestTerm[]
}

export interface ISearchTypeDescription {
  type: TypeDescription
  score: number
}
