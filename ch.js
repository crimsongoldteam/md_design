(function MDDesignParsing() {

  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;
  const CstParser = chevrotain.CstParser;
  const EmbeddedActionsParser = chevrotain.EmbeddedActionsParser;

  const Hash = createToken({ name: 'Hash', pattern: /#/, label: '#' });
  const Plus = createToken({ name: 'Plus', pattern: /\+/, label: '+' });

  const Slash = createToken({ name: 'Slash', pattern: /\// });
  const Text = createToken({ name: 'Text', pattern: /[^#+:\n]+/ });
  const Newline = createToken({
    name: 'Newline',
    pattern: /\n/,
    line_breaks: true,
  });
  const Whitespace = createToken({
    name: 'Whitespace',
    pattern: /[ \t]+/,
    group: chevrotain.Lexer.SKIPPED,
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


  class GroupParser extends EmbeddedActionsParser {
    constructor() {
      super(allTokens);
      const $ = this;

      $.RULE('Form', () => {
        let result = [];
        $.MANY(() => {
          result.push($.SUBRULE($.HGroup));
        });
        return result;
      });

      $.RULE('HGroup', () => {
        let result = [];
        let groups = [];

        $.AT_LEAST_ONE(() => {

          let header = $.SUBRULE($.VGroup);

          result.push(header);
          //header.children.VGroupLineItem = [];
          //groups.push(header);
        });

        $.MANY(() => {
          result.push($.SUBRULE($.VGroupLine, { ARGS: [groups] }));
          $.CONSUME(Newline);
        });
        
        lineParser.input = result;
        return lineParser.InlineStatement();
      });

      $.RULE('VGroup', (groups) => {
        return $.SUBRULE($.VGroupHeaderItem, groups);
      });

      $.RULE('VGroupHeaderItem', () => {
        $.CONSUME(Hash);
        return $.CONSUME(Text);
      });

      $.RULE('VGroupLine', (groups) => {
        let result = [];
        let index = 0;
        $.MANY(() => {
          let newItem = $.SUBRULE($.VGroupLineItem);
          result.push(newItem);
          //          if (groups !== undefined) {
          //            groups[index].children.VGroupLineItem.push(newItem);
          //            index++;
          //};
        });
        return result;
      });


      $.RULE('VGroupLineItem', () => {
        $.CONSUME(Plus);
        return $.CONSUME(Text);
      });


      $.RULE('Pages', () => { });
      $.RULE('Page', () => { });

      $.RULE('OneLineGroup', () => { });

      this.performSelfAnalysis();
    }
  }

  // for the playground to work the returned object must contain these fields
  return {
    lexer: lexer,
    parser: GroupParser,
    defaultRule: 'Form'
  };
}())