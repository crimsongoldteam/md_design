import { EmbeddedActionsParser, EOF } from "./chevrotain.js";
import { LLStarLookaheadStrategy } from "./chevrotain-allstar/all-star-lookahead.js";

import { GroupStack } from "./group-stack.js";
import * as t from "./lexer.js";

class GroupParser extends EmbeddedActionsParser {
  constructor() {
    super(t.allTokens, {
      lookaheadStrategy: new LLStarLookaheadStrategy(),
    });

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

    $.RULE("OneLineGroup", (group_stack, indent, firstInline) => {
      let result;
      if (!$.RECORDING_PHASE) {
        result = group_stack.createOneLineGroup();

        group_stack.setParent(firstInline, result);
        // inline.children.Items.push(first);
      }

      $.MANY({
        SEP: t.Ampersand,
        DEF: () => {
          let item = this.CONSUME(t.InlineText);
          if (!$.RECORDING_PHASE) {
            let inline = group_stack.createInline(result);
            group_stack.setParent(inline, result);
            inline.children.Items.push(item);
          }
        },
      });
      return result;
    });

    $.RULE("Inline", (group_stack, indent) => {
      let item;
      if (!$.RECORDING_PHASE) {
        item = group_stack.createInline();
      }

      $.AT_LEAST_ONE(() => {
        let inlineText = this.CONSUME(t.InlineText);
        if (!$.RECORDING_PHASE) {
          item.children.Items.push(inlineText);
        }
      });

      $.OPTION(() => {
        $.CONSUME(t.Ampersand);
        item = $.SUBRULE($.OneLineGroup, {
          ARGS: [group_stack, indent, item],
        });
      });

      if (!$.RECORDING_PHASE) {
        group_stack.add(item, indent);
      }
    });

    $.RULE("Column", (group_stack, indent) => {
      // let indent = $.SUBRULE($.Indents);

      $.OR([
        {
          // #Подзаголовок 1 #Подзаголовок 2
          ALT: () => {
            $.AT_LEAST_ONE(() => {
              let header = $.SUBRULE($.VGroupHeader);

              if (!$.RECORDING_PHASE) {
                group_stack.add(header, indent);
              }
            });
          },
        },
        // /Страница
        {
          ALT: () => {
            let header = $.SUBRULE($.PageHeader);

            if (!$.RECORDING_PHASE) {
              group_stack.add(header, indent);
            }
          },
        },
        // Строчный элемент
        {
          ALT: () => {
            $.SUBRULE($.Inline, { ARGS: [group_stack, indent] });
          },
        },
      ]);
    });

    $.RULE("Row", (group_stack) => {
      $.MANY({
        SEP: t.Plus,
        DEF: () => {
          let indent = $.SUBRULE($.Indents);

          $.OPTION2(() => {
            $.SUBRULE2($.Column, { ARGS: [group_stack, indent] });
          });

          if (!$.RECORDING_PHASE) {
            group_stack.next();
          }
        },
      });

      $.OPTION3({
        GATE: () => {
          return $.LA(1).tokenType != EOF;
        },
        DEF: () => {
          return $.CONSUME(t.NewLine);
        },
      });

      if (!$.RECORDING_PHASE) {
        group_stack.doneLine();
      }
    });

    this.performSelfAnalysis();
  }
}

export const groupParser = new GroupParser();
