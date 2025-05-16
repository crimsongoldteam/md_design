// import { CstNode, EmbeddedActionsParser, EOF, IToken, TokenType } from "chevrotain";

// import { GroupStack } from "./groupStack";
// import { InlineParser } from "./parser";

// import * as t from "./lexer";

// class GroupParser extends EmbeddedActionsParser {
//   group_stack: GroupStack = new GroupStack;

//   constructor() {
//     super(t.allTokens);
//     this.performSelfAnalysis();
//   }

//   public parse() {
//     this.group_stack = new GroupStack();
//     this.form()
//     return this.group_stack.getForm()
//   }

//   public form = this.RULE("form", () => {
//     this.SUBRULE(this.rows);
//   })

//   public rows = this.RULE("rows", () => {
//     let isFirst = true;
//     let isEnd = false;
//     this.MANY({
//       GATE: () => {
//         return !isEnd;
//       },
//       DEF: () => {
//         this.OR([
//           {
//             IGNORE_AMBIGUITIES: true,
//             ALT: () => {
//               isEnd = true;
//               this.CONSUME3(EOF);
//             },
//           },
//           {
//             GATE: () => {
//               return isFirst;
//             },
//             ALT: () => {
//               let header = this.SUBRULE1(this.formHeader);
//               this.ACTION(() => { this.group_stack.getForm().children.FormHeader.push(header); })
//               isFirst = false;
//             },
//           },
//           {
//             ALT: () => {
//               isFirst = false;
//               this.SUBRULE(this.row);
//             },
//           },
//         ]);
//       },
//     });
//   })

//   // ---Заголовок формы---
//   public formHeader = this.RULE("formHeader", () => {
//     let result = this.group_stack.createFormHeader()

//     result.children.Dash.push(this.CONSUME1(t.TripleDash));

//     this.MANY(() => {
//       result.children.Text.push(this.CONSUME2(t.FormHeaderText));
//     });

//     result.children.Dash.push(this.CONSUME3(t.TripleDash));

//     this.OPTION({
//       GATE: () => { return this.LA(1).tokenType != EOF; },
//       DEF: () => { this.CONSUME(t.NewLine) },
//     });

//     return result;
//   });

//   private consumeIn(parent: CstNode | undefined, name: string, tokenType: TokenType) {
//     let item = this.CONSUME(tokenType);
//     if (!parent) { return }
//     this.ACTION(() => { parent.children[name].push(item) });
//   }

//   // #Заголовок 1
//   public verticalGroupHeader = this.RULE("verticalGroupHeader", (hGroup) => {
//     let vGroup: CstNode | undefined;
//     let vGroupHeader: CstNode | undefined;

//     this.ACTION(() => {
//       vGroup = this.group_stack.createVGroup(hGroup);
//       vGroupHeader = vGroup.children.VGroupHeader[0] as CstNode;
//     });

//     this.consumeIn(vGroupHeader, "Hash", t.Hash)

//     this.MANY(() => { this.consumeIn(vGroupHeader, "Text", t.GroupHeaderText) })
//     return vGroup;
//   });

//   // /Заголовок страницы
//   // public pageHeader = this.RULE("pageHeader", () => {
//   //   let page: CstNode | undefined;
//   //   let pageHeader: CstNode | undefined;

//   //   this.ACTION(() => {
//   //     page = this.group_stack.createPage();
//   //     pageHeader = page.children.PageHeader[0] as CstNode;
//   //   });

//   //   this.consumeIn(pageHeader, "Slash", t.Slash)

//   //   this.MANY(() => { this.consumeIn(pageHeader, "Text", t.PageHeaderText) })

//   //   return page;
//   // });

//   public pageHeader = this.RULE("pageHeader", () => {
//     this.CONSUME_EXT(t.Slash) 
//     this.MANY(() => { this.CONSUME_EXT(t.PageHeaderText) })

//     // let page: CstNode | undefined;
//     // let pageHeader: CstNode | undefined;

//     // this.ACTION(() => {
//     //   page = this.group_stack.createPage();
//     //   pageHeader = page.children.PageHeader[0] as CstNode;
//     // });

//     // this.consumeIn(pageHeader, "Slash", t.Slash)

