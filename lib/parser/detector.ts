import { createTokenInstance, IToken, TokenType } from "chevrotain"
import * as t from "./lexer.ts"

export class Detector {
  private readonly checkboxTokens = [t.CheckboxChecked, t.CheckboxUnchecked, t.SwitchChecked, t.SwitchUnchecked]

  public getTypeToken(tokens: Array<IToken>): IToken {
    const tokenType = this.detect(tokens)
    return createTokenInstance(tokenType, tokenType.name, -1, -1, -1, -1, -1, -1)
  }

  private detect(tokens: Array<IToken>): TokenType {
    if (tokens.length === 0) {
      return t.LabelFieldType
    }

    const { firstToken, hasLeftArrow } = this.processFirstToken(tokens)

    if (this.isPropertyLine(firstToken)) {
      return t.PropertyLineType
    }

    if (this.isCommandBar(firstToken)) {
      return t.CommandBarType
    }

    const { hasVBar, hasColon, hasRightCheckbox } = this.analyzeTokens(tokens)

    return this.determineFieldType(hasVBar, hasColon, hasRightCheckbox, hasLeftArrow, firstToken)
  }

  private processFirstToken(tokens: Array<IToken>): { firstToken: IToken; hasLeftArrow: boolean } {
    let firstToken = tokens[0]
    let hasLeftArrow = false

    if (firstToken.tokenType === t.LArrow || firstToken.tokenType === t.RArrow) {
      hasLeftArrow = true
      firstToken = tokens[1]
    }

    return { firstToken, hasLeftArrow }
  }

  private isPropertyLine(token: IToken): boolean {
    return token.tokenType === t.LCurly
  }

  private isCommandBar(token: IToken): boolean {
    return token.tokenType === t.LAngle
  }

  private analyzeTokens(tokens: Array<IToken>): { hasVBar: boolean; hasColon: boolean; hasRightCheckbox: boolean } {
    let hasVBar = false
    let hasColon = false
    let hasRightCheckbox = false

    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index]
      const nextToken = tokens[index + 1]
      const isInlineElementEnd = index === tokens.length - 1 || nextToken?.tokenType === t.LCurly

      if (token.tokenType === t.VBar) {
        hasVBar = true
      } else if (token.tokenType === t.Colon) {
        hasColon = true
      } else if (this.checkboxTokens.includes(token.tokenType) && isInlineElementEnd) {
        hasRightCheckbox = true
      }
    }

    return { hasVBar, hasColon, hasRightCheckbox }
  }

  private determineFieldType(
    hasVBar: boolean,
    hasColon: boolean,
    hasRightCheckbox: boolean,
    hasLeftArrow: boolean,
    firstToken: IToken
  ): TokenType {
    if (hasVBar && !hasLeftArrow) {
      return t.TableType
    }

    if (hasColon) {
      return t.InputFieldType
    }

    if (hasRightCheckbox) {
      return t.CheckboxRightFieldType
    }

    if (this.checkboxTokens.includes(firstToken.tokenType)) {
      return t.CheckboxLeftFieldType
    }

    return t.LabelFieldType
  }
}
