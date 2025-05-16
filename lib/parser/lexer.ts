import { createToken, Lexer, TokenType } from 'chevrotain';

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape all special characters
}

export const InputHeader = createToken({ name: "InputHeader", pattern: Lexer.NA });

export const InlineText = createToken({ name: "InlineText", pattern: Lexer.NA });

export const InputValue = createToken({ name: "InputValue", pattern: Lexer.NA });
export const InputModifiers = createToken({ name: "InputModifiers", pattern: Lexer.NA });

export const CheckboxHeader = createToken({ name: "CheckboxHeader", pattern: Lexer.NA });

export const Button = createToken({ name: "Button", pattern: Lexer.NA });

export const TableCell = createToken({ name: "TableCell", pattern: Lexer.NA });

export const FormHeaderText = createToken({ name: "HeaderText", pattern: Lexer.NA });

export const PropertiesNameText = createToken({ name: "PropertiesNameText", pattern: Lexer.NA });

export const PropertiesValueText = createToken({ name: "PropertiesValueText", pattern: Lexer.NA });

export const GroupHeaderText = createToken({ name: "GroupHeaderText", pattern: Lexer.NA });
export const PageHeaderText = createToken({ name: "PageHeaderText", pattern: Lexer.NA });

export const combineTokens = [
  InlineText,
  FormHeaderText,
  PageHeaderText,
  GroupHeaderText,
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
  const keywordEscaped = escapeRegExp(keyword)
  return createToken({
    name: name,
    pattern: new RegExp(keywordEscaped + '[ \\t]*'),
    label: keyword,
    categories: excludeTokens(...valuesToExclude)
  })
}

export const CheckboxChecked = createToken({ name: "CheckboxChecked", pattern: /\[[ \t]*\S[ \t]*\][ \t]*/, label: "[X]", categories: excludeTokens(CheckboxHeader) });
export const CheckboxUnchecked = createToken({ name: "CheckboxUnchecked", pattern: /\[[ \t]*\][ \t]*/, label: "[ ]", categories: excludeTokens(CheckboxHeader) });

export const SwitchChecked = createToken({
  name: "SwitchChecked",
  pattern: /\[[ \t]*\|[ \t]*\S\[ \t]\][ \t]/,
  label: "[|1]",
  categories: excludeTokens(CheckboxHeader)
});

export const SwitchUnchecked = createToken({
  name: "SwitchUnchecked",
  pattern: /\[[ \t]*\S[ \t]*\|[ \t]*\][ \t]*/,
  label: "[0|]",
  categories: excludeTokens(CheckboxHeader)
});

// export const CheckboxChecked = keyword("CheckboxChecked", "\[\s*\S\s*\]", CheckboxHeader);
// export const CheckboxUnchecked = keyword("CheckboxUnchecked", "\[\s*\]", CheckboxHeader);
// export const SwitchChecked = keyword("SwitchChecked", "\[\s*\|\s*\S\s*\]", CheckboxHeader);
// export const SwitchUnchecked = keyword("SwitchUnchecked", "\[\s*\S\s*\|\s*\]", CheckboxHeader);

export const Underscore = keyword("Underscore", "_", InputValue)

export const Dot = keyword("Dot", ".", TableCell)

export const LArrow = keyword("LArrow", "<-");
export const RArrow = keyword("RArrow", "->")

export const LCurly = keyword("LCurly", "{", PropertiesValueText, GroupHeaderText, PageHeaderText);
export const RCurly = keyword("RCurly", "}", InputModifiers);

export const LSquare = keyword("LSquare", "[", CheckboxHeader);
export const RSquare = keyword("RSquare", "]", CheckboxHeader);

export const LAngle = keyword("LAngle", "<");
export const RAngle = keyword("RAngle", ">");

export const Semicolon = keyword("Semicolon", ";");

export const Colon = keyword("Colon", ":", InputHeader);

export const VBar = keyword("VBar", "|");

export const Equals = keyword("Equals", "=");

export const Hash = keyword("Hash", "#", GroupHeaderText, PageHeaderText, InlineText);

export const Plus = keyword("Plus", "+", GroupHeaderText, PageHeaderText, InlineText);

export const TripleDash = keyword("TripleDash", "---", FormHeaderText);

export const Dash = keyword("Dash", "-");

export const Slash = keyword("Slash", "/", GroupHeaderText, PageHeaderText, InlineText);

export const Ampersand = keyword("Ampersand", "&", InlineText);

export const Whitespace = createToken({ name: "Tab", pattern: /[ \t]+/ });

export const Text = createToken({
  name: "Text",
  pattern: /[a-zA-Zа-яА-ЯёЁ№!%0-9][a-zA-Zа-яА-ЯёЁ№!%0-9\t ]*/,
  categories: combineTokens,
});

export const NewLine = createToken({
  name: "NewLine",
  pattern: /\n/,
  line_breaks: true,
  // group: Lexer.SKIPPED,
});

// our custom matcher
function matchType(text: any, offset: any, matchedTokens: any, groups: any) : RegExpExecArray | null {
  return null;
}
export const LabelFieldType = createToken({ name: "LabelFieldType", pattern: matchType });
export const CheckboxRightFieldType = createToken({ name: "CheckboxRightFieldType", pattern: matchType });
export const CheckboxLeftFieldType = createToken({ name: "CheckboxLeftFieldType", pattern: matchType });
export const InputFieldType = createToken({ name: "InputFieldType", pattern: matchType });
export const TableType = createToken({ name: "TableType", pattern: matchType });
export const CommandBarType = createToken({ name: "CommandBarType", pattern: matchType });

// export const LabelFieldType = createToken({ name: "LabelFieldType", pattern: matchType });
// export const CheckboxRightFieldType = createToken({ name: "CheckboxRightFieldType", pattern: matchType });
// export const CheckboxLeftFieldType = createToken({ name: "CheckboxLeftFieldType", pattern: matchType });
// export const InputFieldType = createToken({ name: "InputFieldType", pattern: matchType });
// export const TableType = createToken({ name: "TableType", pattern: matchType });
// export const CommandBarType = createToken({ name: "CommandBarType", pattern: matchType });

export const inlineTypesTokens = [
  LabelFieldType,
  CheckboxRightFieldType,
  CheckboxLeftFieldType,
  InputFieldType,
  TableType,
  CommandBarType
];

export const allTokens = [
  NewLine,
  Underscore,
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
  Whitespace,
  ...combineTokens,
  ...inlineTypesTokens
];


export const lexer = new Lexer(allTokens);
