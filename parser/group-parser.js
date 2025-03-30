import { EmbeddedActionsParser, EOF } from "./chevrotain.js";

import { GroupStack } from "./group-stack.js";
import * as t from "./lexer.js";

class GroupParser extends EmbeddedActionsParser {
  constructor() {
    super(t.allTokens);
    const $ = this;

    $.RULE("Form", () => {
      let result = {
        name: "Form",
        children: { Items: [], FormHeader: [] },
      };

      let group_stack = new GroupStack(result);

      $.SUBRULE($.Rows, { ARGS: [group_stack] });

      return result;
    });

    $.RULE("Rows", (group_stack) => {
      let isFirst = true;
      $.MANY(() => {
        // let indent = $.SUBRULE($.Indents);
        $.OR([
          {
            GATE: () => {
              return isFirst;
            },
            ALT: () => {
              let header = $.SUBRULE1($.FormHeader);
              if (!$.RECORDING_PHASE) {
                group_stack.form.children.FormHeader.push(header);
              }
              isFirst = false;
            },
          },
          // {
          //   ALT: () => {
          //     $.CONSUME3(t.NewLine);

          //   },
          // },
          {
            ALT: () => {
              isFirst = false;
              $.SUBRULE($.Row, { ARGS: [group_stack] });
            },
          },
        ]);
      });
    });

    // ---Заголовок формы---
    $.RULE("FormHeader", () => {
      let result = {
        name: "FormHeader",
        children: { Dash: [], Text: [] },
      };

      result.children.Dash.push($.CONSUME1(t.TripleDash));

      $.MANY(() => {
        result.children.Text.push($.CONSUME(t.HeaderText));
      });

      result.children.Dash.push($.CONSUME7(t.TripleDash));

      $.OPTION({
        GATE: () => {
          return $.LA(1).tokenType != EOF;
        },
        DEF: () => {
          return $.CONSUME(t.NewLine);
        },
      });

      return result;
    });

    // #Заголовок 1
    $.RULE("VGroupHeader", () => {
      let result = {
        name: "VGroupHeader",
        children: { Hash: [], Text: [], Properties: {} },
      };

      $.AT_LEAST_ONE(() => {
        result.children.Hash.push($.CONSUME(t.Hash));
      });

      $.MANY(() => {
        result.children.Text.push($.CONSUME(t.PageGroupHeaderText));
      });

      let propertiesObj = $.SUBRULE($.Properties);

      if (propertiesObj.isProperties) {
        result.children.Properties = propertiesObj.properties;
      } else {
        result.children.Text = result.children.Text.concat(
          propertiesObj.tokens
        );
      }

      return result;
    });

    // /Заголовок страницы
    $.RULE("PageHeader", () => {
      let result = {
        name: "PageHeader",
        children: { Slash: [], Text: [], Properties: {} },
      };

      result.children.Slash.push($.CONSUME(t.Slash));

      $.MANY(() => {
        result.children.Text.push($.CONSUME(t.PageGroupHeaderText));
      });

      let propertiesObj = $.SUBRULE($.Properties);

      if (propertiesObj.isProperties) {
        result.children.Properties = propertiesObj.properties;
      } else {
        result.children.Text = result.children.Text.concat(
          propertiesObj.tokens
        );
      }

      return result;
    });

    $.RULE("Properties", () => {
      let result = {
        properties: {},
        tokens: [],
        isProperties: false,
        isPropertiesCounter: 0,
      };

      $.OPTION1(() => {
        result.tokens.push($.CONSUME(t.LCurly));
        result.isPropertiesCounter++;
      });

      $.OPTION2(() => {
        $.SUBRULE1($.Property, { ARGS: [result] });
        // $.MANY1(() => {
        //   result.tokens.push($.CONSUME(Comma));
        //   $.SUBRULE2($.Property, { ARGS: [result] });
        // });
      });

      $.OPTION3(() => {
        result.tokens.push($.CONSUME(t.RCurly));
        result.isPropertiesCounter++;
        $.MANY2(() => {
          result.isPropertiesCounter = 0;
          result.tokens.push($.CONSUME(t.PageGroupHeaderText));
        });
      });

      result.isProperties = result.isPropertiesCounter > 1;

      return result;
    });

    $.RULE("Property", (params) => {
      let tokens = [];
      if (!$.RECORDING_PHASE) {
        tokens = params.tokens;
      }

      let isPropertiesCounter = 0;
      let key, value;
      $.OPTION1(() => {
        key = $.CONSUME1(t.PropertiesNameText);
        tokens.push(key);
        isPropertiesCounter++;
      });

      $.OPTION2(() => {
        tokens.push($.CONSUME(t.Equals));
        isPropertiesCounter++;
      });

      $.OPTION3(() => {
        value = $.CONSUME2(t.PropertiesValueText);
        tokens.push(value);
        isPropertiesCounter++;
      });

      if (!$.RECORDING_PHASE) {
        if (isPropertiesCounter < 3) {
          params.isPropertiesCounter = 0;
        } else {
          params.properties[key.image] = value.image;
        }
      }
    });

    $.RULE("Indents", () => {
      let indent = 0;
      $.MANY(() => {
        $.CONSUME(t.Tab);
        if (!$.RECORDING_PHASE) {
          indent++;
        }
      });
      return indent;
    });

    $.RULE("OneLineGroup", (group_stack, first) => {
      let result;
      $.ACTION(() => {
        result = group_stack.createOneLineGroup();
        group_stack.setParent(first, result);
      });

      $.MANY({
        SEP: t.Ampersand,
        DEF: () => {
          let item = this.CONSUME(t.InlineText);
          $.ACTION(() => {
            let inline = group_stack.createInline(result);
            group_stack.setParent(inline, result);
            inline.children.Items.push(item);
          });
        },
      });
      return result;
    });

    $.RULE("Inline", (group_stack) => {
      let result;

      $.ACTION(() => {
        result = group_stack.createInline();
      });

      $.AT_LEAST_ONE(() => {
        let inlineText = this.CONSUME(t.InlineText);
        $.ACTION(() => {
          result.children.Items.push(inlineText);
        });
      });

      $.OPTION(() => {
        $.CONSUME(t.Ampersand);
        result = $.SUBRULE($.OneLineGroup, { ARGS: [group_stack, result] });
      });

      return result;
    });

    $.RULE("Column", (group_stack) => {
      let result;

      $.OR([
        {
          // #Подзаголовок 1 #Подзаголовок 2
          ALT: () => {
            result = group_stack.createHGroup();
            $.AT_LEAST_ONE(() => {
              let header = $.SUBRULE($.VGroupHeader);
              group_stack.createVGroup(header, result);
            });
          },
        },
        // /Страница
        {
          ALT: () => {
            result = $.SUBRULE($.PageHeader);
          },
        },
        // Строчный элемент
        {
          ALT: () => {
            result = $.SUBRULE($.Inline);
          },
        },
      ]);
      return result;
    });

    $.RULE("RowSeparator", () => {
      let result = false;
      $.OR([
        {
          ALT: () => {
            $.CONSUME(t.Plus);
            result = true;
          },
        },
        {
          GATE: () => {
            return $.LA(1).tokenType != EOF;
          },
          DEF: () => {
            $.CONSUME(t.NewLine);
          },
        },
      ]);
      return result;
    });

    $.RULE("Row", (group_stack) => {
      $.MANY(() => {
        let indent = $.SUBRULE($.Indents);
        let item = $.SUBRULE($.Column, { ARGS: [group_stack, indent] });
        let separator = $.SUBRULE($.RowSeparator);

        $.ACTION(() => {
          group_stack.collect(item, indent, separator);
        });
      });
      $.ACTION(() => {
        group_stack.doneRow();
      });
    });

    this.performSelfAnalysis();
  }
}

export const groupParser = new GroupParser();
