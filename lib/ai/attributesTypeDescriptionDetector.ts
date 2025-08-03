import { AnyOrama, create, insertMultiple, search } from "@orama/orama"
import { stemmer } from "@orama/stemmers/russian"
import { pluginPT15 } from "@orama/plugin-pt15"
import {
  IAttributesTypeDescriptionDetectorSearchParams,
  IAttributesTypeDescriptionDetectorSearchResult,
  IAttributesTypeDescriptionDetectorSchema,
} from "./interfaces"
import { TypeDescription } from "@/elements/typeDescription"

export class AttributesTypeDescriptionDetector {
  private readonly db: AnyOrama

  private readonly reduceCoefficient = 0.1
  private readonly maxResults = 10
  private readonly exactScore = 10

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

  async addMultiple(data: IAttributesTypeDescriptionDetectorSchema[]) {
    let items = data.map((item) => ({
      name: this.splitPascalCaseString(item.type),
      description: item.description,
      type: item.type,
      section: item.section,
    }))
    await insertMultiple(this.db, items, undefined, "russian")
  }

  async search(
    params: IAttributesTypeDescriptionDetectorSearchParams
  ): Promise<IAttributesTypeDescriptionDetectorSearchResult[]> {
    let allResults: any[] = []

    let reduceCoefficient = 1.0
    for (const term of params.terms) {
      const result = await search(this.db, {
        term: term.singular,
        properties: ["name", "description"],
      })

      let exactFound = false
      for (const item of result.hits) {
        if (item.document.type === term.singular || item.document.type === term.plural) {
          exactFound = true
        }
      }

      if (!exactFound) {
        allResults.push({
          type: new TypeDescription(params.preferedType + "." + term.plural),
          isNew: true,
          score: this.exactScore,
        })
      }

      for (const item of result.hits) {
        item.score *= reduceCoefficient

        allResults.push({
          type: new TypeDescription(item.document.section + "." + item.document.type),
          isNew: false,
          score: item.score,
        })
      }
      reduceCoefficient -= this.reduceCoefficient
    }

    allResults = allResults.sort((a, b) => b.score - a.score)
    allResults = allResults.slice(0, this.maxResults)

    let result: IAttributesTypeDescriptionDetectorSearchResult[] = []
    for (const item of allResults) {
      result.push({
        type: item.type,
        isNew: item.isNew,
      })
    }
    return result
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
