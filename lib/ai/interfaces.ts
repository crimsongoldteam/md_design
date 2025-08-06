import { ITypeDescription } from "@/elements/interfaces"
import { DateFractions } from "@/elements/types"

export interface ITypeDescriptionDetectorResultItem {
  id: string
  type: ITypeDescription
  isNew: boolean
}

export interface IMetadata {
  description: string
  type: string
  section: string
}

export type TypeDescriptionDetectorResult = ITypeDescriptionDetectorResultItem[]

export interface ITypeDescriptionDetectorRequest {
  id: string
  terms: { singular: string; plural: string }[]
  preferedType: string

  baseType: string
  digits: number
  fractionDigits: number
  length: number
  dateFractions: DateFractions
}
