import { AnyOrama, create, insertMultiple, Results, search } from "@orama/orama"
import { stemmer } from "@orama/stemmers/russian"
import { pluginPT15 } from "@orama/plugin-pt15"
import { ITypeDescriptionDetectorRequest, IMetadata } from "./interfaces"
import { TypeDescription } from "@/elements/typeDescription"
import { SearchTypeDescriptions } from "./searchTypeDescriptions"

export class AttributesTypeDescriptionDetector {
  private readonly db: AnyOrama

  private readonly reduceCoefficient = 0.1
  private readonly maxResults = 10
  private readonly maxScore = 10

  constructor() {
    this.db = create({
      schema: {
        name: "string",
        description: "string",
        type: "string",
        section: "string",
      },
      components: {
        tokenizer: {
          stemming: true,
          language: "russian",
          stemmer,
        },
      },
      plugins: [pluginPT15()],
    })
  }

  async addMetadata(data: IMetadata[]) {
    let items = data.map((item) => ({
      name: this.splitPascalCaseString(item.type),
      description: item.description,
      type: item.type,
      section: item.section,
    }))
    await insertMultiple(this.db, items, undefined, "russian")
  }

  search(params: ITypeDescriptionDetectorRequest): TypeDescription[] {
    let allResults = new SearchTypeDescriptions()

    let reduceCoefficient = 1.0
    for (const term of params.terms) {
      if (term.isPrimitive()) {
        allResults.add(term.createPrimitiveTypeDescription(), this.maxScore)
        continue
      }

      const result: Results<any> = search(this.db, {
        term: term.singular,
        properties: ["name", "description"],
      }) as Results<any>

      let exactFound = false
      for (const item of result.hits) {
        if (item.document.type === term.singular || item.document.type === term.plural) {
          exactFound = true
        }
      }

      if (!exactFound) {
        const typeDescription = new TypeDescription(term.type + "." + term.plural, true)
        allResults.add(typeDescription, this.maxScore)
      }

      for (const item of result.hits) {
        item.score *= reduceCoefficient

        const typeDescription = new TypeDescription(item.document.section + "." + item.document.type)
        allResults.add(typeDescription, item.score)
      }
      reduceCoefficient -= this.reduceCoefficient
    }

    return allResults.getTypesDescriptions(this.maxResults)
  }

  splitPascalCaseString(sourceString: string): string {
    const separatorPosition = sourceString.indexOf("_")
    if (separatorPosition !== -1) {
      sourceString = sourceString.substring(separatorPosition + 1)
    }

    let result = ""
    const stringLength = sourceString.length

    let previousCharUpper = false

    for (let charIndex = 0; charIndex < stringLength; charIndex++) {
      const currentChar = sourceString.charAt(charIndex)

      let nextCharUpper = true
      if (charIndex < stringLength - 1) {
        const nextChar = sourceString.charAt(charIndex + 1)
        nextCharUpper = nextChar.toUpperCase() === nextChar
      }

      const currentCharUpper = currentChar.toUpperCase() === currentChar

      if (currentCharUpper && (!previousCharUpper || !nextCharUpper) && charIndex > 0) {
        result += " "
      }

      result += currentChar
      previousCharUpper = currentCharUpper
    }

    return result.toLowerCase()
  }
}
