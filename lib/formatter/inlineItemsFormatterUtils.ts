import { BaseElement, TableElement } from "../elements"
import { FormFormatterFactory } from "./formatterFactory"

export class InlineItemsFormatterUtils {
  public static format(items: BaseElement[], indent: string = ""): string[] {
    const result: string[] = []

    let previousItem: BaseElement | undefined = undefined
    for (const item of items) {
      if (this.needSeparator(item, previousItem)) {
        result.push("")
      }
      const text = FormFormatterFactory.getFormatter(item).format(item)
      result.push(...text.map((line) => indent + line))

      previousItem = item
    }
    return result
  }

  public static needSeparator(item: BaseElement, previousItem: BaseElement | undefined): boolean {
    if (!previousItem) {
      return false
    }

    if (item instanceof TableElement && previousItem instanceof TableElement) {
      return true
    }

    return false
  }
}
