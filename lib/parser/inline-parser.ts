import { EmbeddedActionsParser, CstParser, EMPTY_ALT, IToken } from "chevrotain";
import { LLStarLookaheadStrategy } from "chevrotain-allstar";
import * as t from "./lexer.ts";

export class InlineParser extends CstParser {
  constructor() {
    super(t.allTokens, {
      // lookaheadStrategy: new LLStarLookaheadStrategy()
    });
    this.performSelfAnalysis();
  }

  public parse() {
    
  }

  public detect(tokens: Array<IToken>): string {
    const firstToken = tokens[0];

    const checkboxTokens = [t.CheckboxChecked, t.CheckboxUnchecked, t.SwitchChecked, t.SwitchUnchecked];

    let hasVBar: boolean = false;
    let hasColon: boolean = false;
    let hasRightCheckbox: boolean = false;

    if (firstToken.tokenType == t.LAngle) {
      return "commandBar";
    }

    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      const nextToken = tokens[index + 1];
      const isInlineElementEnd = (index == tokens.length - 1 || nextToken?.tokenType == t.LCurly)

      if (token.tokenType == t.VBar) { hasVBar = true; continue }
      if (token.tokenType == t.Colon) { hasColon = true; continue }
      if (checkboxTokens.includes(token.tokenType) && isInlineElementEnd) { hasRightCheckbox = true }

    }

    if (hasVBar) {
      return "table";
    }

    if (hasColon) {
      return "inputField";
    }

    if (hasRightCheckbox) {
      return "checkboxRightField";
    }

    if (checkboxTokens.includes(firstToken.tokenType)) {
      return "checkboxLeftField";
    }

    return "labelField";
  }

  // #region commandBar

  public commandBar = this.RULE("commandBar", () => {
    this.CONSUME1(t.LAngle)

    this.binaryExpression(this.button, t.VBar);

    this.CONSUME3(t.RAngle)
    this.OPTION4(() => { this.SUBRULE3(this.properties) })
  })

  public button = this.RULE("button", () => {
    this.MANY(() => { this.CONSUME(t.Button) })
    this.OPTION(() => { this.SUBRULE(this.properties) })
  })

  // #endregion

  // #region labelField

  public labelField = this.RULE("labelField", () => {
    this.MANY1(() => { this.CONSUME(t.InputHeader) })
    this.OPTION2(() => { this.SUBRULE(this.properties) })
  })

  // #endregion

  // #region inputField

  public inputField = this.RULE("inputField", () => {
    this.MANY1(() => { this.CONSUME(t.InputHeader) })
    this.CONSUME(t.Colon);
    this.MANY2(() => { this.CONSUME(t.InputValue) })
    this.OPTION1(() => { this.CONSUME(t.Underscore) })
    this.MANY3(() => { this.CONSUME(t.InputModifiers) })
    this.OPTION2(() => { this.SUBRULE(this.properties) })
  })

  // #endregion

  // #region checkboxField

  public checkboxLeftField = this.RULE("checkboxLeftField", () => {
    this.choice(
      () => { this.CONSUME(t.CheckboxChecked) },
      () => { this.CONSUME(t.CheckboxUnchecked) },
      () => { this.CONSUME(t.SwitchChecked) },
      () => { this.CONSUME(t.SwitchUnchecked) }
    )

    this.MANY(() => { this.CONSUME(t.CheckboxHeader) })
    this.OPTION(() => { this.SUBRULE(this.properties) })
  })

  public checkboxRightField = this.RULE("checkboxRightField", () => {
    this.MANY1(() => { this.CONSUME(t.CheckboxHeader) })

    this.choice(
      () => { this.CONSUME(t.CheckboxChecked) },
      () => { this.CONSUME(t.CheckboxUnchecked) },
      () => { this.CONSUME(t.SwitchChecked) },
      () => { this.CONSUME(t.SwitchUnchecked) }
    )

    this.OPTION3(() => { this.SUBRULE(this.properties) })
  })

  // #endregion

  // #region table

  public table = this.RULE("table", () => {
    this.binaryExpression(this.tableCell, t.VBar);
  })

  public tableCell = this.RULE("tableCell", () => {
    this.OPTION1(() => { this.CONSUME(t.Dot) })

    this.choice(
      () => { this.CONSUME(t.CheckboxChecked) },
      () => { this.CONSUME(t.CheckboxUnchecked) },
      EMPTY_ALT
    )

    this.MANY(() => { this.CONSUME(t.TableCell) })
    this.OPTION2(() => { this.SUBRULE(this.properties) })
  })

  // #endregion

  // #region properties

  public properties = this.RULE("properties", () => {
    this.CONSUME(t.LCurly);
    this.OPTION1(() => { this.SUBRULE(this.property) });
    this.OPTION2(() => { this.CONSUME(t.RCurly) });
  })

  public property = this.RULE("property", () => {
    this.MANY1(() => { this.CONSUME(t.PropertiesNameText) });
    this.OPTION2(() => { this.CONSUME(t.Equals) });
    this.MANY2(() => { this.CONSUME(t.PropertiesValueText) });
  })

  // #endregion

  // #region etc

  // https://github.com/bia-technologies/yaxunit-editor
  private choice(...tokens: (() => any)[]) {
    const items = tokens.map(t => { return { ALT: t } })
    this.OR(items)
  }

  // https://github.com/bia-technologies/yaxunit-editor
  private binaryExpression(operand: any, operator: any) {
    this.SUBRULE1(operand)
    this.MANY(() => {
      this.CONSUME(operator)
      this.SUBRULE2(operand)
    })
  }

  // #endregion
}
