import { CstChildrenDictionary, CstNode, IToken } from 'chevrotain';
import { parser } from './parser'
import { IndentsMap } from './indentsMap';

const BaseVisitor = parser.getBaseCstVisitorConstructorWithDefaults()

export class GroupVisitor extends BaseVisitor {
    indentsMap: IndentsMap = new IndentsMap(parser)

    form(ctx: CstChildrenDictionary) {
        this.indentsMap = new IndentsMap(parser)

        for (const row of (ctx.row as CstNode[])) {
            this.visit(row)
            this.indentsMap.endLine()
        }
        return this.indentsMap.build();
    }

    row(ctx: CstChildrenDictionary) {
        for (const column of ctx.column as CstNode[]) {
            this.visit(column)
        }
    }

    column(ctx: CstChildrenDictionary) {
        const indent = this.visit(ctx.indents as CstNode[])

        this.visit(ctx.inline as CstNode[], {indent: indent})
    }

    inline(ctx: CstChildrenDictionary, params: any) {
        let tokens = this.visit(ctx.inlineItem as CstNode[])
        // for (const token of tokens) {
        this.indentsMap.addTokens(tokens, params.indent)
        // }
    }   
    
    inlineItem(ctx: CstChildrenDictionary) {
        return ctx.InlineText;
    }   

    indents(ctx: CstChildrenDictionary): number {
        if (!ctx) { return 0 }

        let result = 0;
        for (const key in ctx) {
            const elementList = ctx[key] as (IToken)[];
            elementList.forEach(element => { result += element.image.length })
        }
        return result;
    }
}

export const groupVisitor = new GroupVisitor();
