import { CstNode } from "chevrotain"
import { AbstractModel } from "./abstractModel"
import { EditorContainerElement, FormElement, VerticalGroupElement } from "./parser/visitorTools/formElements"
import { parser } from "./parser/parser"

export class FormModel extends AbstractModel<FormElement> {
  constructor() {
    super()
  }

  public onChangeContent: (content: string) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  public updateVerticalGroup(groupId: string, containerElement: EditorContainerElement) {
    const element = this.getElementByUuid(groupId)
    if (element && element instanceof VerticalGroupElement) {
      element.items.length = 0
      element.items.push(...containerElement.items)
    }
    this.format(true)
  }

  protected override parse(): CstNode {
    return parser.parseForm()
  }
}
