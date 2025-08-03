import { create, insertMultiple, search } from "@orama/orama"
import { stemmer } from "@orama/stemmers/russian"
import { pluginPT15 } from "@orama/plugin-pt15"

export class Propositions {
  private readonly db: any

  private readonly reduceCoefficient = 0.1
  private readonly maxResults = 10

  constructor() {
    this.db = create({
      schema: {
        title: "string",
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

  async addMultiple(data: { title: string }[]) {
    await insertMultiple(this.db, data, undefined, "russian")
  }

  async search(terms: string[]) {
    const allResults: any[] = []

    let reduceCoefficient = 1.0
    for (const term of terms) {
      const result = await search(this.db, {
        term,
      })

      for (const item of result.hits) {
        item.score *= reduceCoefficient
        allResults.push(item)
      }

      reduceCoefficient -= this.reduceCoefficient
    }

    const sortedResults = allResults.sort((a, b) => b.score - a.score)
    return sortedResults.slice(0, this.maxResults)
  }
}
