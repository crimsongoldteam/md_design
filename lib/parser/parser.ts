import { CstNode, CstParser, EOF, IToken } from "chevrotain"
import * as t from "./lexer.ts"

export class Parser extends CstParser {
  constructor() {
    super(t.allTokens)
    this.performSelfAnalysis()
  }

  public parse() {
    return this.form()
  }

  public parseFields(tokens: IToken[]): CstNode[] {
    if (!tokens.length) {
      return [] as CstNode[]
    }
    this.input = tokens
    const result = this.fields()
    return result.children.field as CstNode[]
  }

  // #region form

  private readonly form = this.RULE("form", () => {
    let isFirst = true
    let isEnd = false
    this.MANY({
      GATE: () => {
        return !isEnd
      },
      DEF: () => {
        this.OR([
          {
            IGNORE_AMBIGUITIES: true,
            ALT: () => {
              isEnd = true
              this.CONSUME3(EOF)
            },
          },
          {
            GATE: () => {
              return isFirst
            },
            ALT: () => {
              this.SUBRULE1(this.formHeader)
            },
          },
          {
            ALT: () => {
              this.SUBRULE(this.row)
            },
          },
        ])
      },
    })
  })

  private readonly formHeader = this.RULE("formHeader", () => {
    this.CONSUME1(t.Dashes)
    this.MANY(() => {
      this.CONSUME2(t.FormHeaderText)
    })
    this.CONSUME3(t.Dashes)

    this.OPTION1(() => {
      this.SUBRULE(this.properties)
    })

    this.SUBRULE(this.EOL)
  })

  private readonly row = this.RULE("row", () => {
    this.binaryExpression(this.column, t.Plus)

    this.SUBRULE(this.EOL)
  })

  private readonly column = this.RULE("column", () => {
    this.SUBRULE(this.indents)
    this.choice(
      () => {
        this.SUBRULE(this.horizontalGroup)
      },
      () => {
        this.SUBRULE(this.pageHeader)
      },
      () => {
        this.SUBRULE(this.inline)
      }
      // EMPTY_ALT
    )
  })

  private readonly indents = this.RULE("indents", () => {
    this.MANY(() => {
      this.CONSUME(t.Whitespace)
    })
  })

  private readonly EOL = this.RULE("EOL", () => {
    this.OPTION({
      GATE: () => {
        return this.LA(1).tokenType != EOF
      },
      DEF: () => {
        this.MANY(() => {
          this.CONSUME(t.NewLine)
        })
      },
    })
  })

  // #endregion

  // #region page

  private readonly pageHeader = this.RULE("pageHeader", () => {
    this.CONSUME(t.Slash)
    this.MANY(() => {
      this.CONSUME(t.PageHeaderText)
    })

    this.OPTION1(() => {
      this.SUBRULE(this.properties)
    })
  })

  // #endregion

  // #region group

