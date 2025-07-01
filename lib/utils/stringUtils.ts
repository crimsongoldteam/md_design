export class StringUtils {
  public static toPascalCase(input: string | undefined, prefix: string | undefined): string | undefined {
    if (!input || typeof input !== "string") return undefined

    const withNumberReplaced = input.replace(/№/g, "Номер")

    const cleaned = StringUtils.clean(withNumberReplaced, false)

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

  public static clean(input: string | undefined, removeWhitespace: boolean = true): string | undefined {
    if (!input || typeof input !== "string") return undefined

    const regexp = removeWhitespace ? /[^a-zA-Zа-яА-Я0-9_]/g : /[^a-zA-Zа-яА-Я0-9_ \t]/g
    const cleaned = input.replace(regexp, "")

    return cleaned
  }
}
