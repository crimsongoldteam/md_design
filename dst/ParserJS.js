window.groupParser = null;
window.lexer = null;
window.visitor = null;

Load = () => {
  const chevrotain = window.chevrotain;
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;
  const CstParser = chevrotain.CstParser;
  const EmbeddedActionsParser = chevrotain.EmbeddedActionsParser;

  const EmptyLine = createToken({
    name: "EmptyLine",
    pattern: /\n[ \t]*\n/,
    label: "Empty line",
    line_breaks: true,
  });

  
  const Hash = createToken({ name: "Hash", pattern: /#/, label: "#" });
  const Plus = createToken({ name: "Plus", pattern: /\+/, label: "+" });
  const Dash = createToken({ name: "Dash", pattern: /\-/, label: "-" });
  const Slash = createToken({ name: "Slash", pattern: /\//, label: "/" });
  const Ampersand = createToken({ name: "Ampersand", pattern: /\&/, label: "&" });
  const Tab = createToken({ name: "Tab", pattern: /\t/ });
  const Text = createToken({ name: "Text", pattern: /[^\&\#\+\-\n\r\t\/]+/ });
  const NewLine = createToken({
    name: "NewLine",
    pattern: /\n/,
    line_breaks: true,
    group_stock: chevrotain.Lexer.SKIPPED,
  });
  const Whitespace = createToken({
    name: "Whitespace",
    pattern: /s+/,
    group_stock: chevrotain.Lexer.SKIPPED,
  });

  const allTokens = [
    EmptyLine,
    Whitespace,
    NewLine,
    Hash,
    Ampersand,
    Dash,
    Plus,
    Slash,
    Tab,
    Text,
  ];

  // class LineParser extends CstParser {
  //   constructor() {
  //     super(allTokens);
  //     const $ = this;

  //     $.RULE("InlineStatement", () => {
  //       $.MANY(() => {
  //         $.SUBRULE($.Input);
  //       });
  //     });

  //     $.RULE("Input", () => {
  //       $.MANY(() => {
  //         $.CONSUME(Text);
  //       });
  //     });

  //     this.performSelfAnalysis();
  //   }
  // }

  // const lineParser = new LineParser();

  class GroupStock {
    constructor(form) {
      this.form = form;
      this.reset();
    }

    next() {
      this.index++;
      this.setCurrentParent(this.getPrevAtIndex());
    }

    getCurrentParent() {
      return this.currentParent;
    }

    setCurrentParent(parent) {
      this.currentParent = parent;
    }

    doneLine() {
      this.prevGroups = this.currentGroups.slice();
      this.currentGroups = [];
      this.index = 0;
      this.setCurrentParent(this.getPrevAtIndex());
    }

    getPrevAtIndex() {
      if (this.index >= this.prevGroups.length) {
        if (this.prevGroups.length > 0) {
          return this.prevGroups[this.prevGroups.length - 1];
        }
        return this.form;
      }
      return this.prevGroups[this.index];
    }

    getItemAtIndent(current, indent) {
      let resultIndent = this.getIndent(current);

      if (indent >= resultIndent) {
        return current;
      }

      let result = current;
      while (resultIndent > indent) {
        result = this.getParent(result);
        resultIndent = this.getIndent(parent);
      }

      return result;
    }

    getIndent(item) {
      return this.indents.get(item);
    }

    getParent(item) {
      const parent = this.parents.get(item);
      if (parent === undefined) {
        return this.form;
      }
      return parent;
    }

    add(item, indent) {
      let prevGroup = this.getCurrentParent();
      let parent = this.getItemAtIndent(prevGroup, indent);
      let curIndent = this.getIndent(parent);

      // Если это страница
      if (item.name == "PageHeader") {
        // Если это первая страница - создаем группу
        if (parent.name != "Pages") {
          const pages = this.getNewPages();
          // parent.children.Items.push(pages);
          this.setParent(pages, parent);
          this.setIndent(pages, curIndent);
          parent = pages;
        }

        const page = this.getNewPage(item);

        this.setParent(page, parent);
        this.setIndent(page, curIndent + 1);
        this.currentGroups.push(page);
        return;
      }

      //Если текущий элемент на этом уровне - страницы, значит они закончились и обращаемся к их родителю
      if (parent.name == "Pages") {
        parent = this.getParent(parent);
      }

      if (item.name == "VGroupHeader") {
        // debugger;
        if (parent.name != "HGroup") {
          const hGroup = this.getNewHGroup();
          this.setParent(hGroup, parent);
          this.setIndent(hGroup, curIndent);
          this.setCurrentParent(hGroup);
          parent = hGroup;
        }

        const group = this.getNewVGroup(item);
        this.setParent(group, parent);
        this.setIndent(group, curIndent);
        this.currentGroups.push(group);
        return;
      }

      const parentInline = this.getInline(parent, item);

      // Обычный элемент
      this.setParent(item, parentInline);
      this.currentGroups.push(parent);
    }

    getInline(parent, item) {
      if (item.name == "OneLineGroup") {
        return parent;
      }
      
      const len = parent.children.Items.length;
      if (len == 0) {
        return this.createInline(parent);
      }

      const parentInline = parent.children.Items[len - 1];
      if (parentInline.name != "Inline") {
        return this.createInline(parent);
      }
      return parentInline;
    }

    processEmptyLine() {
      let prevGroup = this.getCurrentParent();

      if (prevGroup.name == "VGroup") {
        this.reset();
      }
    }

    reset() {
      this.prevGroups = [];
      this.currentGroups = [];
      this.index = 0;

      this.parents = new WeakMap();
      this.indents = new WeakMap();
      this.setIndent(this.form, 0);

      this.currentParent = this.form;
    }

    setIndent(item, indent) {
      this.indents.set(item, indent);
    }

    setParent(item, parent) {
      this.parents.set(item, parent);
      parent.children.Items.push(item);
    }

    getNewVGroup(header) {
      const group = {
        name: "VGroup",
        children: { VGroupHeader: [], Items: [] },
      };

      if (header !== undefined) {
        group.children.VGroupHeader.push(header);
      }

      return group;
    }

    getNewHGroup() {
      const group = {
        name: "HGroup",
        children: { Items: [] },
      };

      return group;
    }

    getNewPage(header) {
      const page = {
        name: "Page",
        children: { PageHeader: [header], Items: [] },
      };
      return page;
    }

    getNewPages() {
      const page = {
        name: "Pages",
        children: { Items: [] },
      };
      return page;
    }

    createOneLineGroup() {
      const result = {
        name: "OneLineGroup",
        children: { Items: [] },
      };
      return result;
    }    

    createInline(parent) {
      const inline = {
        name: "Inline",
        children: { Items: [] },
      };
      this.setParent(inline, parent);
      return inline;
    }
  }

  class GroupParser extends EmbeddedActionsParser {
    constructor() {
      super(allTokens);
      const $ = this;

      $.RULE("Form", () => {
        let result = {
          name: "Form",
          children: { Items: [], FormHeader: [] },
        };

        // $.OPTION(() => {
        //   $.CONSUME1(Dash);
        //   $.CONSUME2(Dash);
        //   $.CONSUME3(Dash);
          
        //   $.CONSUME4(Text);
          
        //   $.CONSUME5(Dash);
        //   $.CONSUME6(Dash);
        //   $.CONSUME7(Dash); 
        //   // let header = $.SUBRULE($.FormHeader);
        //   // result.children.FormHeader.push(header);
        // });        

        let group_stock = new GroupStock(result);

        $.MANY(() => {
          $.OR([
            {
              ALT: () => {
                $.CONSUME(EmptyLine);
                if (!$.RECORDING_PHASE) {
                  group_stock.processEmptyLine();
                }
              },
            },
            {
              ALT: () => {
                $.SUBRULE($.Line, { ARGS: [group_stock] });
              },
            },
          ]);
        });
        return result;
      });
      
      // // ---Заголовок формы---
      // $.RULE("FormHeader", () => {
      //   let result = {
      //     name: "FormHeader",
      //     children: {Dash: [], Text: [] },
      //   };
                
      //   // $.MANY(() => {
      //   //   $.CONSUME(EmptyLine);
      //   // });          

      //   result.children.Dash.push($.CONSUME1(Dash));
      //   result.children.Dash.push($.CONSUME2(Dash));
      //   result.children.Dash.push($.CONSUME3(Dash));
        
      //   result.children.Text.push($.CONSUME4(Text));
        
      //   result.children.Dash.push($.CONSUME5(Dash));
      //   result.children.Dash.push($.CONSUME6(Dash));
      //   result.children.Dash.push($.CONSUME7(Dash));

      //   // $.OPTION(() => {
      //   //   $.CONSUME(NewLine);
      //   // });
                
      //   // $.MANY(() => {
      //   //   $.CONSUME(EmptyLine);
      //   // });          

      //   return result;
      // });

      // #Заголовок 1
      $.RULE("VGroupHeader", () => {
        let result = {
          name: "VGroupHeader",
          children: { Hash: [], Text: [] },
        };

        result.children.Hash.push($.CONSUME(Hash));
        result.children.Text.push($.CONSUME(Text));

        return result;
      });

      // /Заголовок страницы
      $.RULE("PageHeader", () => {
        let result = {
          name: "PageHeader",
          children: { Slash: [], Text: [] },
        };

        result.children.Slash.push($.CONSUME(Slash));
        result.children.Text.push($.CONSUME(Text));

        return result;
      });

      $.RULE("Indents", () => {
        let indent = 0;
        $.MANY(() => {
          $.CONSUME(Tab);
          if (!$.RECORDING_PHASE) {
            indent++;
          }
        });
        return indent;
      });

      $.RULE("OneLineGroup", (group_stock, indent, first) => {
        let result;
        if (!$.RECORDING_PHASE) {
          result = group_stock.createOneLineGroup();
        
          let inline = group_stock.createInline(result);
          inline.children.Items.push(first);
        };

        $.MANY({
          SEP: Ampersand,
          DEF: () => {
            let item = this.CONSUME(Text);
            if (!$.RECORDING_PHASE) {
              let inline = group_stock.createInline(result);
              inline.children.Items.push(item);
            };
          }
        });
        return result;
      });

      $.RULE("Inline", (group_stock, indent) => {      
        let item = this.CONSUME(Text);

        $.OPTION(() => {
          $.CONSUME(Ampersand);
          item = $.SUBRULE($.OneLineGroup, { ARGS: [group_stock, indent, item] });
        });

        if (!$.RECORDING_PHASE) {
          group_stock.add(item, indent);
        }

      })

      $.RULE("Line", (group_stock) => {
        $.MANY_SEP({
          SEP: Plus,
          DEF: () => {
            let indent = $.SUBRULE($.Indents);

            $.OR([
              {
                // #Подзаголовок 1 #Подзаголовок 2
                ALT: () => {
                  $.AT_LEAST_ONE(() => {
                    let header = $.SUBRULE($.VGroupHeader);

                    if (!$.RECORDING_PHASE) {
                      group_stock.add(header, indent);
                    }
                  });
                },
              },
              // /Страница
              {
                ALT: () => {
                  let header = $.SUBRULE($.PageHeader);

                  if (!$.RECORDING_PHASE) {
                    group_stock.add(header, indent);
                  }
                },
              },
               // Строчный элемент
              {
                ALT: () => {
                  $.SUBRULE($.Inline, { ARGS: [group_stock, indent] });
                },
              },
            ]);

            if (!$.RECORDING_PHASE) {
              group_stock.next();
            }
          },
        });
        $.OPTION(() => {
          $.CONSUME(NewLine);
        });

        if (!$.RECORDING_PHASE) {
          group_stock.doneLine();
        }
      });

      this.performSelfAnalysis();
    }
  }

  window.groupParser = new GroupParser();

  const BaseVisitor = window.groupParser.getBaseCstVisitorConstructor();

  class Visitor extends BaseVisitor {
    Form(ctx) {
      let result = {
        Тип: "Форма",
        УИД: crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
      };

      let header = this.visit(ctx.FormHeader);
      if (header !== undefined) {
        result.НаборСвойств.Заголовок = this.visit(ctx.FormHeader);
      }

      ctx.Items.forEach((item) => {
        result.Элементы.push(this.visit(item));
      });

      return result;
    }

    FormHeader(ctx) {
      return ctx.Text[0].image;
    }

    PageHeader(ctx) {
      return ctx.Text[0].image;
    }

    VGroupHeader(ctx) {
      return ctx.Text[0].image;
    }

    HGroup(ctx) {
      let result = {
        Тип: "ГоризонтальнаяГруппа",
        УИД: crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
      };

      ctx.Items.forEach((item) => {
        result.Элементы.push(this.visit(item));
      });

      return result;
    }

    VGroup(ctx) {
      let result = {
        Тип: "ВертикальнаяГруппа",
        УИД: crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
        ЭлементыПарсинг: [],
      };

      result.НаборСвойств.Заголовок = this.visit(ctx.VGroupHeader);

      ctx.Items.forEach((item) => {
        result.ЭлементыПарсинг.push(this.visit(item));
      });

      return result;
    }

    Pages(ctx) {
      let result = {
        Тип: "Страницы",
        УИД: crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
      };

      ctx.Items.forEach((item) => {
        result.Элементы.push(this.visit(item));
      });

      return result;
    }

    Page(ctx) {
      let result = {
        Тип: "Страница",
        УИД: crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
        ЭлементыПарсинг: [],
      };

      result.НаборСвойств.Заголовок = this.visit(ctx.PageHeader);

      ctx.Items.forEach((item) => {
        result.ЭлементыПарсинг.push(this.visit(item));
      });

      return result;
    }

    OneLineGroup(ctx) {
      let result = {
        Тип: "ОднострочнаяГруппа",
        УИД: crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
        ЭлементыПарсинг: [],
      };

      ctx.Items.forEach((item) => {
        result.ЭлементыПарсинг.push(this.visit(item));
      });

      return result;
    }

    Inline(ctx) {
      let result = {
        Тип: "СтрочныйЭлемент",
        УИД: crypto.randomUUID(),
        НаборСвойств: {},
        ЭлементыПарсинг: "",
      };

      result.ЭлементыПарсинг = ctx.Items.map((token) => token.image);
      return result;
    }
  }

  window.visitor = new Visitor();

  window.lexer = new Lexer(allTokens);
};

function parseInput(input) {
  let resultJSON = "";
  if (window.lexer === null) {
    Load();
  }

  // try {
  let lexingResult = window.lexer.tokenize(input);

  window.groupParser.input = lexingResult.tokens;
  let cst = groupParser.Form();

  const result = window.visitor.visit(cst);

  resultJSON = JSON.stringify(result);
  // } catch (e) {
  //     return 'Ошибка ' + e.name + ":" + e.message + "\n" + e.stack;
  // }
  return result;
}
