import { EmbeddedActionsParser, EOF } from "chevrotain";

import { GroupStack } from "./group-stack";
import { InlineParser } from "./inline-parser";

import * as t from "./lexer";

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
      let isEnd = false;
      $.MANY({
        GATE: () => {
          return !isEnd;
        },
        DEF: () => {
          $.OR([
            {
              IGNORE_AMBIGUITIES: true,
              ALT: () => {
                isEnd = true;
                $.CONSUME3(EOF);
              },
            },
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
        },
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
    $.RULE("VGroupHeader", (group_stack, hGroup) => {
      let vGroup;
      let vGroupHeader;

      $.ACTION(() => {
        vGroup = group_stack.createVGroup(hGroup);
        vGroupHeader = vGroup.children.VGroupHeader[0];
      });

      let hash = $.CONSUME(t.Hash);
      $.ACTION(() => {
        vGroupHeader.children.Hash.push(hash);
      });

      $.MANY(() => {
        let text = $.CONSUME(t.PageGroupHeaderText);
        $.ACTION(() => {
          vGroupHeader.children.Text.push(text);
        });
      });

      let propertiesObj = $.SUBRULE($.Properties);

      $.ACTION(() => {
        if (propertiesObj.isProperties) {
          vGroup.children.Properties = propertiesObj.properties;
        } else {
          vGroupHeader.children.Text = vGroupHeader.children.Text.concat(
            propertiesObj.tokens
          );
        }
      });

      return vGroup;
    });

    // /Заголовок страницы
    $.RULE("PageHeader", (group_stack) => {
      let page;
      let pageHeader;

      $.ACTION(() => {
        page = group_stack.createPage();
        pageHeader = page.children.PageHeader[0];
      });

      let slash = $.CONSUME(t.Slash);
      $.ACTION(() => {
        pageHeader.children.Slash.push(slash);
      });

      $.MANY(() => {
        let text = $.CONSUME(t.PageGroupHeaderText);
        $.ACTION(() => {
          pageHeader.children.Text.push(text);
        });
      });

      let propertiesObj = $.SUBRULE($.Properties);

      $.ACTION(() => {
        if (propertiesObj.isProperties) {
          page.children.Properties = propertiesObj.properties;
        } else {
          pageHeader.children.Text = pageHeader.children.Text.concat(
            propertiesObj.tokens
          );
        }
      });
      return page;
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

      let separator = true;
      $.MANY({
        GATE: () => {
          return separator;
        },
        DEF: () => {
          $.OR([
            {
              ALT: () => {
                $.CONSUME1(t.Ampersand);
                separator = true;
              },
            },
            {
              ALT: () => {
                let items = [];
                $.AT_LEAST_ONE(() => {
                  let inlineText = this.CONSUME(t.InlineText);
                  $.ACTION(() => {
                    items.push(inlineText);
                  });
                });

                $.ACTION(() => {
                  if (items.length > 0) {
                    let inline = group_stack.createInline(result);
                    group_stack.setParent(inline, result);
                    inline.children.Items = items;
                  }
                });

                separator = false;
                $.OPTION(() => {
                  $.CONSUME(t.Ampersand);
                  separator = true;
                });
              },
            },
          ]);
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
            $.ACTION(() => {
              result = group_stack.createHGroup();
            });

            $.AT_LEAST_ONE(() => {
              $.SUBRULE($.VGroupHeader, { ARGS: [group_stack, result] });
            });
          },
        },
        // /Страница
        {
          ALT: () => {
            result = $.SUBRULE($.PageHeader, { ARGS: [group_stack] });
          },
        },
        // Строчный элемент
        {
          ALT: () => {
            result = $.SUBRULE($.Inline, { ARGS: [group_stack] });
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
          IGNORE_AMBIGUITIES: true,
          ALT: () => {
            $.CONSUME(EOF);
          },
        },
        {
          GATE: () => {
            return $.LA(1).tokenType != EOF;
          },
          ALT: () => {
            $.CONSUME(t.NewLine);
          },
        },
      ]);
      return result;
    });

    $.RULE("Row", (group_stack) => {
      let separator = true;
      $.MANY({
        GATE: () => {
          return separator;
        },
        DEF: () => {
          let item;
          $.ACTION(() => {
            item = group_stack.createInline();
          });

          let indent = $.SUBRULE($.Indents);

          $.OPTION(() => {
            item = $.SUBRULE($.Column, { ARGS: [group_stack, indent] });
          });

          separator = $.SUBRULE($.RowSeparator);

          $.ACTION(() => {
            group_stack.collect(item, indent, separator);
          });
        },
      });
      $.ACTION(() => {
        group_stack.doneRow();
      });
    });

    this.performSelfAnalysis();
  }
}

export const groupParser = new GroupParser();
