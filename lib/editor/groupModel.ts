import { CstNode } from "chevrotain"
import { AbstractModel } from "./abstractModel"
import { parser } from "../parser/parser"
import { EditorContainerElement } from "../elements/editorContainerElement"

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
