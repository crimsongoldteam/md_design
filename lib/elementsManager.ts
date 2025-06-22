import { BaseElement } from "./elements/baseElement"

export class ElementsManager {
  private readonly elements: Map<typeof BaseElement, { name: string; typeDescription: string }> = new Map()

  public addElement(element: typeof BaseElement, name: string, typeDescription: string) {
    this.elements.set(element, { name, typeDescription })
  }

  public getByName(name: string): typeof BaseElement | undefined {
    return Array.from(this.elements.entries()).find(([_, value]) => value.name === name)?.[0]
  }

  public getByTypeDescription(typeDescription: string): typeof BaseElement | undefined {
    return Array.from(this.elements.entries()).find(([_, value]) => value.typeDescription === typeDescription)?.[0]
  }

  public getNameByClass(element: typeof BaseElement): string | undefined {
    return this.elements.get(element)?.name
  }
}

export const elementsManager = new ElementsManager()
