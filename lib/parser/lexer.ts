import { createToken, Lexer, TokenType } from "chevrotain"

// #region combineTokens

export const GroupHeaderText = createToken({
  name: "GroupHeaderText",
  pattern: Lexer.NA,
})
export const PageHeaderText = createToken({
  name: "PageHeaderText",
  pattern: Lexer.NA,
})
export const InlineText = createToken({
  name: "InlineText",
  pattern: Lexer.NA,
})

export const LabelContent = createToken({
  name: "LabelContent",
  pattern: Lexer.NA,
})

export const InputHeader = createToken({
  name: "InputHeader",
  pattern: Lexer.NA,
})
export const InputValue = createToken({
  name: "InputValue",
  pattern: Lexer.NA,
})
export const InputModifiers = createToken({
  name: "InputModifiers",
  pattern: Lexer.NA,
})

export const CheckboxHeader = createToken({
  name: "CheckboxHeader",
  pattern: Lexer.NA,
})

export const Button = createToken({ name: "Button", pattern: Lexer.NA })

export const TableCell = createToken({ name: "TableCell", pattern: Lexer.NA })
export const TableCellContinue = createToken({ name: "TableCellContinue", pattern: Lexer.NA })

export const FormHeaderText = createToken({
  name: "HeaderText",
  pattern: Lexer.NA,
})

export const PropertiesNameText = createToken({
  name: "PropertiesNameText",
  pattern: Lexer.NA,
})

export const PropertiesValueText = createToken({
  name: "PropertiesValueText",
  pattern: Lexer.NA,
})

export const PropertiesValueOptionText = createToken({
  name: "PropertiesValueOptionText",
  pattern: Lexer.NA,
})

export const combineTokens = [
  InlineText,
  FormHeaderText,
  PageHeaderText,
  GroupHeaderText,
  PropertiesNameText,
  PropertiesValueText,
  PropertiesValueOptionText,
  LabelContent,
  InputHeader,
  InputValue,
  InputModifiers,
  CheckboxHeader,
  Button,
  TableCell,
  TableCellContinue,
]

// #endregion

// #region utils

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // Escape all special characters
}

// empty matcher
// @ts-ignore
function matchType(text: any, offset: any, matchedTokens: any, groups: any): RegExpExecArray | null {
  return null
}

const excludeTokens = (...valuesToExclude: TokenType[]): TokenType[] => {
  return combineTokens.filter((item) => !valuesToExclude.includes(item))
}

const keyword = (name: string, keyword: string, ...valuesToExclude: TokenType[]) => {
  const keywordEscaped = escapeRegExp(keyword)
  return createToken({
    name: name,
    pattern: new RegExp(keywordEscaped + "[ \\t]*"),
    label: keyword,
    categories: excludeTokens(...valuesToExclude),
  })
}

// #endregion

// #region keywords

export const CheckboxChecked = createToken({
  name: "CheckboxChecked",
  pattern: /\[[ \t]*\S[ \t]*\][ \t]*/,
  label: "[X]",
  categories: excludeTokens(CheckboxHeader),
})
export const CheckboxUnchecked = createToken({
  name: "CheckboxUnchecked",
  pattern: /\[[ \t]*\][ \t]*/,
  label: "[ ]",
  categories: excludeTokens(CheckboxHeader),
})

export const SwitchChecked = createToken({
  name: "SwitchChecked",
  pattern: /\[[ \t]*\|[ \t]*\S[ \t]*\][ \t]/,
  label: "[|1]",
  categories: excludeTokens(CheckboxHeader),
})

export const SwitchUnchecked = createToken({
  name: "SwitchUnchecked",
  pattern: /\[[ \t]*\S[ \t]*\|[ \t]*\][ \t]*/,
  label: "[0|]",
  categories: excludeTokens(CheckboxHeader),
})

export const DoubleUnderscore = keyword("DoubleUnderscore", "__", InputValue)

export const Picture = createToken({
  name: "Picture",
  pattern: /@[a-zA-Zа-яА-ЯёЁ0-9]*[ \t]*/,
  label: "@Picture",
  categories: excludeTokens(Button),
})

export const Dots = createToken({
  name: "Dots",
  pattern: /\.+[ \t]*/,
  label: "...",
  categories: excludeTokens(TableCell),
})

export const ButtonGroup = createToken({
  name: "ButtonGroup",
  pattern: /\|[ \t]*-[ \t]*\|[ \t]*/,
  label: "|-|",
  categories: excludeTokens(Button),
})

