import { IdGeneratorQueueInboxItem, IdGeneratorRequest } from "@/parser/visitorTools/idGenerator"
import { CstPath } from "./cstPathHelper"
import { ElementListType } from "./types"

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

  get isContainer(): boolean
}
