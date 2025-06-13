import { BaseElement, CstPath } from "./baseElement"

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

      result.push({
        type: currentElement.constructor,
        parentIndex: index,
        parentList: currentElement.parentList,
      })
      currentElement = currentElement.parent
    }

    return result.reverse()
  }

  public static findElementByCstPath(root: BaseElement, path: CstPath): BaseElement | undefined {
    let currentElement: BaseElement | undefined = root
    for (let item of path) {
      if (!currentElement) return undefined

      const list: Array<BaseElement> | undefined = currentElement.getList(item.parentList)
      if (!list) return undefined

      const element: BaseElement | undefined = list[item.parentIndex]
      if (!element) return undefined

      if (element.constructor !== item.type) return undefined

      currentElement = element
    }
    return currentElement
  }
}
