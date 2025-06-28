import { FormFormatterFactory } from "@/formatter/formatterFactory"
import { FormElement } from "@/elements/formElement"
import { CSTGenerator } from "./cstGenerator"
import { ICursorBuilder, ICursorFormatter, IModelCursor } from "./interfaces"
import { VerticalGroupElement } from "@/elements/verticalGroupElement"

export class GroupCursorFormatter implements ICursorFormatter {
  public format(element: FormElement): string {
    const text = FormFormatterFactory.getFormatter(element).format(element, { onlyItems: true })
    return text.join("\n")
  }
}

export class GroupCursorBuilder implements ICursorBuilder {
  public build(text: string, cursor: IModelCursor): void {
    const currentGroup = cursor.getCst() as VerticalGroupElement

    currentGroup.items = []

    const result = CSTGenerator.build(text, "parseGroupEditorContainer")
    cursor.setSemanticTokensManager(result.semanticTokensManager)

    for (const item of (result.element as VerticalGroupElement).items) {
      currentGroup.items.push(item)
      item.parent = currentGroup
    }
  }
}
