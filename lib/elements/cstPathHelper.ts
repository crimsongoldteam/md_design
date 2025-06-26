import { Expose, TransformFnParams, Transform } from "class-transformer"
import { ElementListType } from "./types"
import { elementsManager } from "@/elementsManager"
import { IBaseElement } from "./interfaces"
import { BaseElement } from "./baseElement"

/**
 * Path item of element in the CST tree.
 */

export class CstPathItem {
  /**
   * The type of the element in the path
   */
  @Expose({ name: "elementType", toClassOnly: true })
  @Transform(
    (params: TransformFnParams) => {
      return elementsManager.getByName(params.value)
    },
    { toClassOnly: true }
  )
  public elementType: typeof BaseElement

  @Expose({ name: "elementType", toPlainOnly: true })
  public get elementTypeDescription(): string {
    return elementsManager.getNameByClass(this.elementType) ?? ""
  }

  /**
   * The index of the element in its parent list
   */
  @Expose()
  public parentListIndex: number

  /**
   * The type of the parent list containing this element
   */
  @Expose()
  public parentList: ElementListType

  constructor(elementType: typeof BaseElement, parentListIndex: number, parentList: ElementListType) {
    this.elementType = elementType
    this.parentListIndex = parentListIndex
    this.parentList = parentList
  }
}

class CstPathWithElementItem extends CstPathItem {
  constructor(elementType: any, parentListIndex: number, parentList: ElementListType, public element: IBaseElement) {
    super(elementType, parentListIndex, parentList)
  }
}

type CstPathWithElements = Array<CstPathWithElementItem>

/**
 * Position of an element in the CST tree.
 * Contains information about the element's location within its parent container.
 */
export class CstElementPosition {
  /**
   * @param index - The index of the element in its parent list
   * @param parentList - The type of the parent list containing this element
   * @param parent - The parent element that contains this element
   */
  constructor(
    /**
     * The index of the element in its parent list
     */
    public parentListIndex: number,
    /**
     * The type of the parent list containing this element
     */
    public parentList: ElementListType,
    /**
     * The parent element that contains this element
     */
    public parent: IBaseElement
  ) {}
}

export type CstPath = Array<CstPathItem>

export class CstPathHelper {
  public static getCstPath(element: IBaseElement): CstPath {
    const result: CstPath = []
    let currentElement: IBaseElement | undefined = element
    while (currentElement) {
      if (!currentElement.parent) break

      if (!currentElement.parentList) return []

      const parent = currentElement.parent
      const list = parent.getList(currentElement.parentList)
      if (!list) {
        throw new Error(`List ${currentElement.parentList} not found in ${parent.type}`)
      }

      const index = list.indexOf(currentElement)

      if (index === -1) return []

      result.push(new CstPathItem(currentElement.constructor as typeof BaseElement, index, currentElement.parentList))
      currentElement = currentElement.parent
    }

    return result.reverse()
  }

  public static getElementPosition(
    root: IBaseElement,
    element: IBaseElement,
    path: CstPath
  ): CstElementPosition | undefined {
    const current = this.findElementByCstPath(root, path)
    if (!current) return undefined

    if (current.constructor !== element.constructor) return undefined

    const lastItem = path[path.length - 1]
    return new CstElementPosition(lastItem.parentListIndex, lastItem.parentList, current.parent ?? root)
  }

  public static getInContainerPosition(root: IBaseElement, path: CstPath): CstElementPosition {
    const pathWithElements = this.getCstPathWithElements(root, path)

    if (pathWithElements.length === 0) return new CstElementPosition(0, ElementListType.Items, root)

    let index = pathWithElements.length - 1
    while (index >= 0 && !pathWithElements[index].element.isContainer) {
      index--
    }

    if (index === -1) return new CstElementPosition(0, ElementListType.Items, root)

    return new CstElementPosition(
      pathWithElements[index].parentListIndex,
      pathWithElements[index].parentList,
      pathWithElements[index].element.parent ?? root
    )
  }

  private static getCstPathWithElements(root: IBaseElement, path: CstPath): CstPathWithElements {
    if (path.length === 0)
      return [new CstPathWithElementItem(root.constructor as typeof BaseElement, 0, ElementListType.Items, root)]

    const result: CstPathWithElements = []
    let currentElement: IBaseElement | undefined = root
    for (let item of path) {
      if (!currentElement) return []

      const list: Array<IBaseElement> | undefined = currentElement.getList(item.parentList)
      if (!list) return []

      const element: IBaseElement | undefined = list[item.parentListIndex]
      if (!element) return []

      if (element.constructor !== item.elementType) return []

      result.push(new CstPathWithElementItem(item.elementType, item.parentListIndex, item.parentList, element))
      currentElement = element
    }

    return result
  }

  public static findElementByCstPath(root: IBaseElement, path: CstPath): IBaseElement | undefined {
    const pathWithElements = this.getCstPathWithElements(root, path)
    if (pathWithElements.length === 0) return undefined
    return pathWithElements[pathWithElements.length - 1].element
  }
}
