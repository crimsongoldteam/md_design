import { CstChildrenDictionary, CstElement, CstNode, IToken } from "chevrotain"
import { parser } from "./parser"
import { GroupMap } from "./groupMap"

const BaseVisitor = parser.getBaseCstVisitorConstructor()

export class GroupVisitor extends BaseVisitor {
  indentsMap: GroupMap = new GroupMap(parser)

  form(ctx: CstChildrenDictionary): CstNode {
    this.indentsMap = new GroupMap(parser)

    for (const row of ctx.row as CstNode[]) {
      this.visit(row)
      this.indentsMap.endLine()
    }
    return this.indentsMap.build()
  }

  row(ctx: CstChildrenDictionary): void {
    for (const column of ctx.column as CstNode[]) {
      this.visit(column)
    }
  }

  column(ctx: CstChildrenDictionary): void {
    const indent = this.visit(ctx.indents as CstNode[])

    this.visit(ctx.inline as CstNode[], { indent: indent })
    this.visit(ctx.horizontalGroup as CstNode[], { indent: indent })
  }

  inline(ctx: CstChildrenDictionary, params: any): void {
    let tokens = this.visit(ctx.inlineItem as CstNode[])
    this.indentsMap.addTokens(tokens, params.indent)
  }

  inlineItem(ctx: CstChildrenDictionary): CstElement[] {
    return ctx.InlineText
  }

  horizontalGroup(ctx: CstChildrenDictionary, params: any): void {
    for (const item of ctx.verticalGroupHeader as CstNode[]) {
      this.indentsMap.add(item, params.indent)
    }
  }

  pages(ctx: CstChildrenDictionary, params: any): void {
    for (const item of ctx.page as CstNode[]) {
      this.indentsMap.add(item, params.indent)
    }
  }

  indents(ctx: CstChildrenDictionary): number {
    if (!ctx) {
      return 0
    }

    let result = 0
    for (const key in ctx) {
      const elementList = ctx[key] as IToken[]
      elementList.forEach((element) => {
        result += element.image.length
      })
    }
    return result
  }
}

export const groupVisitor = new GroupVisitor()
