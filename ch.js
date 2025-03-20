(function MDDesignParsing() {

  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;
  const CstParser = chevrotain.CstParser;
  const EmbeddedActionsParser = chevrotain.EmbeddedActionsParser;

  const Hash = createToken({ name: 'Hash', pattern: /#/, label: '#' });
  const Plus = createToken({ name: 'Plus', pattern: /\+/, label: '+' });

  const Slash = createToken({ name: 'Slash', pattern: /\// });
  const Text = createToken({ name: 'Text', pattern: /[^#+\n\r]+/ });
  const Newline = createToken({
    name: 'Newline',
    pattern: /\n\r|\r|\n/,
    line_breaks: true,
  });
  const Whitespace = createToken({
    name: 'Whitespace',
    pattern: /s+/,
    group_stock: chevrotain.Lexer.SKIPPED,
  });


  const allTokens = [Whitespace, Hash, Newline, Plus, Slash, Text];

  const lexer = new chevrotain.Lexer(allTokens);

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


  class GroupStock {
    constructor(groups) {
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

    addToCurrentGroup(item) {
      const group = this.getOrNewAtIndex();
      this.currentGroups.push(group);
      group.children.Lines.push(item);
    }

    addSubGroup(header) {
      const parent = this.getOrNewAtIndex();
      const group = this.getNewGroup();
      group.children.VGroupHeader.push(header);
      parent.children.Lines.push(group);
      this.currentGroups.push(group);
    }

    addGroup(header) {
      const group = this.getNewGroup();
      group.children.VGroupHeader.push(header);
      this.prevGroups.push(group);
      this.groups.push(group);
    }

    addPage(header) {
      const parent = this.getOrNewAtIndex();
      const page = this.getNewPage();
      page.children.PageHeader.push(header);
      parent.children.Lines.push(page);
      this.currentGroups.push(page);
    }

    getAtIndex() {
      return this.prevGroups[this.index];
    }

    getOrNewAtIndex() {
      if (this.index > this.prevGroups.length - 1) {
        const newGroup = this.getNewGroup();
        this.prevGroups.push(newGroup);
        this.groups.push(newGroup);
        return newGroup;
      }
      return this.getAtIndex();
    }

    getNewGroup() {
      const group = {
        name: 'VGroup',
        children: { VGroupHeader: [], Lines: [] },
      };
      return group;
    }

    getNewPage() {
      const page = {
        name: 'Page',
        children: { PageHeader: [], Lines: [] },
      };
      return page;
    }

  }

  class GroupParser extends EmbeddedActionsParser {
    constructor() {
      super(allTokens);
      const $ = this;

      $.RULE('Form', () => {
        let result = {
          name: 'Form',
          children: { HGroup: [] },
        };

        $.MANY(() => {
          result.children.HGroup.push($.SUBRULE($.HGroup));
        });
        return result;
      });
      
      $.RULE('HGroup', () => {
        let result = {
          name: 'HGroup',
          children: { VGroup: [] },
        };

        let group_stock = new GroupStock(result.children.VGroup);
        
        // #Заголовок 1 #Заголовок 2
        $.AT_LEAST_ONE(() => {

          let header = $.SUBRULE($.VGroupHeader);

          group_stock.addGroup(header);
        });
        
      	$.CONSUME(Newline);

        
        // Элемент 1 + Элемент 2
        $.MANY(() => {
          $.SUBRULE($.Line, { ARGS: [group_stock] });
        });

        //        lineParser.input = result;
        //      let res = lineParser.InlineStatement();

        return result;
      });

      // #Заголовок 1
      $.RULE('VGroupHeader', () => {
        let result = {
          name: 'VGroupHeader',
          children: { Hash: [], Text: [] },
        };

        result.children.Hash.push($.CONSUME(Hash));
        result.children.Text.push($.CONSUME(Text));

        return result; 
      });

      $.RULE('Line', (group_stock) => { 
        $.MANY_SEP({
          SEP: Plus,
          DEF: () => {
 
            $.OR([
              {
                // #Подзаголовок 1 #Подзаголовок 2
                ALT: () => {
                  $.AT_LEAST_ONE(() => {  
                    debugger;
                    let header = $.SUBRULE($.VGroupHeader);
          
                    if (!$.RECORDING_PHASE) {
                      group_stock.addSubGroup(header);
                    }; 
                  });
                }
              },
              // /Страница
              {
                ALT: () => {
                  this.CONSUME(Slash);

                  if (!$.RECORDING_PHASE) {
                    group_stock.addToCurrentGroup(item);
                  };
                }
              },              
              // Строчный элемент
              {
                ALT: () => {
                  let item = this.CONSUME(Text);
                  if (!$.RECORDING_PHASE) {
                    group_stock.addToCurrentGroup(item);
                  };
                }
              },
            ])

            if (!$.RECORDING_PHASE) {
              group_stock.next(); 
            };
          },
        })
        
        $.CONSUME(Newline);
        
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


