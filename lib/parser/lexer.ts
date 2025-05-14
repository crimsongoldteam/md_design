import { createToken, Lexer, TokenType } from 'chevrotain';

export const InputHeader = createToken({ name: "InputHeader", pattern: Lexer.NA });
export const InputValue = createToken({ name: "InputValue", pattern: Lexer.NA });
export const InputModifiers = createToken({ name: "InputModifiers", pattern: Lexer.NA });

export const CheckboxHeader = createToken({ name: "CheckboxHeader", pattern: Lexer.NA });

export const Button = createToken({ name: "Button", pattern: Lexer.NA });

export const TableCell = createToken({ name: "TableCell", pattern: Lexer.NA });

export const HeaderText = createToken({ name: "HeaderText", pattern: Lexer.NA });

export const PropertiesNameText = createToken({ name: "PropertiesNameText", pattern: Lexer.NA });

export const PropertiesValueText = createToken({ name: "PropertiesValueText", pattern: Lexer.NA });

export const PageGroupHeaderText = createToken({ name: "PageGroupHeaderText", pattern: Lexer.NA });

export const InlineText = createToken({ name: "InlineText", pattern: Lexer.NA });

export const combineTokens = [
  HeaderText,
  InlineText,
  PageGroupHeaderText,
  PropertiesNameText,
  PropertiesValueText,
  InputHeader,
  InputModifiers,
  CheckboxHeader,
  Button,
  TableCell
];


const excludeTokens = (...valuesToExclude: TokenType[]): TokenType[] => {
  return combineTokens.filter(item => !valuesToExclude.includes(item));
}

const keyword = (name: string, keyword: string, ...valuesToExclude: TokenType[]) => {
  return createToken({
    name: name,
    pattern: new RegExp(keyword + '\s*', 'i'),
    label: keyword,
    categories: excludeTokens(...valuesToExclude)
  })
}

// export const CheckboxChecked = createToken({ name: "CheckboxChecked", pattern: /\[\s*\S\s*]\s*/, label: "[X]", categories: excludeTokens(CheckboxHeader) });
// export const CheckboxUnchecked = createToken({ name: "CheckboxUnchecked", pattern: /\[\s*\]\s*/, label: "[ ]", categories: excludeTokens(CheckboxHeader) });

// export const SwitchChecked = createToken({
//   name: "SwitchChecked",
//   pattern: /\[\s*\|\s*\S\s*\]\s*/,
//   label: "[|1]",
//   categories: excludeTokens(CheckboxHeader)
// });

// export const SwitchUnchecked = createToken({
//   name: "SwitchUnchecked",
//   pattern: /\[\s*\S\s*\|\s*\]\s*/,
//   label: "[0|]",
//   categories: excludeTokens(CheckboxHeader)
// });

export const Underscore = keyword("Underscore", "_", InputValue)

export const Dot = keyword("Dot", ".", TableCell)

export const CheckboxChecked = keyword("CheckboxChecked", "\[\s*\S\s*\]", CheckboxHeader);
export const CheckboxUnchecked = keyword("CheckboxUnchecked", "\[\s*\]", CheckboxHeader);
export const SwitchChecked = keyword("SwitchChecked", "\[\s*\|\s*\S\s*\]", CheckboxHeader);
export const SwitchUnchecked = keyword("SwitchUnchecked", "\[\s*\S\s*\|\s*\]", CheckboxHeader);

export const LArrow = keyword("LArrow", "<\-", HeaderText, InlineText, PropertiesValueText);
export const RArrow = keyword("RArrow", "\->", TableCell)

export const LCurly = keyword("LCurly", "\{", HeaderText, InlineText, PropertiesValueText);
export const RCurly = keyword("RCurly", "\}", HeaderText, InlineText, PageGroupHeaderText, InputModifiers);

export const LSquare = keyword("LSquare", "\[", HeaderText, InlineText, PropertiesValueText);
export const RSquare = keyword("RSquare", "\]", HeaderText, InlineText, PropertiesValueText);

export const LAngle = keyword("LAngle", "<", HeaderText, InlineText, PropertiesValueText);
export const RAngle = keyword("RAngle", ">", HeaderText, InlineText, PropertiesValueText);

export const Semicolon = keyword("Semicolon", "\;", HeaderText, InlineText, PageGroupHeaderText, PropertiesValueText);

export const Colon = keyword("Colon", "\:", InputHeader);

export const VBar = keyword("VBar", "\|", HeaderText, PropertiesValueText);

export const Equals = keyword("Equals", "\=", HeaderText, InlineText, PageGroupHeaderText, InputModifiers);

export const Hash = keyword("Hash", "\#", HeaderText);

export const Plus = keyword("Plus", "\+", HeaderText);

export const TripleDash = keyword("TripleDash", "\-\-\-", InlineText, PageGroupHeaderText, PropertiesValueText);

export const Dash = keyword("Dash", "\-", InlineText, PageGroupHeaderText, PropertiesValueText);

export const Slash = keyword("Slash", "\/", HeaderText, PageGroupHeaderText, PropertiesValueText);

export const Ampersand = keyword("Ampersand", "\&", HeaderText, PageGroupHeaderText, PropertiesValueText);


