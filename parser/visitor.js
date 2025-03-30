import { groupParser } from "./group-parser.js";

const BaseVisitor = groupParser.getBaseCstVisitorConstructor();

class Visitor extends BaseVisitor {
  Form(ctx) {
    let result = {
      Тип: "Форма",
      // УИД: self.crypto.randomUUID(),
      НаборСвойств: {},
      Элементы: [],
      ЭлементыПарсинг: [],
      ТипыСвойств: {},
      Координаты: {},
    };

    let header = this.visit(ctx.FormHeader);
    if (header !== undefined) {
      result.НаборСвойств.Заголовок = this.visit(ctx.FormHeader);
    }

    ctx.Items.forEach((item) => {
      result.ЭлементыПарсинг.push(this.visit(item));
    });

    this.addChildLocation(result.ЭлементыПарсинг, result);

    return result;
  }

  FormHeader(ctx) {
    return ctx.Text.map((token) => token.image)
      .join("")
      .trim();
  }

  PageHeader(ctx) {
    return ctx.Text.map((token) => token.image)
      .join("")
      .trim();
  }

  VGroupHeader(ctx) {
    return ctx.Text.map((token) => token.image)
      .join("")
      .trim();
  }

  HGroup(ctx) {
    let result = {
      Тип: "ГоризонтальнаяГруппа",
      // УИД: self.crypto.randomUUID(),
      НаборСвойств: {},
      Элементы: [],
      ТипыСвойств: {},
      Координаты: {},
    };

    ctx.Items.forEach((item) => {
      result.Элементы.push(this.visit(item));
    });

    this.addChildLocation(result.Элементы, result);

    return result;
  }

  VGroup(ctx) {
    let result = {
      Тип: "ВертикальнаяГруппа",
      // УИД: self.crypto.randomUUID(),
      НаборСвойств: {},
      Элементы: [],
      ЭлементыПарсинг: [],
      ТипыСвойств: {},
      Координаты: {},
    };

    for (const [key, value] of Object.entries(ctx.Properties)) {
      result.НаборСвойств[key.trim()] = value.trim();
    }

    result.НаборСвойств.Заголовок = this.visit(ctx.VGroupHeader);

    this.addDisplayAndBehaviorToGroup(result["НаборСвойств"], ctx.VGroupHeader);

    ctx.Items.forEach((item) => {
      result.ЭлементыПарсинг.push(this.visit(item));
    });

    if (ctx.VGroupHeader.length > 0) {
      this.consumeLocation(ctx.VGroupHeader[0].children.Hash, result);
      this.consumeLocation(ctx.VGroupHeader[0].children.Text, result);
    }

    this.addChildLocation(result.ЭлементыПарсинг, result);

    return result;
  }

  addDisplayAndBehaviorToGroup(properties, VGroupHeader) {
    if (VGroupHeader.length == 0) {
      return;
    }

    const count = VGroupHeader[0].children.Hash.length;
    let currentDisplay;
    let currentBehavior;

    if (count === 2) {
      currentDisplay = "СлабоеВыделение";
    } else if (count === 3) {
      currentDisplay = "ОбычноеВыделение";
    } else if (count === 4) {
      currentDisplay = "СильноеВыделение";
    } else if (count === 5) {
      if (!properties.hasOwnProperty("Отображение")) {
        currentDisplay = "ОбычноеВыделение";
      }
      currentBehavior = "Свертываемая";
    } else if (count === 6) {
      if (!properties.hasOwnProperty("Отображение")) {
        currentDisplay = "ОбычноеВыделение";
      }
      currentBehavior = "Всплывающая";
    }

    if (currentDisplay !== undefined) {
      properties["Отображение"] = currentDisplay;
    }

    if (currentBehavior !== undefined) {
      properties["Поведение"] = currentBehavior;
    }
  }

  Pages(ctx) {
    let result = {
      Тип: "Страницы",
      // УИД: self.crypto.randomUUID(),
      НаборСвойств: {},
      Элементы: [],
      ТипыСвойств: {},
      Координаты: {},
    };

    ctx.Items.forEach((item) => {
      result.Элементы.push(this.visit(item));
    });

    this.addChildLocation(result.Элементы, result);

    return result;
  }

  Page(ctx) {
    let result = {
      Тип: "Страница",
      // УИД: self.crypto.randomUUID(),
      НаборСвойств: {},
      Элементы: [],
      ЭлементыПарсинг: [],
      ТипыСвойств: {},
      Координаты: {},
    };

    for (const [key, value] of Object.entries(ctx.Properties)) {
      result.НаборСвойств[key.trim()] = value.trim();
    }

    result.НаборСвойств.Заголовок = this.visit(ctx.PageHeader);

    if (ctx.PageHeader.length > 0) {
      this.consumeLocation(ctx.PageHeader[0].children.Slash, result);
      this.consumeLocation(ctx.PageHeader[0].children.Text, result);
    }

    ctx.Items.forEach((item) => {
      result.ЭлементыПарсинг.push(this.visit(item));
    });

    this.addChildLocation(result.ЭлементыПарсинг, result);

    return result;
  }

  OneLineGroup(ctx) {
    let result = {
      Тип: "ОднострочнаяГруппа",
      // УИД: self.crypto.randomUUID(),
      НаборСвойств: {},
      Элементы: [],
      ЭлементыПарсинг: [],
      Координаты: {},
    };

    ctx.Items.forEach((item) => {
      result.ЭлементыПарсинг.push(this.visit(item));
    });

    this.addChildLocation(result.ЭлементыПарсинг, result);

    return result;
  }

  Inline(ctx) {
    let result = {
      Тип: "СтрочныйЭлемент",
      // УИД: self.crypto.randomUUID(),
      НаборСвойств: {},
      ЭлементыПарсинг: [],
      ТипыСвойств: {},
      Координаты: {},
    };

    result.ЭлементыПарсинг = [ctx.Items.map((token) => token.image).join("")];

    this.consumeLocation(ctx.Items, result);

    return result;
  }

  addChildLocation(childs, result) {
    childs.forEach((item) => {
      for (const [key, value] of Object.entries(item.Координаты)) {
        this.consumeLocationInResult(
          result,
          key,
          value["Лево"],
          value["Право"]
        );
      }
    });
  }

  consumeLocation(tokens, result) {
    tokens.forEach((token) => {
      let rowId = "Строка_" + token.startLine.toString();
      this.consumeLocationInResult(
        result,
        rowId,
        token.startColumn,
        token.endColumn
      );
    });
  }

  consumeLocationInResult(result, rowId, startColumn, endColumn) {
    let row = result.Координаты[rowId];
    if (row === undefined) {
      result.Координаты[rowId] = {
        Лево: startColumn,
        Право: endColumn,
      };
    } else if (endColumn > row["Право"]) {
      row["Право"] = endColumn;
    } else {
      row["Лево"] = startColumn;
    }
  }
}

export const visitor = new Visitor();
