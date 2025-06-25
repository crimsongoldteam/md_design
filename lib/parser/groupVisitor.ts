import { CstChildrenDictionary, CstElement, CstNode, IToken } from "chevrotain"
import { parser } from "./parser"
import { GroupMap } from "./groupMap"
import { EditorContainerNode, FormNode } from "./groupMapNodes"

const BaseVisitor = parser.getBaseCstVisitorConstructor()

export class GroupVisitor extends BaseVisitor {
  groupMap: GroupMap = new GroupMap(parser, new FormNode(undefined))

  form(ctx: CstChildrenDictionary): CstNode {
    const rootNode = new FormNode(ctx.formHeader as CstNode[])
    this.groupMap = new GroupMap(parser, rootNode)

    if (ctx.row) {
      for (const row of ctx.row as CstNode[]) {
        this.visit(row)
      }
    }

    return this.groupMap.build()
  }

  editorContainer(ctx: CstChildrenDictionary): CstNode {
    const rootNode = new EditorContainerNode()
    this.groupMap = new GroupMap(parser, rootNode)

    if (ctx.row) {
      for (const row of ctx.row as CstNode[]) {
        this.visit(row)
      }
    }

    return this.groupMap.build()
  }

  row(ctx: CstChildrenDictionary): void {
    const columns = ctx.column as CstNode[]

    const hasSeparator = this.visit(ctx.EOL as CstNode[]) > 1

    this.groupMap.startLine(columns.length > 1)

    for (const column of columns) {
      this.visit(column, { hasSeparator: hasSeparator })
      this.groupMap.next()
    }

    this.groupMap.endLine()
  }

  EOL(ctx: CstChildrenDictionary): number {
    if (!ctx.NewLine) {
      return 0
    }

    const result = ctx.NewLine.length
    return result
  }

  column(ctx: CstChildrenDictionary, params: any): void {
    const indent = this.visit(ctx.indents as CstNode[])

    this.visit(ctx.inline as CstNode[], { indent: indent, hasSeparator: params.hasSeparator })
    this.visit(ctx.horizontalGroup as CstNode[], { indent: indent })

    if (ctx.pageHeader) {
      this.groupMap.addPage(ctx.pageHeader[0] as CstNode, indent)
    }
  }

  inline(ctx: CstChildrenDictionary, params: any): void {
    let inlineGroupTokens: IToken[][] = []
    for (const item of ctx.inlineItem as CstNode[]) {
      inlineGroupTokens.push(this.visit(item) ?? ([] as IToken[]))
    }
    this.groupMap.addTokens(inlineGroupTokens, params.indent, params.hasSeparator)
  }

  inlineItem(ctx: CstChildrenDictionary): CstElement[] {
    return ctx.InlineText
  }

  horizontalGroup(ctx: CstChildrenDictionary, params: any): void {
    this.groupMap.addHorizontalGroup(ctx.verticalGroupHeader as CstNode[], params.indent)
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
