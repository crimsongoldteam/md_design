import { BaseElement } from "@/elements/baseElement"
import { StringUtils } from "@/utils/stringUtils"

export interface IdFormatterRule {
  property: string
  prefix?: string
}

export class IdFormatter {
  public static format(element: BaseElement, rules: IdFormatterRule[]): string | undefined {
    for (const rule of rules) {
      const value = element.getProperty(rule.property) as string | undefined

      if (!value) continue

      const pascalCase = StringUtils.toPascalCase(value, rule.prefix)
      if (!pascalCase) continue

      return pascalCase
    }

    return undefined
  }
}