  private readonly horizontalGroup = this.RULE("horizontalGroup", () => {
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.verticalGroupHeader)
    })
  })

  private readonly verticalGroupHeader = this.RULE("verticalGroupHeader", () => {
    this.CONSUME(t.Hash)
    this.MANY(() => {
      this.CONSUME(t.GroupHeaderText)
    })

    this.OPTION1(() => {
      this.SUBRULE(this.properties)
    })
  })

  // #endregion

  // #region inline

  private readonly inline = this.RULE("inline", () => {
    this.binaryExpression(this.inlineItem, t.Ampersand)
  })

  private readonly inlineItem = this.RULE("inlineItem", () => {
    this.MANY(() => {
      this.CONSUME(t.InlineText)
    })
  })

  // #endregion

  // #region fields

  private readonly fields = this.RULE("fields", () => {
    this.MANY(() => {
      this.SUBRULE(this.field)
    })
  })

  private readonly field = this.RULE("field", () => {
    this.choice(
      () => {
        this.SUBRULE(this.labelField)
      },
      () => {
        this.SUBRULE(this.inputField)
      },
      () => {
        this.SUBRULE(this.checkboxLeftField)
      },
      () => {
        this.SUBRULE(this.checkboxRightField)
      },
      () => {
        this.SUBRULE(this.commandBar)
      },
      () => {
        this.SUBRULE(this.table)
      }
    )
  })

  private skipField(): void {
    let choices = t.inlineTypesTokens.map((item) => () => {
      this.CONSUME(item)
    })
    this.choice(...choices)
  }

  // #endregion

  // #region commandBar

  private readonly commandBar = this.RULE("commandBar", () => {
    this.CONSUME(t.CommandBarType)

    this.CONSUME1(t.LAngle)

    this.binaryExpression(this.buttonGroup, t.ButtonGroup)

    this.MANY2(() => {
      this.SUBRULE(this.commandBarLine)
    })

    this.CONSUME3(t.RAngle)
    this.OPTION4(() => {
      this.SUBRULE3(this.properties)
    })
  })

  private readonly buttonGroup = this.RULE("buttonGroup", () => {
    this.binaryExpression(this.button, t.VBar)
  })

  private readonly button = this.RULE("button", () => {
    this.OPTION1(() => {
      this.CONSUME1(t.Picture, { LABEL: "leftPicture" })
    })
    this.MANY(() => {
      this.CONSUME(t.Button)
    })
    this.OPTION2(() => {
      this.CONSUME2(t.Picture, { LABEL: "rightPicture" })
    })
    this.OPTION(() => {
      this.SUBRULE(this.properties)
    })
  })

  private readonly commandBarLine = this.RULE("commandBarLine", () => {
    this.skipField()
    this.OPTION(() => {
      this.CONSUME(t.Dots)
    })
    this.SUBRULE(this.button)
  })

  // #endregion

  // #region labelField

  private readonly labelField = this.RULE("labelField", () => {
    this.CONSUME(t.LabelFieldType)
    this.MANY1(() => {
      this.CONSUME(t.LabelContent)
    })
    this.OPTION2(() => {
      this.SUBRULE(this.properties)
    })
  })

  // #endregion

  // #region inputField

  private readonly inputField = this.RULE("inputField", () => {
    this.CONSUME(t.InputFieldType)
    this.MANY1(() => {
      this.CONSUME(t.InputHeader)
    })
    this.CONSUME(t.Colon)
    this.MANY2(() => {
      this.CONSUME(t.InputValue)
    })

    this.OPTION1(() => {
      this.CONSUME(t.DoubleUnderscore)
      this.MANY3(() => {
        this.CONSUME(t.InputModifiers)
      })
    })

    this.OPTION2(() => {
      this.SUBRULE(this.properties)
    })
  })

  // #endregion

  // #region checkboxField

  private readonly checkboxLeftField = this.RULE("checkboxLeftField", () => {
    this.CONSUME(t.CheckboxLeftFieldType)

    this.choice(
      () => {
        this.CONSUME(t.CheckboxChecked)
      },
      () => {
        this.CONSUME(t.CheckboxUnchecked)
      },
      () => {
        this.CONSUME(t.SwitchChecked)
      },
      () => {
        this.CONSUME(t.SwitchUnchecked)
      }
    )

    this.MANY(() => {
      this.CONSUME(t.CheckboxHeader)
    })

    this.OPTION(() => {
      this.SUBRULE(this.properties)
    })
  })

  private readonly checkboxRightField = this.RULE("checkboxRightField", () => {
    this.CONSUME(t.CheckboxRightFieldType)

    this.MANY1(() => {
      this.CONSUME(t.CheckboxHeader)
    })

    this.choice(
      () => {
        this.CONSUME(t.CheckboxChecked)
      },
      () => {
        this.CONSUME(t.CheckboxUnchecked)
      },
      () => {
        this.CONSUME(t.SwitchChecked)
      },
      () => {
        this.CONSUME(t.SwitchUnchecked)
      }
    )

    this.OPTION3(() => {
      this.SUBRULE(this.properties)
    })
  })

  // #endregion

  // #region table

  private readonly table = this.RULE("table", () => {
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.tableLine)
    })
  })

  private readonly tableLine = this.RULE("tableLine", () => {
    this.CONSUME(t.TableType)
    this.OPTION(() => {
      this.CONSUME1(t.VBar)
    })
    this.binaryExpression(this.tableCell, t.VBar)
  })

  private readonly tableCell = this.RULE("tableCell", () => {
    this.choice(
      () => {
        this.SUBRULE(this.tableSeparatorCell)
      },
      () => {
        this.SUBRULE(this.tableDataCell)
      }
    )
  })

  private readonly tableSeparatorCell = this.RULE("tableSeparatorCell", () => {
    this.OPTION1(() => {
      this.CONSUME1(t.Colon, { LABEL: "leftColon" })
    })

    this.CONSUME(t.Dashes)

    this.OPTION2(() => {
      this.CONSUME2(t.Colon, { LABEL: "rightColon" })
    })
  })

  private readonly tableDataCell = this.RULE("tableDataCell", () => {
    this.OPTION1(() => {
      this.CONSUME(t.Dots)
    })

    this.OPTION2(() => {
      this.choice(
        () => {
          this.CONSUME(t.CheckboxChecked)
        },
        () => {
          this.CONSUME(t.CheckboxUnchecked)
        }
        // EMPTY_ALT
      )
    })

    this.OPTION3(() => {
      this.CONSUME(t.TableCell)
      this.MANY(() => {
        this.CONSUME(t.TableCellContinue, { LABEL: "TableCell" })
      })
    })

    this.OPTION4(() => {
      this.SUBRULE(this.properties)
    })
  })

  // #endregion

  // #region properties

  private readonly properties = this.RULE("properties", () => {
    this.CONSUME(t.LCurly)

    this.binaryExpression(this.property, t.Semicolon)

    this.OPTION2(() => {
      this.CONSUME(t.RCurly)
    })
  })

  private readonly property = this.RULE("property", () => {
    this.MANY1(() => {
      this.CONSUME(t.PropertiesNameText)
    })
    this.OPTION2(() => {
      this.CONSUME(t.Equals)
    })
    this.MANY2(() => {
      this.CONSUME(t.PropertiesValueText)
    })
  })

  // #endregion

  // #region etc

  // https://github.com/bia-technologies/yaxunit-editor
  private choice(...tokens: (() => any)[]) {
    const items = tokens.map((t) => {
      return { ALT: t }
    })
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

export const parser = new Parser()
