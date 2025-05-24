import "./polyfill.js"

import { parser } from "./parser/parser"
import { lexer } from "./parser/lexer"
import { groupVisitor } from "./parser/groupVisitor"
import { visitor } from "./parser/visitor"
import { instanceToPlain } from "class-transformer"

function parseInputInner(input: string) {
  const lexingResult = lexer.tokenize(input)

  parser.input = lexingResult.tokens

  const groupsAST = parser.parse()
  const fullAST = groupVisitor.visit(groupsAST)
  const result = visitor.visit(fullAST)

  const plain = instanceToPlain(result, { groups: ["dev"] })
  return JSON.stringify(plain, null, 2)
}

;(window as any).parseInputInner = parseInputInner