export const LArrow = keyword("LArrow", "<-")
export const RArrow = keyword("RArrow", "->")
export const LCurly = keyword(
  "LCurly",
  "{",
  GroupHeaderText,
  PageHeaderText,
  LabelContent,
  InputValue,
  InputModifiers,
  Button,
  Picture,
  TableCell,
  TableCellContinue
)
export const RCurly = keyword("RCurly", "}", PropertiesValueText, PropertiesNameText)

export const LSquare = keyword("LSquare", "[", CheckboxHeader)
export const RSquare = keyword("RSquare", "]", CheckboxHeader)

export const LRound = keyword("LRound", "(", PropertiesValueText)
export const RRound = keyword("RRound", ")", PropertiesValueOptionText)

export const Comma = keyword("Comma", ",", PropertiesValueText, PropertiesValueOptionText)

export const LAngle = keyword("LAngle", "<")
export const RAngle = keyword("RAngle", ">", Button, Picture)

export const Semicolon = keyword("Semicolon", ";", PropertiesValueText, PropertiesValueOptionText)
export const Colon = keyword("Colon", ":", InputHeader, TableCell)
export const VBar = keyword("VBar", "|", Button, Picture, TableCell, TableCellContinue)
export const Equals = keyword("Equals", "=", PropertiesNameText)
export const Plus = keyword("Plus", "+", GroupHeaderText, PageHeaderText, InlineText)
export const Slash = keyword("Slash", "/", GroupHeaderText, PageHeaderText, InlineText)
export const Ampersand = keyword("Ampersand", "&", InlineText)
export const Whitespace = createToken({ name: "Tab", pattern: /[ \t]+/ })

export const Hash = createToken({
  name: "Hash",
  pattern: /#+[ \t]*/,
  label: "##",
  categories: excludeTokens(GroupHeaderText, PageHeaderText, InlineText),
})

export const Dash = createToken({
  name: "Dash",
  pattern: /-[ \t]*/,
  label: "-",
  categories: excludeTokens(Button),
})

export const Dashes = createToken({
  name: "Dashes",
  pattern: /--+[ \t]*/,
  label: "--",
  categories: excludeTokens(FormHeaderText, TableCell),
})

export const Text = createToken({
  name: "Text",
  pattern: /[a-zA-Zа-яА-ЯёЁ№!%0-9][a-zA-Zа-яА-ЯёЁ№!%0-9\t ]*/,
  categories: combineTokens,
})

export const NewLine = createToken({
  name: "NewLine",
  pattern: /\n/,
  line_breaks: true,
})

// #endregion

// #region fields

export const LabelFieldType = createToken({
  name: "LabelFieldType",
  pattern: matchType,
  group: Lexer.SKIPPED,
  line_breaks: true,
})
export const CheckboxRightFieldType = createToken({
  name: "CheckboxRightFieldType",
  pattern: matchType,
  group: Lexer.SKIPPED,
  line_breaks: true,
})
export const CheckboxLeftFieldType = createToken({
  name: "CheckboxLeftFieldType",
  pattern: matchType,
  group: Lexer.SKIPPED,
  line_breaks: true,
})
export const InputFieldType = createToken({
  name: "InputFieldType",
  pattern: matchType,
  group: Lexer.SKIPPED,
  line_breaks: true,
})
export const TableType = createToken({
  name: "TableType",
  pattern: matchType,
  group: Lexer.SKIPPED,
  line_breaks: true,
})
export const CommandBarType = createToken({
  name: "CommandBarType",
  pattern: matchType,
  group: Lexer.SKIPPED,
  line_breaks: true,
})

export const inlineTypesTokens = [
  LabelFieldType,
  CheckboxRightFieldType,
  CheckboxLeftFieldType,
  InputFieldType,
  TableType,
  CommandBarType,
]

// #endregion

// #region allTokens

export const allTokens = [
  NewLine,
  Dashes,
  DoubleUnderscore,
  SwitchChecked,
  SwitchUnchecked,
  CheckboxChecked,
  CheckboxUnchecked,
  ButtonGroup,
  Picture,
  LArrow,
  RArrow,
  Dots,
  Dash,
  Text,
  VBar,
  LCurly,
  RCurly,
  LRound,
  RRound,
  Comma,
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
  ...inlineTypesTokens,
]

// #endregion

export const lexer = new Lexer(allTokens)
