import * as t from "../parser/lexer"
import { ButtonGroupElement } from "../parser/visitorTools/formElements"
import { IFormatter } from "./formFormatter"

export class ButtonGroupFormatter implements IFormatter<ButtonGroupElement> {
  public format(_element: ButtonGroupElement): string[] {
    return [" " + (t.Dash.LABEL as string)]
  }
}
