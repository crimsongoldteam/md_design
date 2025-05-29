import { CstChildrenDictionary, CstElement, CstNode, IToken } from "chevrotain"
import { parser } from "./parser"
import { GroupMap } from "./groupMap"

const BaseVisitor = parser.getBaseCstVisitorConstructor()

export class GroupVisitor extends BaseVisitor {
  groupMap: GroupMap = new GroupMap(parser)

  form(ctx: CstChildrenDictionary): CstNode {
    this.groupMap = new GroupMap(parser)

    if (ctx.row) {
      for (const row of ctx.row as CstNode[]) {
        this.visit(row)
      }
    }

    return this.groupMap.build()
  }

  row(ctx: CstChildrenDictionary): void {
    const columns = ctx.column as CstNode[]

    this.groupMap.startLine(columns.length > 1)

    for (const column of columns) {
      this.visit(column)
      this.groupMap.next()
    }

    this.groupMap.endLine()
  }

  column(ctx: CstChildrenDictionary): void {
    const indent = this.visit(ctx.indents as CstNode[])

    this.visit(ctx.inline as CstNode[], { indent: indent })
    this.visit(ctx.horizontalGroup as CstNode[], { indent: indent })

    if (ctx.pageHeader) {
      this.groupMap.addPage(ctx.pageHeader[0] as CstNode, indent)
    }
  }

  inline(ctx: CstChildrenDictionary, params: any): void {
    let tokens = this.visit(ctx.inlineItem as CstNode[]) ?? ([] as IToken[])
    this.groupMap.addTokens(tokens, params.indent)
  }

  inlineItem(ctx: CstChildrenDictionary): CstElement[] {
    return ctx.InlineText
  }

  horizontalGroup(ctx: CstChildrenDictionary, params: any): void {
    this.groupMap.addHorizontalGroup(ctx.verticalGroupHeader as CstNode[], params.indent)
  }

  // pageHeader(ctx: CstChildrenDictionary, params: any): void {
  //   this.indentsMap.add(ctx, params.indent)
  // }

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
