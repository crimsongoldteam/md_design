import { parser } from "./parser/parser"
import { lexer } from "./parser/lexer"
import { groupVisitor } from "./parser/groupVisitor"
import { IToken, CstNode } from "chevrotain"
import { visitor } from "./parser/visitor"

function transformStructure(node: CstNode | IToken): any {
  if ("children" in node) {
    // Это узел дерева (TreeNode)
    const result: any = {
      name: node.name,
      children: {},
    }

    for (const [key, children] of Object.entries(node.children)) {
      result.children[key] = children.map((child) => transformStructure(child))
    }

    return result
  } else {
    // Это конечный элемент (Token)
    const result: any = {}
    if ("image" in node) {
      result.image = node.image
    }
    if (node.tokenType?.name) {
      result.tokenType = { name: node.tokenType.name }
    }
    return result
  }
}

function parseInputInner(input: string) {
  const lexingResult = lexer.tokenize(input)

  parser.input = lexingResult.tokens

  const groupsAST = parser.parse()
  const fullAST = groupVisitor.visit(groupsAST)
  const result = visitor.visit(fullAST)

  console.log(parser.input)

  // const resultFormat = transformStructure(result);
  return JSON.stringify(result, null, 2)
}

declare global {
  interface Window {
    parseInputInner: Object
  }
}

window.parseInputInner = parseInputInner
