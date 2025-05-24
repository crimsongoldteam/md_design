import { createTokenInstance, IToken, TokenType } from "chevrotain"
import * as t from "./lexer.ts"

export class Detector {
  public getTypeToken(tokens: Array<IToken>): IToken {
    const tokenType = this.detect(tokens)
    return createTokenInstance(tokenType, tokenType.name, -1, -1, -1, -1, -1, -1)
  }

  private detect(tokens: Array<IToken>): TokenType {
    const firstToken = tokens[0]

    const checkboxTokens = [t.CheckboxChecked, t.CheckboxUnchecked, t.SwitchChecked, t.SwitchUnchecked]

    let hasVBar: boolean = false
    let hasColon: boolean = false
    let hasRightCheckbox: boolean = false

    if (firstToken.tokenType == t.LAngle) {
      return t.CommandBarType
    }

    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index]
      const nextToken = tokens[index + 1]
      const isInlineElementEnd = index == tokens.length - 1 || nextToken?.tokenType == t.LCurly

      if (token.tokenType == t.VBar) {
        hasVBar = true
        continue
      }
      if (token.tokenType == t.Colon) {
        hasColon = true
        continue
      }
      if (checkboxTokens.includes(token.tokenType) && isInlineElementEnd) {
        hasRightCheckbox = true
      }
    }

    if (hasVBar) {
      return t.TableType
    }

    if (hasColon) {
      return t.InputFieldType
    }

    if (hasRightCheckbox) {
      return t.CheckboxRightFieldType
    }

    if (checkboxTokens.includes(firstToken.tokenType)) {
      return t.CheckboxLeftFieldType
    }

    return t.LabelFieldType
  }
}
