import { CstNode } from "chevrotain"
import { AbstractModel } from "./abstractModel"
import { parser } from "../parser/parser"
import { FormElement } from "../elements/formElement"
import { EditorContainerElement } from "../elements/editorContainerElement"
import { VerticalGroupElement } from "../elements/verticalGroupElement"
import { CstPath } from "../elements/baseElement"

export class FormModel extends AbstractModel<FormElement> {
  constructor() {
    super()
  }

  public onChangeContent: (content: string) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  public updateVerticalGroup(groupPath: CstPath, containerElement: EditorContainerElement) {
    const element = this.findElementByCstPath(groupPath)
    if (element && element instanceof VerticalGroupElement) {
      element.items.length = 0
      element.items.push(...containerElement.items)
    }
    this.format()
  }

  protected override parse(): CstNode {
    return parser.parseForm()
  }
}
