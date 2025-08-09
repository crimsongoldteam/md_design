import { IdGeneratorQueueInboxItem, IdGeneratorRequest } from "@/parser/visitorTools/idGenerator"
import { CstPath } from "./cstPathHelper"
import { DateFractions, ElementListType } from "./types"

export interface IBaseElement {
  updateParents(): unknown
  parent: IBaseElement | undefined
  parentList: ElementListType | undefined
  elementId: string
  type: string

  getCstPath(): CstPath

  getList(listType: ElementListType): Array<IBaseElement> | undefined

  getElementByElementId(id: string): IBaseElement | undefined
  getAllElements(): IBaseElement[]

  getIdTemplate(request: IdGeneratorRequest): string
  getIdGeneratorQueue(): IdGeneratorQueueInboxItem[]

  getAttributes(): IAttributes

  get isContainer(): boolean
}

export interface IAttribute {
  typeDescription: ITypeDescription
  items?: IAttributes[]
}

export interface IAttributes extends Map<string, IAttribute> {}

export interface ITypeDescription {
  types: string[]
  digits: number
  fractionDigits: number
  length: number
  dateFractions: DateFractions
  auto: boolean

  isNew: boolean

  isEmpty(): boolean
  isEqual(other: ITypeDescription): boolean
}
