import { FormElement } from "@/elements"
import { IModelCursor, ICSTModel, IElementPathData, IAfterUpdateParams } from "./interfaces"
import { CstPath, CstPathHelper } from "@/elements/cstPathHelper"
import { IdGenerator } from "@/parser/visitorTools/idGenerator"
import { IBaseElement } from "@/elements/interfaces"

export class CSTModel implements ICSTModel {
  private _cst: FormElement = new FormElement()

  private readonly cursors: Set<IModelCursor> = new Set()

  public onChangeContent?: (cst: IBaseElement | undefined) => void

  get cst(): FormElement {
    return this._cst
  }

  set cst(value: FormElement) {
    this._cst = value
  }

  getElement(path: CstPath): IBaseElement | undefined {
    return this.cst.findElementByCstPath(path)
  }

  createOrUpdateElement(data: IElementPathData, source?: IModelCursor): void {
    if (data.isNew) {
      this.createElement(data)
    } else {
      this.updateElement(data)
    }

    this.afterUpdate({ excludeCursor: source })
  }

  getPathByElementId(id: string): CstPath | undefined {
    const element = this.cst.getElementByElementId(id)
    if (!element) return undefined
    return CstPathHelper.getCstPath(element)
  }

  public afterUpdate(params: IAfterUpdateParams): void {
    this.generateIds()
    this.unregisterDisconnectedCursors()

    if (!params.stopPropagation) {
      this.updateCursors(params.excludeCursor)
    }

    this.onChangeContent?.(this.cst)
  }

  public registerCursor(cursor: IModelCursor): void {
    this.cursors.add(cursor)
    cursor.onRegisterCursor?.()
  }

  public unregisterCursor(cursor: IModelCursor): void {
    this.cursors.delete(cursor)
    cursor.onUnregisterCursor?.()
  }

  private updateCursors(excludeCursor: IModelCursor | undefined): void {
    for (const cursor of this.cursors) {
      if (cursor === excludeCursor) continue
      cursor.format(false)
    }
  }

  private unregisterDisconnectedCursors(): void {
    for (let cursor of this.cursors) {
      if (!cursor.isConnected()) {
        this.unregisterCursor(cursor)
      }
    }
  }

  private createElement(data: IElementPathData) {
    if (data.item instanceof FormElement) throw new Error("FormElement cannot be created")

    const parentPath = this.cst.getContainerForNewElement(data.path)
    const parent = parentPath.parent
    const list = parent.getList(parentPath.parentList)
    if (!list) throw new Error("List not found")

    const insertIndex = parentPath.parentListIndex + 1
    list.splice(insertIndex, 0, data.item)

    this.cst.updateParents()
  }

  private updateElement(data: IElementPathData) {
    if (data.item instanceof FormElement) {
      this.cst = data.item
      return
    }

    const element = this.cst.getElementPosition(data.item, data.path)
    if (!element) return

    const parent = element.parent

    const list = parent.getList(element.parentList)
    if (!list) throw new Error("List not found")

    list[element.parentListIndex] = data.item

    this.cst.updateParents()
  }

  private generateIds(): void {
    const idGenerator = new IdGenerator()

    const items = this.cst.getAllElements()

    for (let item of items) {
      idGenerator.add(item)
    }
    idGenerator.generate()
  }
}
