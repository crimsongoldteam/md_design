import { BaseElement } from "@/elements/baseElement"

export interface IdFormatterRule {
  property: string
  prefix?: string
}

export class IdFormatter {
  public static format(element: BaseElement, rules: IdFormatterRule[]): string | undefined {
    for (const rule of rules) {
      const value = element.getProperty(rule.property) as string | undefined

      if (!value) continue

      const pascalCase = this.toPascalCase(value, rule.prefix)
      if (!pascalCase) continue

      return pascalCase
    }

    return undefined
  }

  private static toPascalCase(input: string | undefined, prefix: string | undefined): string | undefined {
    if (!input || typeof input !== "string") return undefined

    const withNumberReplaced = input.replace(/№/g, "Номер")

    const cleaned = withNumberReplaced.replace(/[^a-zA-Zа-яА-Я0-9_ \t]/g, "")

    if (!cleaned) {
      return undefined
    }

    const parts = cleaned.split(/[ \t]+/).filter(Boolean)

    if (parts.length === 0) return undefined

    let result = parts.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join("")

    // remove leading digits if no prefix
    if (!prefix && /^\d/.test(result)) {
      result = result.replace(/^\d+/, "")
    }

    if (!result) return undefined

    if (prefix) {
      result = prefix + result
    }

    return result
  }
}
