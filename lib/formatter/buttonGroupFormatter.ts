import { ButtonGroupElement } from "../elements/buttonGroupElement"
import * as t from "../parser/lexer"
import { IFormatter } from "./formFormatter"

export class ButtonGroupFormatter implements IFormatter<ButtonGroupElement> {
  public format(_element: ButtonGroupElement): string[] {
    return [" " + (t.Dash.LABEL as string)]
  }
}