// export const LArrow = createToken({
//   name: "LArrow",
//   pattern: /<-\s*/,
//   label: "<-",
//   categories: [HeaderText, InlineText, PropertiesValueText],
// });

// export const RArrow = symbol("RArrow", "->", TableCell)
// // createToken({
// //   name: "RArrow",
// //   pattern: /->\s*/,
// //   label: "->",
// //   categories: [HeaderText, InlineText, PropertiesValueText],
// // });

// export const LCurly = createToken({
//   name: "LCurly",
//   pattern: /{ */,
//   label: "{",
//   categories: [HeaderText, InlineText, PropertiesValueText],
// });

// export const RCurly = createToken({
//   name: "RCurly",
//   pattern: /} */,
//   label: "}",
//   categories: [HeaderText, InlineText, PageGroupHeaderText, InputModifiers],
// });

// export const LSquare = createToken({
//   name: "LSquare",
//   pattern: /\[ */,
//   label: "[",
//   categories: [HeaderText, InlineText, PropertiesValueText],
// });


// export const RSquare = createToken({
//   name: "RSquare",
//   pattern: /\] */,
//   label: "]",
//   categories: [HeaderText, InlineText, PropertiesValueText],
// });

// export const LAngle = createToken({
//   name: "LAngle",
//   pattern: /<\s*/,
//   label: "<",
//   categories: [HeaderText, InlineText, PropertiesValueText],
// });

// export const RAngle = createToken({
//   name: "LAngle",
//   pattern: />\s*/,
//   label: ">",
//   categories: [HeaderText, InlineText, PropertiesValueText],
// });

// export const Semicolon = createToken({
//   name: "Semicolon",
//   pattern: /\; */,
//   label: ";",
//   categories: [
//     HeaderText,
//     InlineText,
//     PageGroupHeaderText,
//     PropertiesValueText,
//   ],
// });

// export const Colon = createToken({
//   name: "Colon",
//   pattern: /\: */,
//   label: ":",
//   categories: excludeTokens(InputHeader),
// });

// export const VBar = createToken({
//   name: "VBar",
//   pattern: /\|\s*/,
//   label: "|",
//   categories: [HeaderText, PropertiesValueText],
// });

// const Comma = createToken({
//   name: "Comma",
//   pattern: /\,/,
//   label: ",",
//   categories: [Header, InlineText],
// });
// export const Equals = createToken({
//   name: "Equals",
//   pattern: /\=[ \t]*/,
//   label: "=",
//   categories: [HeaderText, InlineText, PageGroupHeaderText, InputModifiers],
// });
// export const Hash = createToken({
//   name: "Hash",
//   pattern: /\#+[ \t]*/,
//   label: "#",
//   categories: [HeaderText],
// });
// export const Plus = createToken({
//   name: "Plus",
//   pattern: /\+ */,
//   label: "+",
//   categories: [HeaderText],
// });
// export const TripleDash = createToken({
//   name: "TripleDash",
//   pattern: /---[ \t]*/,
//   label: "---",
//   categories: [InlineText, PageGroupHeaderText, PropertiesValueText],
// });

// export const Dash = createToken({
//   name: "Dash",
//   pattern: /-[ \t]*/,
//   label: "-",
//   categories: [InlineText, PageGroupHeaderText, PropertiesValueText],
//   longer_alt: TripleDash,
// });

// export const Slash = createToken({
//   name: "Slash",
//   pattern: /\/[ \t]*/,
//   label: "/",
//   categories: [HeaderText, PageGroupHeaderText, PropertiesValueText],
// });
// export const Ampersand = createToken({
//   name: "Ampersand",
//   pattern: /\&[ \t]*/,
//   label: "&",
//   categories: [HeaderText, PageGroupHeaderText, PropertiesValueText],
// });
export const Tab = createToken({ name: "Tab", pattern: /\t/ });

export const Text = createToken({
  name: "Text",
  pattern: /[a-zA-Zа-яА-ЯёЁ№!%0-9][a-zA-Zа-яА-ЯёЁ№!%0-9\s]*/,
  categories: [
    HeaderText,
    InlineText,
    PageGroupHeaderText,
    PropertiesNameText,
    PropertiesValueText,
    InputHeader,
    InputValue,
    InputModifiers,
    CheckboxHeader,
    Button,
    TableCell
  ],
});

export const NewLine = createToken({
  name: "NewLine",
  pattern: /\n/,
  line_breaks: true,
  group: Lexer.SKIPPED,
});

export const Whitespace = createToken({
  name: "Whitespace",
  pattern: /s+/,
  group: Lexer.SKIPPED,
});

export const allTokens = [
  Underscore,
  Whitespace,
  SwitchChecked,
  SwitchUnchecked,
  CheckboxChecked,
  CheckboxUnchecked,
  LArrow,
  RArrow,
  Dot,
  Dash,
  TripleDash,
  Text,
  NewLine,
  VBar,
  LCurly,
  RCurly,
  LAngle,
  RAngle,
  Semicolon,
  Colon,
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
  PropertiesValueText,
  InputHeader,
  InlineText,
  InputModifiers,
  CheckboxHeader,
  Button,
  TableCell
];


export const lexer = new Lexer(allTokens);
