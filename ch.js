(function MDDesignParsing() {
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

  const Slash = createToken({ name: "Slash", pattern: /\//, label: "/" });
  const Tab = createToken({ name: "Tab", pattern: /\t/ });
  const Text = createToken({ name: "Text", pattern: /[^#+\n\r\t\/]+/ });
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
    Hash,
    NewLine,
    Plus,
    Slash,
    Tab,
    Text,
  ];

  const lexer = new Lexer(allTokens);

  class LineParser extends CstParser {
    constructor() {
      super(allTokens);
      const $ = this;

      $.RULE("InlineStatement", () => {
        $.MANY(() => {
          $.SUBRULE($.Input);
        });
      });

      $.RULE("Input", () => {
        $.MANY(() => {
          $.CONSUME(Text);
        });
      });

      this.performSelfAnalysis();
    }
  }

  const lineParser = new LineParser();

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

      // Обычный элемент
      this.setParent(item, parent);
      this.currentGroups.push(parent);
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
  }

  class GroupParser extends EmbeddedActionsParser {
    constructor() {
      super(allTokens);
      const $ = this;

      $.RULE("Form", () => {
        let result = {
          name: "Form",
          children: { Items: [] },
        };

        let group_stock = new GroupStock(result);

        $.MANY(() => {
          $.OR([
            {
              ALT: () => {
                $.CONSUME(EmptyLine);
                if (!$.RECORDING_PHASE) {
                  // group_stock.processEmptyLine();
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

      // #Заголовок 1
      $.RULE("VGroupHeader", () => {
        let result = {
          name: "VGroupHeader",
          children: { Hash: [], Text: [] },
        };

        result.children.Hash.push($.CONSUME(Hash).image);
        result.children.Text.push($.CONSUME(Text).image);

        return result;
      });

      // /Заголовок страницы
      $.RULE("PageHeader", () => {
        let result = {
          name: "PageHeader",
          children: { Slash: [], Text: [] },
        };

        result.children.Slash.push($.CONSUME(Slash).image);
        result.children.Text.push($.CONSUME(Text).image);

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
                  let item = this.CONSUME(Text);
                  if (!$.RECORDING_PHASE) {
                    group_stock.add(item, indent);
                  }
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

  // const groupParser = new GroupParser();

  // const BaseLineVisitor = lineParser.getBaseCstVisitorConstructor();

  // const BaseGroupVisitor = groupParser.getBaseCstVisitorConstructor();

  // class GroupVisitor extends BaseGroupVisitor {
  //   constructor() {
  //     super();
  //     // This helper will detect any missing or redundant methods on this visitor
  //     this.validateVisitor();
  //   }
  // }

  // class LineVisitor extends BaseLineVisitor {
  //   constructor() {
  //     super();
  //     this.validateVisitor();
  //   }
  // }

  // for the playground to work the returned object must contain these fields
  return {
    lexer: lexer,
    parser: GroupParser,
    defaultRule: "Form",
  };
})();
