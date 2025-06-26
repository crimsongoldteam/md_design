import { FormFormatterFactory } from "@/formatter/formatterFactory"
import { FormElement } from "@/elements/formElement"
import { CSTGenerator } from "./cstGenerator"
import { ICursorBuilder, ICursorFormatter, IModelCursor } from "./interfaces"
import { BaseElement } from "@/elements/baseElement"
import { SemanticTokensManager } from "@/parser/visitorTools/sematicTokensManager"
import { VerticalGroupElement } from "@/elements/verticalGroupElement"

export class GroupCursorFormatter implements ICursorFormatter {
  public format(element: FormElement): string {
    const text = FormFormatterFactory.getFormatter(element).format(element, { onlyItems: true })
    return text.join("\n")
  }
}

export class GroupCursorBuilder implements ICursorBuilder {
  public build(
    text: string,
    cursor: IModelCursor
  ): {
    element: BaseElement
    semanticTokensManager: SemanticTokensManager
  } {
    const currentGroup = cursor.getCst() as VerticalGroupElement

    currentGroup.items = []

    const result = CSTGenerator.build(text, "parseGroupEditorContainer")
    const semanticTokensManager = result.semanticTokensManager

    currentGroup.items.push(...(result.element as VerticalGroupElement).items)

    return {
      element: currentGroup,
      semanticTokensManager,
    }
  }
}
