import { CstElement, CstNode, IToken } from "chevrotain"
import { BaseFormElement } from "./formElements"
import * as monaco from "monaco-editor-core"

export enum SemanticTokensTypes {
  FormHeader,
  VerticalGroupHeader,
  PageHeader,
  Properties,
  Checkbox,
  LableHeader,
  InputHeader,
  InputValue,
  InputMultiline,
  CommandBarSeparator,
  Button,
}

class SemanticToken {
  public startLine: number = 0
  public startColumn: number = Number.MAX_SAFE_INTEGER
  public endColumn: number = 0

  // без начальных и конечных пробелов
  public startColumnPayload: number = Number.MAX_SAFE_INTEGER
  public endColumnPayload: number = 0

  public element: BaseFormElement
  public type: SemanticTokensTypes
  constructor(type: SemanticTokensTypes, element: BaseFormElement) {
    this.type = type
    this.element = element
  }
}

export class SemanticTokensManager {
  private rows: Array<SemanticToken>[] = []

  public reset(): void {
    this.rows = []
  }

  public add(type: SemanticTokensTypes, ctx: CstElement[], element: BaseFormElement, exclude: string[] = []) {
    if (!ctx || ctx.length === 0) {
      return
    }

    this.addTokens(ctx, type, element, exclude)
  }

  public prepare(): void {
    for (const row of this.rows) {
      if (!row || row.length === 0) {
        continue
      }

      this.sortTokens(row)

      if (row[0].startColumn > 1) {
        row[0].startColumn = 1
      }

      this.concatTokens(row)
    }
  }

  private sortTokens(row: SemanticToken[]) {
    row.sort((a, b) => a.startColumn - b.startColumn)
  }

  private concatTokens(row: SemanticToken[]) {
    let i = 1
    while (i < row.length) {
      const prevToken = row[i - 1]
      const currentToken = row[i]

      if (prevToken.element === currentToken.element && prevToken.type === currentToken.type) {
        prevToken.endColumn = currentToken.endColumn
        prevToken.endColumnPayload = currentToken.endColumnPayload

        row.splice(i, 1)
        continue
      }

      // Если между токенами есть промежуток, корректируем конец предыдущего
      if (currentToken.startColumn > prevToken.endColumn + 1) {
        prevToken.endColumn = currentToken.startColumn - 1
        // Не изменяем endColumnPayload, так как это пробелы между разными токенами
      }
      i++
    }
  }

  public getTokensData(): number[] {
    const result: number[] = []

    // let deltaLine = 0
    // for (const row of this.rows) {
    //   let deltaStartChar = 0

    //   if (!row || row.length === 0) {
    //     deltaLine++
    //     continue
    //   }

    //   for (const token of row) {
    //     let length = token.endColumn - token.startColumn + 1
    //     // [deltaLine, deltaStartChar, length, tokenTypeIndex, tokenModifiersBits]
    //     const data = [deltaLine, deltaStartChar, length, token.type, 0]

    //     deltaStartChar = deltaStartChar + length
    //     deltaLine = 0
    //     result.push(...data)
    //   }
    //   deltaLine = 1
    // }

    return result
  }

  private readonly decorationOptions: {
    [key in SemanticTokensTypes]?: monaco.editor.IModelDeltaDecoration["options"]
  } = {
    [SemanticTokensTypes.InputValue]: { inlineClassName: "edit-input-value-decoration" },
    [SemanticTokensTypes.Button]: { inlineClassName: "edit-button-decoration" },
    [SemanticTokensTypes.VerticalGroupHeader]: { inlineClassName: "edit-group-header-decoration" },
    [SemanticTokensTypes.Properties]: { inlineClassName: "edit-properties-decoration" },
  }

  public getDecorations(): monaco.editor.IModelDeltaDecoration[] {
    const result: monaco.editor.IModelDeltaDecoration[] = []

    for (const row of this.rows) {
      if (!row) {
        continue
      }
      for (const token of row) {
        const options = this.decorationOptions[token.type]

        if (!options) {
          continue
        }

        const item: monaco.editor.IModelDeltaDecoration = {
          options: options,
          range: {
            startLineNumber: token.startLine,
            startColumn: token.startColumnPayload,
            endLineNumber: token.startLine,
            endColumn: token.endColumnPayload,
          },
        }
        result.push(item)
      }
    }

    return result
  }

  private addTokens(ctx: CstElement[], type: SemanticTokensTypes, element: BaseFormElement, exclude: string[] = []) {
    for (let node of ctx) {
      if ((node as CstNode).children) {
        for (const [key, value] of Object.entries((node as CstNode).children)) {
          if (exclude.includes(key)) {
            continue
          }
          this.addTokens(value, type, element)
        }
        continue
      }

      this.addToken(type, element, node as IToken)
    }
  }

  private addToken(type: SemanticTokensTypes, element: BaseFormElement, token: IToken) {
    const semanticToken: SemanticToken = new SemanticToken(type, element)
    semanticToken.startLine = token.startLine ?? 0
    semanticToken.startColumn = token.startColumn ?? 0
    semanticToken.endColumn = token.endColumn ?? 0

    const image = token.image
    const leadingSpaceLength = image.length - image.trimStart().length
    const trailingSpaceLength = image.length - image.trimEnd().length

    semanticToken.startColumnPayload = semanticToken.startColumn + leadingSpaceLength
    semanticToken.endColumnPayload = semanticToken.endColumn - trailingSpaceLength + 1

    if (!this.rows[semanticToken.startLine - 1]) {
      this.rows[semanticToken.startLine - 1] = []
    }
    this.rows[semanticToken.startLine - 1].push(semanticToken)
  }
}
