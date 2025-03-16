(function jsonGrammarOnlyExample() {
    // ----------------- Lexer -----------------
    const createToken = chevrotain.createToken;
    const Lexer = chevrotain.Lexer;
    const CstParser = chevrotain.CstParser;
  
    const Hash = createToken({ name: 'Hash', pattern: /#/ });
    const Plus = createToken({ name: 'Plus', pattern: /\+/ });
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
    
    
    const allTokens = [Whitespace, Hash, Text, Newline, Plus];
    
    
    const MD_Lexer = new Lexer(allTokens, {
      // Less position info tracked, reduces verbosity of the playground output.
      positionTracking: "onlyStart",
    });
    
    
  class MD_Parser extends CstParser {
    constructor() {
      super(allTokens);
      const $ = this;
  
      // Правила грамматики
      $.RULE('Document', () => {
        $.MANY(() => {
          $.SUBRULE($.Group);
        });
      });
  
      $.RULE('Group', () => {
        $.SUBRULE($.Header);
        $.SUBRULE($.GroupLines);
      });
  
      $.RULE('Header', () => {
        $.AT_LEAST_ONE(() => {
          $.CONSUME(Hash);
          $.CONSUME(Text);
        });
        $.CONSUME(Newline);
      });
  
      $.RULE('GroupLines', () => {
        $.AT_LEAST_ONE(() => {
          $.OR([
            { ALT: () => $.SUBRULE($.Header)},
            { ALT: () => $.SUBRULE($.GroupLine)}
          ]);
          $.CONSUME(Newline);
        });
      });
  
      $.RULE('GroupLine', () => {
        $.MANY(() => {
          $.CONSUME(Plus);
          $.CONSUME(Text);
        });
      });
  
      this.performSelfAnalysis();
    }
  }
  
    // for the playground to work the returned object must contain these fields
    return {
      lexer: MD_Lexer,
      parser: MD_Parser,
      defaultRule: 'Document'
    };
  }())