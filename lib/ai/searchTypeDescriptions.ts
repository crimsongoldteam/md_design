import { ISearchTypeDescription } from "./interfaces"
import { TypeDescription } from "@/elements/typeDescription"

export class SearchTypeDescriptions {
  public items: ISearchTypeDescription[] = []

  public add(typeDescription: TypeDescription, score: number) {
    const existingResult = this.getByTypeDescription(typeDescription)
    if (existingResult) {
      existingResult.score = Math.max(existingResult.score, score)
      return
    }

    this.items.push({
      type: typeDescription,
      score,
    })
  }

  public getTypesDescriptions(maxResults: number): TypeDescription[] {
    const sortedItems = [...this.items].sort((a, b) => b.score - a.score)
    let result: TypeDescription[] = []

    for (const item of sortedItems) {
      result.push(item.type)
      if (result.length >= maxResults) break
    }

    return result
  }

  private getByTypeDescription(typeDescription: TypeDescription): ISearchTypeDescription | undefined {
    for (const item of this.items) {
      if (item.type.isEqual(typeDescription)) return item
    }
    return undefined
  }
}
