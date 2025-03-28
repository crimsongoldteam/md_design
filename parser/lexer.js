import {createToken, Lexer} from './chevrotain.js';

export const HeaderText = createToken({
  name: "HeaderText",
  pattern: Lexer.NA,
});

export const PropertiesNameText = createToken({
  name: "PropertiesNameText",
  pattern: Lexer.NA,
});

export const PropertiesValueText = createToken({
  name: "PropertiesValueText",
  pattern: Lexer.NA,
});

export const PageGroupHeaderText = createToken({
  name: "PageGroupHeaderText",
  pattern: Lexer.NA,
});

export const InlineText = createToken({
  name: "InlineText",
  pattern: Lexer.NA,
});

export const LCurly = createToken({
  name: "LCurly",
  pattern: /{ */,
  label: "{",
  categories: [HeaderText, InlineText, PropertiesValueText],
});
export const RCurly = createToken({
  name: "RCurly",
  pattern: /} */,
  label: "}",
  categories: [HeaderText, InlineText, PageGroupHeaderText],
});
export const Semicolon = createToken({
  name: "Semicolon",
  pattern: /\; */,
  label: ";",
  categories: [
    HeaderText,
    InlineText,
    PageGroupHeaderText,
    PropertiesValueText,
  ],
});
// const Comma = createToken({
//   name: "Comma",
//   pattern: /\,/,
//   label: ",",
//   categories: [Header, InlineText],
// });
export const Equals = createToken({
  name: "Equals",
  pattern: /\= */,
  label: "=",
  categories: [HeaderText, InlineText, PageGroupHeaderText],
});
export const Hash = createToken({
  name: "Hash",
  pattern: /# */,
  label: "#",
  categories: [HeaderText],
});
export const Plus = createToken({
  name: "Plus",
  pattern: /\+ */,
  label: "+",
  categories: [HeaderText],
});
export const TripleDash = createToken({
  name: "TripleDash",
  pattern: /---[ \t]*/,
  label: "---",
  categories: [InlineText, PageGroupHeaderText, PropertiesValueText],
});

export const Dash = createToken({
  name: "Dash",
  pattern: /-[ \t]*/,
  label: "-",
  categories: [InlineText, PageGroupHeaderText, PropertiesValueText],
  longer_alt: TripleDash,
});

export const Slash = createToken({
  name: "Slash",
  pattern: /\/ */,
  label: "/",
  categories: [HeaderText, PageGroupHeaderText, PropertiesValueText],
});
export const Ampersand = createToken({
  name: "Ampersand",
  pattern: /\& */,
  label: "&",
  categories: [HeaderText, PageGroupHeaderText, PropertiesValueText],
});
export const Tab = createToken({ name: "Tab", pattern: /\t/ });

export const Text = createToken({
  name: "Text",
  pattern: /[^\{\}\=\;\&\#\+\n\r\t\/\- ][^\{\}\=\;\&\#\+\n\r\t\-]*/,
  categories: [
    HeaderText,
    InlineText,
    PageGroupHeaderText,
    PropertiesNameText,
    PropertiesValueText,
  ],
});

export const NewLine = createToken({
  name: "NewLine",
  pattern: /\n/,
  line_breaks: true,
  group_stock: Lexer.SKIPPED,
});

export const Whitespace = createToken({
  name: "Whitespace",
  pattern: /s+/,
  group_stock: Lexer.SKIPPED,
});

export const allTokens = [
  Whitespace,
  Dash,
  TripleDash,
  Text,
  NewLine,
  LCurly,
  RCurly,
  Semicolon,
  Equals,
  Hash,
  Ampersand,
  Plus,
  Slash,
  Tab,
  HeaderText,
  InlineText,
  PageGroupHeaderText,
  PropertiesNameText,
  PropertiesValueText
];

export const lexer = new Lexer(allTokens);