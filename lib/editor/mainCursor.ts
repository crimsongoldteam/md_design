import { FormFormatterFactory } from "@/formatter/formatterFactory"
import { FormElement } from "@/elements/formElement"
import { CSTGenerator } from "./cstGenerator"
import { ICursorBuilder, ICursorFormatter, IModelCursor } from "./interfaces"
import { SemanticTokensManager } from "@/parser/visitorTools/sematicTokensManager"
import { IBaseElement } from "@/elements/interfaces"

export class MainCursorFormatter implements ICursorFormatter {
  public format(element: FormElement): string {
    const text = FormFormatterFactory.getFormatter(element).format(element)
    return text.join("\n")
  }
}

export class MainCursorBuilder implements ICursorBuilder {
  public build(
    text: string,
    _cursor: IModelCursor
  ): {
    element: IBaseElement
    semanticTokensManager: SemanticTokensManager
  } {
    const result = CSTGenerator.build(text, "parseForm")
    const semanticTokensManager = result.semanticTokensManager

    return {
      element: result.element,
      semanticTokensManager,
    }
  }
}
