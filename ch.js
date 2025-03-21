(function MDDesignParsing() {

  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;
  const CstParser = chevrotain.CstParser;
  const EmbeddedActionsParser = chevrotain.EmbeddedActionsParser;

  const Hash = createToken({ name: 'Hash', pattern: /#/, label: '#' });
  const Plus = createToken({ name: 'Plus', pattern: /\+/, label: '+' });

  const Slash = createToken({ name: 'Slash', pattern: /\// });
  const Tab = createToken({ name: 'Tab', pattern: /\t/ });
  const Text = createToken({ name: 'Text', pattern: /[^#+\n\r\t\/]+/ });
  const NewLine = createToken({
    name: 'Newline',
    pattern: /\n\r|\r|\n/,
    line_breaks: true,
  });
  const Whitespace = createToken({
    name: 'Whitespace',
    pattern: /s+/,
    group_stock: chevrotain.Lexer.SKIPPED,
  });


  const allTokens = [Whitespace, Hash, NewLine, Plus, Slash, Tab, Text];

  const lexer = new Lexer(allTokens);

  class LineParser extends CstParser {
    constructor() {
      super(allTokens);
      const $ = this;

      $.RULE('InlineStatement', () => {
        $.MANY(() => {
          $.SUBRULE($.Input);
        });
      });

      $.RULE('Input', () => {
        $.MANY(() => {
          $.CONSUME(Text);
        });
      });

      this.performSelfAnalysis();
    }
  };


  const lineParser = new LineParser();

  class GroupStockItem {
    constructor(form) {
      this.form = form;
      this.parents = {};
      this.indents = [this.form];
    }

    add(item, indent) {
      let parent = null;
      if (indent > this.indents.length - 1) {
        parent = this.indents[this.indents.length - 1];
      }
      else {
        parent = this.indents[indent];
      }

      // Если это страница
      if (item.name == "PageHeader") {
        // Если это первая страница - создаем группу
        if (parent.name != "Pages") {
          const pages = this.getNewPages();
          parent.children.Items.push(pages);
          this.setAtIndent(pages, indent, true);
          parent = pages;
        };

        const page = this.getNewPage(item);
        this.setAtIndent(page, indent + 1, true);
        return page;
      }

      //Если текущий элемент на этом уровне - страницы, значит они закончились и обращаемся к их родителю
      if (parent.name == "Pages") {
        parent = this.getParent(parent);
        this.setAtIndent(parent, indent, true);
      }

      if (item.name == "VGroupHeader") {
        const group = this.getNewGroup(item);
        this.setAtIndent(group, indent, true);
        return group;
      };

      this.setAtIndent(item, indent, false);

      return item;
    }

    getParent(item) {
      const parent = this.parents[item];
      if (parent === undefined) {
        return this.form;
      }
      return parent;
    }

    setAtIndent(item, indent, add) {
      let parent = this.indents[indent];
      if (add) {
        if (indent > this.indents.length - 1) {
          this.indents.push(item);
        }
        else {
          this.indents[indent] = item;
        }
      }
      this.indents.length = indent + 1; // Обрезаем нижестоящие
      this.parents[item] = parent;
      parent.children.Items.push(item);
    }

    getNewGroup(header) { 
      const group = {
        name: 'VGroup',
        children: { VGroupHeader: [], Items: [] },
      };

      if (header !== undefined) {
        group.children.VGroupHeader.push(header);
      };

      return group;
    }

    getNewPage(header) {
      const page = {
        name: 'Page',
        children: { PageHeader: [header], Items: [] },
      };
      return page;
    }

    getNewPages() {
      const page = {
        name: 'Pages',
        children: { Items: [] }
      };
      return page;
    }
  }


  class GroupStock {
    constructor(form, groups) {
      this.form = form;
      this.groups = groups;
      this.prevGroups = [];
      this.currentGroups = [];
      this.index = 0;
    }

    next() {
      this.index++;
    }

    doneLine() {
      this.prevGroups = this.currentGroups;
      this.index = 0;
    }

    addToCurrentGroup(item, indent) { 
      const group = this.getOrNewAtIndex();
      group.add(item, indent);
      this.currentGroups.push(group);
    }
 
    addSubGroup(header, indent) {
      debugger; 
      const parent = this.getOrNewAtIndex();
      parent.add(header, indent);
      this.currentGroups.push(parent);
    }

    addPage(header, indent) {
      const parent = this.getOrNewAtIndex();
      parent.add(header, indent);
      this.currentGroups.push(parent);      
    }

    addGroup(header) {
      const groupStockItem = new GroupStockItem(this.form);
      const group = groupStockItem.add(header, 0);
      this.prevGroups.push(groupStockItem);
    }

    getOrNewAtIndex() {
      if (this.index > this.prevGroups.length - 1) {
        return new GroupStockItem(this.form);
      }
      return this.prevGroups[this.index];
    }
  }

  class GroupParser extends EmbeddedActionsParser {
    constructor() {
      super(allTokens);
      const $ = this;

      $.RULE('Form', () => {
        let result = {
          name: 'Form',
          children: { Items: [] }, 
        };

        $.MANY(() => {
          result.children.Items.push($.SUBRULE($.HGroup));
        });
        return result;
      });

      $.RULE('HGroup', () => {
        let result = {
          name: 'HGroup',
          children: { Items: [] }, 
        };

        let group_stock = new GroupStock(result, result.children.Items);

        // #Заголовок 1 #Заголовок 2
        $.AT_LEAST_ONE(() => {

          let header = $.SUBRULE($.VGroupHeader);

          if (!$.RECORDING_PHASE) {
            group_stock.addGroup(header);
          };
        });

        $.CONSUME(NewLine);

        // Элемент 1 + Элемент 2
        $.MANY(() => {
          $.SUBRULE($.Line, { ARGS: [group_stock] });
        });

            //lineParser.input = result;
             //let res = lineParser.InlineStatement();

        return result;
      });

      // #Заголовок 1
      $.RULE('VGroupHeader', () => {
        let result = {
          name: 'VGroupHeader',
          children: { Hash: [], Text: [] },
        };

        result.children.Hash.push($.CONSUME(Hash).image);
        result.children.Text.push($.CONSUME(Text).image);

        return result;
      });

      $.RULE('Line', (group_stock) => {

        $.MANY_SEP({
          SEP: Plus,
          DEF: () => {
            let indent = 0;
            $.MANY(() => {  
              
              let resTab = $.CONSUME(Tab);
              if (!$.RECORDING_PHASE) { 
              	indent++;
              };  
            });
 
            $.OR([
              {
                // #Подзаголовок 1 #Подзаголовок 2
                ALT: () => {
                  $.AT_LEAST_ONE(() => {
                    // debugger;
                    let header = $.SUBRULE($.VGroupHeader);

                    if (!$.RECORDING_PHASE) {
                      group_stock.addSubGroup(header, indent);
                    };
                  });

                }
              },
              // /Страница
              // {
              //   ALT: () => {
              //     this.CONSUME(Slash);

              //     let header = $.CONSUME1(Text);

              //     if (!$.RECORDING_PHASE) {
              //       group_stock.addPage(header, indent);
              //       group_stock.next();
              //     };
              //   }
              // },
              // Строчный элемент  
              {
                ALT: () => {
                  let item = this.CONSUME2(Text);
                  if (!$.RECORDING_PHASE) {
                    group_stock.addToCurrentGroup(item, indent);
                  };
                }
              },
            ])

            if (!$.RECORDING_PHASE) {
              group_stock.next();
            };            
          },
        })
      
        $.CONSUME(NewLine);

        if (!$.RECORDING_PHASE) {
          group_stock.doneLine();
        };


      });




      $.RULE('Pages', () => { });
      $.RULE('Page', () => { });

      $.RULE('OneLineGroup', () => { });

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
    defaultRule: 'Form'
  };
}())