//     // this.MANY(() => { this.consumeIn(pageHeader, "Text", t.PageHeaderText) })

//     // return page;
//   });


//   public indents = this.RULE("indents", () => {
//     let indent = 0;
//     this.MANY(() => {
//       this.CONSUME(t.Tab);
//       this.ACTION(() => { indent++; })
//     });
//     return indent;
//   });

//   public oneLineGroup = this.RULE("oneLineGroup", (first) => {
//     let result: CstNode | undefined;

//     this.ACTION(() => {
//       result = this.group_stack.createOneLineGroup();
//       this.group_stack.setParent(first, result);
//     });

//     let separator = true;
//     this.MANY({
//       GATE: () => {
//         return separator;
//       },
//       DEF: () => {
//         this.OR([
//           {
//             ALT: () => {
//               this.CONSUME1(t.Ampersand);
//               separator = true;
//             },
//           },
//           {
//             ALT: () => {
//               let items = Array<IToken>();
//               this.AT_LEAST_ONE(() => {
//                 let inlineText = this.CONSUME2(t.OneGroupText);
//                 this.ACTION(() => { items.push(inlineText); });
//               });

//               this.ACTION(() => {
//                 if (items.length > 0) {
//                   let inline = this.group_stack.createInline();
//                   this.group_stack.setParent(inline, result as CstNode);
//                   this.group_stack.addToInline(inline, items)
//                   // inline.children.Items = items;
//                 }
//               });

//               separator = false;
//               this.OPTION(() => {
//                 this.CONSUME3(t.Ampersand);
//                 separator = true;
//               });
//             },
//           },
//         ]);
//       },
//     });
//     return result;
//   });

//   public inline = this.RULE("inline", () => {
//     let result: CstNode | undefined;

//     this.ACTION(() => {
//       result = this.group_stack.createInline();
//     });

//     this.AT_LEAST_ONE(() => {
//       this.consumeIn(result, "Items", t.OneGroupText)
//     });

//     this.OPTION(() => {
//       this.CONSUME(t.Ampersand);
//       result = this.SUBRULE(this.oneLineGroup, { ARGS: [result] });
//     });

//     return result;
//   });

//   public column = this.RULE("column", () => {
//     let result: CstNode | undefined;

//     this.OR([
//       {
//         // #Подзаголовок 1 #Подзаголовок 2
//         ALT: () => {
//           this.ACTION(() => { result = this.group_stack.createHGroup(); });

//           this.AT_LEAST_ONE(() => {
//             this.SUBRULE(this.verticalGroupHeader, { ARGS: [result] });
//           });
//         },
//       },
//       // /Страница
//       {
//         ALT: () => { result = this.SUBRULE(this.pageHeader); },
//       },
//       // Строчный элемент
//       {
//         ALT: () => { result = this.SUBRULE(this.inline); },
//       },
//     ]);
//     return result;
//   });

//   public rowSeparator = this.RULE("rowSeparator", () => {
//     let result = false;
//     this.OR([
//       {
//         ALT: () => {
//           this.CONSUME(t.Plus);
//           result = true;
//         },
//       },
//       {
//         IGNORE_AMBIGUITIES: true,
//         ALT: () => {
//           this.CONSUME(EOF);
//         },
//       },
//       {
//         GATE: () => {
//           return this.LA(1).tokenType != EOF;
//         },
//         ALT: () => {
//           this.CONSUME(t.NewLine);
//         },
//       },
//     ]);
//     return result;
//   });

//   public row = this.RULE("row", () => {
//     let separator = true;
//     this.MANY({
//       GATE: () => {
//         return separator;
//       },
//       DEF: () => {
//         let item: CstNode | undefined;
//         this.ACTION(() => {
//           item = this.group_stack.createInline();
//         });

//         let indent = this.SUBRULE(this.indents);

//         this.OPTION(() => { item = this.SUBRULE(this.column); });

//         separator = this.SUBRULE(this.rowSeparator);

//         this.ACTION(() => { this.group_stack.collect(item as CstNode, indent, separator); });
//       },
//     });

//     this.ACTION(() => { this.group_stack.doneRow(); });
//   });
// }

// export const groupParser = new GroupParser();
