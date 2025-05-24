export class HierarchyManager {
  private hierarchy: any[] = []
  private readonly defaultParent: (item: any) => any
  private readonly collectionField: string

  constructor({ collectionField, defaultParent }: { collectionField: string; defaultParent: (item: any) => any }) {
    this.defaultParent = defaultParent
    this.collectionField = collectionField
  }

  public set(item: any, level: number) {
    let index = level - 1

    if (index >= this.hierarchy.length) {
      index = this.hierarchy.length - 1
    }

    if (index == -1) {
      const parent = this.defaultParent(item)
      this.hierarchy = [parent]
      return
    }

    const parent = this.hierarchy[index]

    parent[this.collectionField].push(item)

    this.hierarchy = this.hierarchy.slice(0, index + 1)
    this.hierarchy.push(item)
  }
}
