export class HierarchyManager {
  private hierarchy: any[] = []
  private readonly defaultParent: (item: any) => any
  private readonly collectionField: string
  private readonly afterAdd: ((parent: any, item: any) => void) | undefined

  constructor(
    collectionField: string,
    defaultParent: (item: any) => any,
    afterAdd?: ((parent: any, item: any) => void) | undefined
  ) {
    this.defaultParent = defaultParent
    this.collectionField = collectionField
    this.afterAdd = afterAdd
  }

  public set(item: any, level: number) {
    let index = level - 1

    if (index >= this.hierarchy.length) {
      index = this.hierarchy.length - 1
    }

    if (index == -1) {
      const parent = this.defaultParent(item)
      this.hierarchy = [parent]
      if (this.afterAdd) {
        this.afterAdd(undefined, parent)
      }

      return
    }

    const parent = this.hierarchy[index]

    parent[this.collectionField].push(item)
    if (this.afterAdd) {
      this.afterAdd(parent, item)
    }

    this.hierarchy = this.hierarchy.slice(0, index + 1)
    this.hierarchy.push(item)
  }
}
