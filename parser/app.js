// MIT License

// Copyright (c) 2025 Zherebtsov Nikita <nikita@crimsongold.ru>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// https://github.com/crimsongoldteam/md_design

import { lexer } from "./lexer.js";
import { groupParser } from "./group-parser.js";
import { visitor } from "./visitor.js";



// window.groupParser = null;
// window.lexer = null;
// window.visitor = null;

// Load = () => {
//   const chevrotain = window.chevrotain;
//   const createToken = chevrotain.createToken;
//   const Lexer = chevrotain.Lexer;
//   const CstParser = chevrotain.CstParser;
//   const EmbeddedActionsParser = chevrotain.EmbeddedActionsParser;
//   const EOF = chevrotain.EOF;

//   // const EmptyLine = createToken({
//   //   name: "EmptyLine",
//   //   pattern: /(?<=\n)[ \t]*\n/,
//   //   label: "Empty line",
//   //   line_breaks: true,
//   // });

//   window.groupParser = new GroupParser();

//   const BaseVisitor = window.groupParser.getBaseCstVisitorConstructor();

//   window.visitor = new Visitor();

//   // window.lexer = new Lexer(allTokens);
// };

function parseInput(input) {
  let resultJSON = "";

  let lexingResult = lexer.tokenize(input);  
  groupParser.input = lexingResult.tokens;

  let cst = groupParser.Form();

  const result = visitor.visit(cst);

  resultJSON = JSON.stringify(result);
//   let resultJSON = "";
//   if (window.lexer === null) {
//     Load();
//   }

//   try {
//     let lexingResult = lexer.tokenize(input);

//     window.groupParser.input = lexingResult.tokens;

//     let cst = groupParser.Form();

//     const result = visitor.visit(cst);

//     
//   } catch (e) {
//     return "Ошибка: " + e.name + ":" + e.message + "\n" + e.stack;
//   }
  //  return resultJSON;
  return resultJSON;  
}


