import { BaseFormElement } from "./formElements"

export class NameGenerator {
  private readonly usedNames: Set<string> = new Set()

  public generateName(element: BaseFormElement): string {
    let baseName = element.getBaseElementName()
    let candidateName = baseName
    let counter = 1

    while (this.usedNames.has(candidateName)) {
      candidateName = `${baseName}${counter}`
      counter++
    }

    this.usedNames.add(candidateName)
    return candidateName
  }

  public reset(): void {
    this.usedNames.clear()
  }

  public addUsedName(name: string): void {
    this.usedNames.add(name)
  }
}
