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
  LineButton,
  TableCell,
  TableSeparator,
  TableColumn,
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
  private linkTokens: Array<SemanticToken> = []

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
    this.linkTokens = []

    for (const row of this.rows) {
      if (!row || row.length === 0) {
        continue
      }

      this.sortTokens(row)

      if (row[0].startColumn > 1) {
        row[0].startColumn = 1
      }

      this.concatTokens(row)
      this.fillLinkTokens(row)
    }
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

  public getLinks(): monaco.languages.ILinksList {
    return {
      links: this.linkTokens.map((token) => ({
        range: {
          startLineNumber: token.startLine,
          startColumn: token.startColumnPayload,
          endLineNumber: token.startLine,
          endColumn: token.endColumnPayload,
        },
      })),
    }
  }

  public getAtPosition(line: number, column: number): SemanticToken | undefined {
    return this.rows[line - 1]?.find((token) => token.startColumn <= column && token.endColumn >= column)
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

  private fillLinkTokens(row: SemanticToken[]) {
    for (const token of row) {
      if (token.type !== SemanticTokensTypes.VerticalGroupHeader) continue

      this.linkTokens.push(token)
    }
  }

  private readonly decorationOptions: {
    [key in SemanticTokensTypes]?: monaco.editor.IModelDeltaDecoration["options"]
  } = {
    [SemanticTokensTypes.InputValue]: { inlineClassName: "edit-input-value-decoration" },
    [SemanticTokensTypes.Button]: { inlineClassName: "edit-button-decoration" },
    [SemanticTokensTypes.VerticalGroupHeader]: { inlineClassName: "edit-group-header-decoration" },
    [SemanticTokensTypes.PageHeader]: { inlineClassName: "edit-page-header-decoration" },
    [SemanticTokensTypes.Properties]: { inlineClassName: "edit-properties-decoration" },
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
    const leadingSpaceLength = image.length - this.getTrimmedStart(image).length
    const trailingSpaceLength = image.length - this.getTrimmedEnd(image).length

    semanticToken.startColumnPayload = semanticToken.startColumn + leadingSpaceLength
    semanticToken.endColumnPayload = semanticToken.endColumn - trailingSpaceLength + 1

    if (!this.rows[semanticToken.startLine - 1]) {
      this.rows[semanticToken.startLine - 1] = []
    }
    this.rows[semanticToken.startLine - 1].push(semanticToken)
  }

  /**
   * Возвращает строку с обрезанными ведущими пробелами.
   * Поддерживает как `trimStart()`, так и устаревший `trimLeft()`.
   */
  private getTrimmedStart(str: string): string {
    if (typeof str.trimStart === "function") return str.trimStart()
    if (typeof str.trimLeft === "function") return str.trimLeft() // NOSONAR
    return str.replace(/^\s+/, "")
  }

  /**
   * Возвращает строку с обрезанными завершающими пробелами.
   * Поддерживает как `trimEnd()`, так и устаревший `trimRight()`.
   */
  private getTrimmedEnd(str: string): string {
    if (typeof str.trimEnd === "function") return str.trimEnd()
    if (typeof str.trimRight === "function") return str.trimRight() // NOSONAR
    return str.replace(/\s+$/, "")
  }
}
