import { CstNode, CstParser, EMPTY_ALT, EOF, IToken } from "chevrotain";
import * as t from "./lexer.ts";

export class InlineParser extends CstParser {
  constructor() {
    super(t.allTokens);
    this.performSelfAnalysis();
  }

  public parse() {
    return this.form()
  }

  public parseFields(tokens: IToken[]): CstNode[] {
    this.input = tokens
    const result = this.fields()
    return result.children.field as CstNode[]
  }

  // #region form

  private form = this.RULE("form", () => {
    let isFirst = true;
    let isEnd = false;
    this.MANY({
      GATE: () => {
        return !isEnd;
      },
      DEF: () => {
        this.OR([
          {
            IGNORE_AMBIGUITIES: true,
            ALT: () => {
              isEnd = true;
              this.CONSUME3(EOF);
            },
          },
          {
            GATE: () => { return isFirst; },
            ALT: () => { this.SUBRULE1(this.formHeader); },
          },
          {
            ALT: () => {
              this.SUBRULE(this.row);
            },
          },
        ]);
      },
    });
  })

  private formHeader = this.RULE("formHeader", () => {
    this.CONSUME1(t.TripleDash)
    this.MANY(() => { this.CONSUME2(t.FormHeaderText); })
    this.CONSUME3(t.TripleDash);

    this.OPTION1(() => { this.SUBRULE(this.properties) })

    this.SUBRULE(this.EOL)
  });

  private row = this.RULE("row", () => {
    this.binaryExpression(this.column, t.Plus)

    this.SUBRULE(this.EOL)
  });

  private column = this.RULE("column", () => {
    this.SUBRULE(this.indents);
    this.choice(
      () => { this.SUBRULE(this.horizontalGroup) },
      () => { this.SUBRULE(this.pageHeader) },
      () => { this.SUBRULE(this.inline) },
      EMPTY_ALT
    )
  });

  private indents = this.RULE("indents", () => {
    this.MANY(() => { this.CONSUME(t.Whitespace) });
  })


  private EOL = this.RULE("EOL", () => {
    this.OPTION({
      GATE: () => { return this.LA(1).tokenType != EOF; },
      DEF: () => { this.CONSUME(t.NewLine) },
    });
  })

  // #endregion

  // #region page

  private pageHeader = this.RULE("pageHeader", () => {
    this.CONSUME(t.Slash)
    this.MANY(() => { this.CONSUME(t.PageHeaderText) })

    this.OPTION1(() => { this.SUBRULE(this.properties) })
  })

  // #endregion

  // #region group

  private horizontalGroup = this.RULE("horizontalGroup", () => {
    this.AT_LEAST_ONE(() => { this.SUBRULE(this.verticalGroupHeader) })
  });

  private verticalGroupHeader = this.RULE("verticalGroupHeader", () => {
    this.AT_LEAST_ONE(() => { this.CONSUME(t.Hash) })
    this.MANY(() => { this.CONSUME(t.GroupHeaderText) })

    this.OPTION1(() => { this.SUBRULE(this.properties) })
  });

  // #endregion

  // #region inline

  private inline = this.RULE("inline", () => {
    this.binaryExpression(this.inlineItem, t.Ampersand)
  });

  private inlineItem = this.RULE("inlineItem", () => {
    this.AT_LEAST_ONE(() => { this.CONSUME(t.InlineText) });
  });

  // #endregion

  // #region fields

  private fields = this.RULE("fields", () => {
    this.MANY(() => { this.SUBRULE(this.field) })
  });

  private field = this.RULE("field", () => {
    this.choice(
      // () => { this.SUBRULE(this.commandBar) },
      () => { this.SUBRULE1(this.labelField) },
      () => { this.SUBRULE2(this.inputField) },
      // () => { this.SUBRULE(this.checkboxLeftField) },
      // () => { this.SUBRULE(this.checkboxRightField) },
      // () => { this.SUBRULE(this.table) }
    )
  });

  // #endregion

  // #region commandBar

  private commandBar = this.RULE("commandBar", () => {
    this.CONSUME1(t.LAngle)

    this.binaryExpression(this.button, t.VBar);

    this.CONSUME3(t.RAngle)
    this.OPTION4(() => { this.SUBRULE3(this.properties) })
  })

  private button = this.RULE("button", () => {
    this.MANY(() => { this.CONSUME(t.Button) })
    this.OPTION(() => { this.SUBRULE(this.properties) })
  })

  // #endregion

  // #region labelField

  private labelField = this.RULE("labelField", () => {
    this.CONSUME(t.LabelFieldType)
    this.MANY1(() => { this.CONSUME(t.InputHeader) })
    this.OPTION2(() => { this.SUBRULE(this.properties) })
  })

  // #endregion

  // #region inputField

  private inputField = this.RULE("inputField", () => {
    this.CONSUME(t.InputFieldType)
    this.MANY1(() => { this.CONSUME(t.InputHeader) })
    this.CONSUME(t.Colon);
    this.MANY2(() => { this.CONSUME(t.InputValue) })
    this.OPTION1(() => { this.CONSUME(t.Underscore) })
    this.MANY3(() => { this.CONSUME(t.InputModifiers) })

    this.OPTION2(() => { this.SUBRULE(this.properties) })
  })

  // #endregion

  // #region checkboxField

  private checkboxLeftField = this.RULE("checkboxLeftField", () => {
    this.choice(
      () => { this.CONSUME(t.CheckboxChecked) },
      () => { this.CONSUME(t.CheckboxUnchecked) },
      () => { this.CONSUME(t.SwitchChecked) },
      () => { this.CONSUME(t.SwitchUnchecked) }
    )

    this.MANY(() => { this.CONSUME(t.CheckboxHeader) })

    this.OPTION(() => { this.SUBRULE(this.properties) })
  })

  private checkboxRightField = this.RULE("checkboxRightField", () => {
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

  private table = this.RULE("table", () => {
    this.binaryExpression(this.tableCell, t.VBar);
  })

  private tableCell = this.RULE("tableCell", () => {
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

  private properties = this.RULE("properties", () => {
    this.CONSUME(t.LCurly);
    this.OPTION1(() => { this.SUBRULE(this.property) });
    this.OPTION2(() => { this.CONSUME(t.RCurly) });
  })

  private property = this.RULE("property", () => {
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


export const parser = new InlineParser();
