import "./polyfill.js"

import { parser } from "./parser/parser"
import { lexer } from "./parser/lexer"
import { groupVisitor } from "./parser/groupVisitor"
import { visitor } from "./parser/visitor"
import { instanceToPlain } from "class-transformer"

export function parseInputInner(input: string): string {
  const lexingResult = lexer.tokenize(input)

  parser.input = lexingResult.tokens

  const groupsAST = parser.parse()
  const fullAST = groupVisitor.visit(groupsAST)
  const result = visitor.visit(fullAST)

  const plain = instanceToPlain(result, { groups: ["production"] })
  return JSON.stringify(plain, null, 2)
}

;(window as any).parseInputInner = parseInputInner
