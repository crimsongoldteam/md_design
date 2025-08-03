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
      name: item.type,
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
        term,
        properties: ["name", "description"],
      })

      for (const item of result.hits) {
        item.score *= reduceCoefficient
        allResults.push(item)
      }

      reduceCoefficient -= this.reduceCoefficient
    }

    allResults = allResults.sort((a, b) => b.score - a.score)
    allResults = allResults.slice(0, this.maxResults)

    let result: IAttributesTypeDescriptionDetectorSearchResult[] = []
    for (const item of allResults) {
      result.push({
        type: new TypeDescription(item.document.section + "." + item.document.type),
        isNew: false,
      })
    }
    return result
  }
}
