window.groupParser = null;
window.lexer = null;
window.visitor = null;

Load = () => {
  const chevrotain = window.chevrotain;
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;
  const CstParser = chevrotain.CstParser;
  const EmbeddedActionsParser = chevrotain.EmbeddedActionsParser;
  const EOF = chevrotain.EOF;

  const EmptyLine = createToken({
    name: "EmptyLine",
    pattern: /\n[ \t]*\n/,
    label: "Empty line",
    line_breaks: true,
  });

  const Header = createToken({
    name: "Header",
    pattern: Lexer.NA,
  });

  const InlineText = createToken({
    name: "InlineText",
    pattern: Lexer.NA,
  });

  const LCurly = createToken({
    name: "LCurly",
    pattern: /{/,
    label: "{",
    categories: [Header, InlineText],
  });
  const RCurly = createToken({
    name: "RCurly",
    pattern: /}/,
    label: "}",
    categories: [Header, InlineText],
  });
  const Semicolon = createToken({
    name: "Semicolon",
    pattern: /\;/,
    label: ";",
    categories: [Header, InlineText],
  });
  const Comma = createToken({
    name: "Comma",
    pattern: /\,/,
    label: ",",
    categories: [Header, InlineText],
  });
  const Equals = createToken({
    name: "Equals",
    pattern: /\=/,
    label: "=",
    categories: [Header, InlineText],
  });
  const Hash = createToken({ name: "Hash", pattern: /#/, label: "#" });
  const Plus = createToken({ name: "Plus", pattern: /\+/, label: "+" });
  const Dash = createToken({ name: "Dash", pattern: /\-/, label: "-" });
  const Slash = createToken({ name: "Slash", pattern: /\//, label: "/" });
  const Ampersand = createToken({
    name: "Ampersand",
    pattern: /\&/,
    label: "&",
  });
  const Tab = createToken({ name: "Tab", pattern: /\t/ });

  const Text = createToken({
    name: "Text",
    pattern: /[^\,\{\}\=\;\&\#\+\-\n\r\t\/ ][^\,\{\}\=\;\&\#\+\-\n\r\t\/]*/,
    categories: [Header, InlineText],
  });

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
    Whitespace,
    EmptyLine,
    Text,
    NewLine,
    LCurly,
    RCurly,
    Semicolon,
    Comma,
    Equals,
    Hash,
    Ampersand,
    Dash,
    Plus,
    Slash,
    Tab,
    Header,
    InlineText,
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
      for (
        let index = this.index;
        index <= this.prevGroups.length - 1;
        index++
      ) {
        let item = this.prevGroups[index];
        this.currentGroups.push(item);
      }

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
        page.children.Properties = item.children.Properties;

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
        group.children.Properties = item.children.Properties;
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

      // const parentInline = parent.children.Items[len - 1];
      // Сейчас каждый раз создаем новый, когда будет полный парсер - будем собирать в один
      // if (parentInline.name != "Inline") {
      return this.createInline(parent);
      // }
      // return parentInline;
    }

    processEmptyLine() {
      let prevGroup = this.getCurrentParent();

      while (prevGroup.name != "Page" && prevGroup.name != "Form") {
        prevGroup = this.getParent(prevGroup);
      }

      this.currentGroups.push(prevGroup);
      this.prevGroups = [];

      this.doneLine();
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
        children: { VGroupHeader: [], Items: [], Properties: {} },
      };

      if (header !== undefined) {
        group.children.VGroupHeader.push(header);
      }

      return group;
    }

    getNewHGroup() {
      const group = {
        name: "HGroup",
        children: { Items: [], Properties: {} },
      };

      return group;
    }

    getNewPage(header) {
      const page = {
        name: "Page",
        children: { PageHeader: [header], Items: [], Properties: {} },
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

        let group_stock = new GroupStock(result);

        $.SUBRULE($.Lines, { ARGS: [group_stock] });

        return result;
      });

      $.RULE("Lines", (group_stock) => {
        let isFirst = true;
        $.MANY2(() => {
          $.OR([
            {
              GATE: () => {
                return isFirst;
              },
              ALT: () => {
                let header = $.SUBRULE1($.FormHeader);
                if (!$.RECORDING_PHASE) {
                  group_stock.form.children.FormHeader.push(header);
                }
                isFirst = false;
              },
            },
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
                isFirst = false;
                $.SUBRULE($.Line, { ARGS: [group_stock] });
              },
            },
          ]);
        });
      });

      // ---Заголовок формы---
      $.RULE("FormHeader", () => {
        let result = {
          name: "FormHeader",
          children: { Dash: [], Text: [] },
        };

        result.children.Dash.push($.CONSUME1(Dash));
        result.children.Dash.push($.CONSUME2(Dash));
        result.children.Dash.push($.CONSUME3(Dash));

        result.children.Text.push($.CONSUME(Text));

        result.children.Dash.push($.CONSUME5(Dash));
        result.children.Dash.push($.CONSUME6(Dash));
        result.children.Dash.push($.CONSUME7(Dash));

        $.CONSUME(NewLine);

        return result;
      });

      // #Заголовок 1
      $.RULE("VGroupHeader", () => {
        let result = {
          name: "VGroupHeader",
          children: { Hash: [], Text: [], Properties: {} },
        };

        $.AT_LEAST_ONE(() => {
          result.children.Hash.push($.CONSUME(Hash));
        });

        result.children.Text.push($.CONSUME(Text));

        let propertiesObj = $.SUBRULE($.Properties);

        if (propertiesObj.isProperties) {
          result.children.Properties = propertiesObj.properties;
        } else {
          result.children.Text = result.children.Text.concat(
            propertiesObj.tokens
          );
        }

        return result;
      });

      // /Заголовок страницы
      $.RULE("PageHeader", () => {
        let result = {
          name: "PageHeader",
          children: { Slash: [], Text: [], Properties: {} },
        };

        result.children.Slash.push($.CONSUME(Slash));
        result.children.Text.push($.CONSUME(Text));

        let propertiesObj = $.SUBRULE($.Properties);

        if (propertiesObj.isProperties) {
          result.children.Properties = propertiesObj.properties;
        } else {
          result.children.Text = result.children.Text.concat(
            propertiesObj.tokens
          );
        }

        return result;
      });

      $.RULE("Properties", () => {
        let result = {
          properties: {},
          tokens: [],
          isProperties: false,
          isPropertiesCounter: 0,
        };

        $.OPTION1(() => {
          result.tokens.push($.CONSUME(LCurly));
          result.isPropertiesCounter++;
        });

        $.OPTION2(() => {
          $.SUBRULE1($.Property, { ARGS: [result] });
          $.MANY1(() => {
            result.tokens.push($.CONSUME(Comma));
            $.SUBRULE2($.Property, { ARGS: [result] });
          });
        });

        $.OPTION3(() => {
          result.tokens.push($.CONSUME(RCurly));
          result.isPropertiesCounter++;
          $.MANY2(() => {
            result.isPropertiesCounter = 0;
            result.tokens.push($.CONSUME(Header));
          });
        });

        result.isProperties = result.isPropertiesCounter > 1;

        return result;
      });

      $.RULE("Property", (params) => {
        let tokens = [];
        if (!$.RECORDING_PHASE) {
          tokens = params.tokens;
        }

        let isPropertiesCounter = 0;
        let key, value;
        $.OPTION1(() => {
          key = $.CONSUME1(Text);
          tokens.push(key);
          isPropertiesCounter++;
        });

        $.OPTION2(() => {
          tokens.push($.CONSUME(Equals));
          isPropertiesCounter++;
        });

        $.OPTION3(() => {
          value = $.CONSUME2(Text);
          tokens.push(value);
          isPropertiesCounter++;
        });

        if (!$.RECORDING_PHASE) {
          if (isPropertiesCounter < 3) {
            params.isPropertiesCounter = 0;
          } else {
            params.properties[key.image] = value.image;
          }
        }
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
        }

        $.MANY({
          SEP: Ampersand,
          DEF: () => {
            let item = this.CONSUME(Text);
            if (!$.RECORDING_PHASE) {
              let inline = group_stock.createInline(result);
              inline.children.Items.push(item);
            }
          },
        });
        return result;
      });

      $.RULE("Inline", (group_stock, indent) => {
        let item = this.CONSUME(InlineText);

        $.OPTION(() => {
          $.CONSUME(Ampersand);
          item = $.SUBRULE($.OneLineGroup, {
            ARGS: [group_stock, indent, item],
          });
        });

        if (!$.RECORDING_PHASE) {
          group_stock.add(item, indent);
        }
      });

      $.RULE("Column", (group_stock, indent) => {
        // let indent = $.SUBRULE($.Indents);

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
      });

      $.RULE("Line", (group_stock) => {
        $.MANY_SEP({
          SEP: Plus,
          DEF: () => {
            let indent = $.SUBRULE($.Indents);
            $.OPTION2(() => {
              $.SUBRULE2($.Column, { ARGS: [group_stock, indent] });
            });

            if (!$.RECORDING_PHASE) {
              group_stock.next();
            }
          },
        });

        $.OPTION3(() => {
          $.CONSUME2(NewLine);
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
        // УИД: self.crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
        ЭлементыПарсинг: [],
        ТипыСвойств: {},
        Координаты: {},
      };

      let header = this.visit(ctx.FormHeader);
      if (header !== undefined) {
        result.НаборСвойств.Заголовок = this.visit(ctx.FormHeader);
      }

      ctx.Items.forEach((item) => {
        result.ЭлементыПарсинг.push(this.visit(item));
      });

      this.addChildLocation(result.ЭлементыПарсинг, result);

      return result;
    }

    FormHeader(ctx) {
      return ctx.Text[0].image.trim();
    }

    PageHeader(ctx) {
      return ctx.Text.map((token) => token.image)
        .join("")
        .trim();
    }

    VGroupHeader(ctx) {
      return ctx.Text[0].image.trim();
    }

    HGroup(ctx) {
      let result = {
        Тип: "ГоризонтальнаяГруппа",
        // УИД: self.crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
        ТипыСвойств: {},
        Координаты: {},
      };

      ctx.Items.forEach((item) => {
        result.Элементы.push(this.visit(item));
      });

      this.addChildLocation(result.Элементы, result);

      return result;
    }

    VGroup(ctx) {
      let result = {
        Тип: "ВертикальнаяГруппа",
        // УИД: self.crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
        ЭлементыПарсинг: [],
        ТипыСвойств: {},
        Координаты: {},
      };

      for (const [key, value] of Object.entries(ctx.Properties)) {
        result.НаборСвойств[key.trim()] = value.trim();
      }

      result.НаборСвойств.Заголовок = this.visit(ctx.VGroupHeader);

      ctx.Items.forEach((item) => {
        result.ЭлементыПарсинг.push(this.visit(item));
      });

      if (ctx.VGroupHeader.length > 0) {
        this.consumeLocation(ctx.VGroupHeader[0].children.Hash, result);
        this.consumeLocation(ctx.VGroupHeader[0].children.Text, result);
      }

      this.addChildLocation(result.ЭлементыПарсинг, result);

      return result;
    }

    Pages(ctx) {
      let result = {
        Тип: "Страницы",
        // УИД: self.crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
        ТипыСвойств: {},
        Координаты: {},
      };

      ctx.Items.forEach((item) => {
        result.Элементы.push(this.visit(item));
      });

      this.addChildLocation(result.Элементы, result);

      return result;
    }

    Page(ctx) {
      let result = {
        Тип: "Страница",
        // УИД: self.crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
        ЭлементыПарсинг: [],
        ТипыСвойств: {},
        Координаты: {},
      };

      for (const [key, value] of Object.entries(ctx.Properties)) {
        result.НаборСвойств[key.trim()] = value.trim();
      }

      result.НаборСвойств.Заголовок = this.visit(ctx.PageHeader);

      if (ctx.PageHeader.length > 0) {
        this.consumeLocation(ctx.PageHeader[0].children.Slash, result);
        this.consumeLocation(ctx.PageHeader[0].children.Text, result);
      }

      ctx.Items.forEach((item) => {
        result.ЭлементыПарсинг.push(this.visit(item));
      });

      this.addChildLocation(result.ЭлементыПарсинг, result);

      return result;
    }

    OneLineGroup(ctx) {
      let result = {
        Тип: "ОднострочнаяГруппа",
        // УИД: self.crypto.randomUUID(),
        НаборСвойств: {},
        Элементы: [],
        ЭлементыПарсинг: [],
        Координаты: {},
      };

      ctx.Items.forEach((item) => {
        result.ЭлементыПарсинг.push(this.visit(item));
      });

      this.addChildLocation(result.ЭлементыПарсинг, result);

      return result;
    }

    Inline(ctx) {
      let result = {
        Тип: "СтрочныйЭлемент",
        // УИД: self.crypto.randomUUID(),
        НаборСвойств: {},
        ЭлементыПарсинг: [],
        ТипыСвойств: {},
        Координаты: {},
      };

      result.ЭлементыПарсинг = ctx.Items.map((token) => token.image);

      this.consumeLocation(ctx.Items, result);

      return result;
    }

    addChildLocation(childs, result) {
      childs.forEach((item) => {
        for (const [key, value] of Object.entries(item.Координаты)) {
          this.consumeLocationInResult(result, key, value["Лево"], value["Право"]);
        }        
      });
    }

    consumeLocation(tokens, result) {
      tokens.forEach((token) => {
        let rowId = "Строка_" + token.startLine.toString();
        this.consumeLocationInResult(result, rowId, token.startColumn, token.endColumn);
      })
    }

    consumeLocationInResult(result, rowId, startColumn, endColumn) {
      let row = result.Координаты[rowId];
      if (row === undefined) {
        result.Координаты[rowId] = {
          Лево: startColumn,
          Право: endColumn,
        };
      } else if (endColumn > row["Право"]) {
        row["Право"] = endColumn;
      } else {
        row["Лево"] = startColumn;
      }
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

  try {
    let lexingResult = window.lexer.tokenize(input);

    window.groupParser.input = lexingResult.tokens;

    let cst = groupParser.Form();

    const result = window.visitor.visit(cst);

    resultJSON = JSON.stringify(result);
  } catch (e) {
    return "Ошибка " + e.name + ":" + e.message + "\n" + e.stack;
  }
  return resultJSON;
}
