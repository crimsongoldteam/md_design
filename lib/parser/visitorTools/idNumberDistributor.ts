export class IdNumberDistributor {
  // Хранит счетчики для каждого scope: { scope1 → { name1 → count, name2 → count }, scope2 → {...} }
  private readonly scopes: Map<any, Map<string, number[]>> = new Map()

  /**
   * Получить имя с номером в указанном scope.
   * @param name - Входное имя (может содержать цифры в конце).
   * @param scope - Область видимости нумерации
   * @return Имя с добавленным номером (если требуется).
   */
  public getNumberedName(name: string, scope: any = undefined): string {
    const { text: stringPart, digits: numberPart } = this.extractTextNumberParts(name) // НДС13
    const lowerBaseName = stringPart.toLowerCase() // НДС

    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, new Map())
    }

    const scopeCounts = this.scopes.get(scope)!
    let currentNumbers: number[] = []
    if (!scopeCounts.has(lowerBaseName)) {
      scopeCounts.set(lowerBaseName, currentNumbers)
    } else {
      currentNumbers = scopeCounts.get(lowerBaseName) as number[]
    }

    const nextNumber = this.popNextFreeNumber(currentNumbers, numberPart)

    return name + nextNumber
  }

  private popNextFreeNumber(numbers: number[], prefix: string): string {
    let currentNumber = prefix
    let currentNumberIndex = 0
    let currentNumberInt = parseInt(prefix)

    let index = 0
    for (const element of numbers) {
      const numberAtPosition = element.toString()
      if (numberAtPosition == currentNumber) {
        currentNumberIndex++
        currentNumber = (prefix == "0" ? "" : prefix) + currentNumberIndex.toString()
        currentNumberInt = parseInt(currentNumber)
      }

      if (element > currentNumberInt) {
        break
      }

      index++
    }

    numbers.splice(index, 0, currentNumberInt)

    return currentNumberIndex === 0 ? "" : currentNumberIndex.toString()
  }

  public reset(): void {
    this.scopes.clear() // Полный сброс
  }

  private extractTextNumberParts(name: string): { text: string; digits: string } {
    const match = RegExp(/(\d+)$/).exec(name)

    if (match) {
      const digits = match[0]
      const text = name.slice(0, match.index)
      return { text, digits }
    }
    return { text: name, digits: "0" }
  }
}
