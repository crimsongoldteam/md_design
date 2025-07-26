import { CstChildrenDictionary, CstElement } from "chevrotain"
import { Parser } from "./parser"
import { VisitorUtils } from "./visitorUtils"
import { TypeProcessor } from "./typeProcessor"

const BaseVisitor = new Parser().getBaseCstVisitorConstructor()

export class TypeDescriptionVisitor extends BaseVisitor {
  propertyValues(ctx: CstChildrenDictionary): any {
    const values = this.visitAll(ctx.propertyValue)
    return TypeProcessor.visit(values)
  }

  propertyValue(ctx: CstChildrenDictionary): any {
    const value = this.joinTokens(ctx.PropertiesValueText)
    const options = this.visitAll(ctx.propertyValueOption)

    return { value: value, options: options }
  }

  propertyValueOption(ctx: CstChildrenDictionary): any {
    return this.joinTokens(ctx.PropertiesValueOptionText)
  }

  private visitAll(ctx: CstElement[], param?: any): any {
    return VisitorUtils.visitAll(this, ctx, param)
  }

  private joinTokens(tokens: CstElement[]): string | undefined {
    return VisitorUtils.joinTokens(tokens)
  }
}
