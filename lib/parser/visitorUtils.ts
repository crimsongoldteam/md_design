import { CstElement, CstNode, IToken } from "chevrotain"

export class VisitorUtils {
  /**
   * Посещает все узлы в массиве CST элементов
   */
  static visitAll(visitor: any, ctx: CstElement[], param?: any): CstNode[] {
    if (!ctx) {
      return []
    }
    return (ctx as CstNode[]).map((item) => visitor.visit(item, param))
  }

  /**
   * Объединяет токены в строку
   */
  static joinTokens(tokens: CstElement[]): string | undefined {
    if (tokens === undefined) {
      return undefined
    }
    return (tokens as IToken[])
      .map((token) => token.image)
      .join("")
      .trim()
  }
}
