import { ITypeDescription } from "@/elements/interfaces"

export interface IAttributesTypeDescriptionDetectorSearchResult {
  type: ITypeDescription
  isNew: boolean
}

export interface IAttributesTypeDescriptionDetectorSchema {
  description: string
  type: string
  section: string
}

export interface IAttributesTypeDescriptionDetectorSearchParams {
  terms: string[]
  preferedType: string
}
