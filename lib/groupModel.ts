import { CstNode } from "chevrotain"
import { AbstractModel } from "./abstractModel"
import { EditorContainerElement } from "./parser/visitorTools/formElements"
import { parser } from "./parser/parser"

export class GroupModel extends AbstractModel<EditorContainerElement> {
  constructor() {
    super()
  }

  public onChangeContent: (content: string) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  protected override parse(): CstNode {
    return parser.parseGroupEditorContainer()
  }
}
