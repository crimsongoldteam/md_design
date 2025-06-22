import { Expose, TransformFnParams, Transform } from "class-transformer"
import { BaseElement, ElementListType } from "./baseElement"
import { elementsManager } from "@/elementsManager"

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
  constructor(elementType: any, parentListIndex: number, parentList: ElementListType, public element: BaseElement) {
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
    public parent: BaseElement
  ) {}
}

export type CstPath = Array<CstPathItem>

export class CstPathHelper {
  public static getCstPath(element: BaseElement): CstPath {
    const result: CstPath = []
    let currentElement: BaseElement | undefined = element
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
    root: BaseElement,
    element: BaseElement,
    path: CstPath
  ): CstElementPosition | undefined {
    const current = this.findElementByCstPath(root, path)
    if (!current) return undefined

    if (current.constructor !== element.constructor) return undefined

    const lastItem = path[path.length - 1]
    return new CstElementPosition(lastItem.parentListIndex, lastItem.parentList, current.parent ?? root)
  }

  public static getInContainerPosition(root: BaseElement, path: CstPath): CstElementPosition {
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

  private static getCstPathWithElements(root: BaseElement, path: CstPath): CstPathWithElements {
    const result: CstPathWithElements = []
    let currentElement: BaseElement | undefined = root
    for (let item of path) {
      if (!currentElement) return []

      const list: Array<BaseElement> | undefined = currentElement.getList(item.parentList)
      if (!list) return []

      const element: BaseElement | undefined = list[item.parentListIndex]
      if (!element) return []

      if (element.constructor !== item.elementType) return []

      result.push(new CstPathWithElementItem(item.elementType, item.parentListIndex, item.parentList, element))
      currentElement = element
    }

    return result
  }

  public static findElementByCstPath(root: BaseElement, path: CstPath): BaseElement | undefined {
    const pathWithElements = this.getCstPathWithElements(root, path)
    if (pathWithElements.length === 0) return undefined
    return pathWithElements[pathWithElements.length - 1].element
  }
}
