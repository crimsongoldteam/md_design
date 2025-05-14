import { InlineParser } from './parser/inline-parser'
import { lexer } from './parser/lexer'

function parseInputInner(input: string) {
    const lexingResult = lexer.tokenize(input);

    const parser = new InlineParser()
    parser.input = lexingResult.tokens;

    const result = parser.detect(parser.input);
    return result;
}

declare global {
    interface Window  {
        parseInputInner: Object;
    }
}

window.parseInputInner = parseInputInner;
