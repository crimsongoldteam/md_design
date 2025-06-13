import { FormFormatter, IFormatter } from "./formFormatter"
import { InputFormatter } from "./inputFormatter"
import { LabelFormatter } from "./labelFormatter"
import { HorizontalGroupFormatter } from "./horizontalGroupFormatter"
import { VerticalGroupFormatter } from "./verticalGroupFormatter"
import { PropertiesFormatter } from "./propertiesFormatter"
import { CheckboxFormatter } from "./checkboxFormatter"
import { PageFormatter } from "./pageFormatter"
import { PagesFormatter } from "./pagesFormatter"
import { CommandBarFormatter } from "./commandBarFormatter"
import { ButtonFormatter } from "./buttonFormatter"
import { ButtonGroupFormatter } from "./buttonGroupFormatter"
import { TableFormatter } from "./table/tableFormatter"
import { TableCellFormatter } from "./table/tableCellFormatter"
import { TableColumnFormatter } from "./table/tableColumnFormatter"
import { OneLineGroupFormatter } from "./oneLineGroupFormatter"
import { EditorContainerFormatter } from "./editorContainerFormatter"
import { BaseElement } from "../elements/baseElement"
import { FormElement } from "../elements/formElement"
import { InputElement } from "../elements/inputElement"
import { LabelElement } from "../elements/labelElement"
import { HorizontalGroupElement } from "../elements/horizontalGroupElement"
import { VerticalGroupElement } from "../elements/verticalGroupElement"
import { CheckboxElement } from "../elements/checkboxElement"
import { PagesElement } from "../elements/pagesElement"
import { PageElement } from "../elements/pageElement"
import { CommandBarElement } from "../elements/commandBarElement"
import { ButtonElement } from "../elements/buttonElement"
import { ButtonGroupElement } from "../elements/buttonGroupElement"
import { TableElement } from "../elements/tableElement"
import { TableColumnElement } from "../elements/tableColumnElement"
import { TableColumnGroupElement } from "../elements/tableColumnGroupElement"
import { TableCellElement } from "../elements/tableCellElement"
import { OneLineGroupElement } from "../elements/oneLineGroupElement"
import { EditorContainerElement } from "../elements/editorContainerElement"

export class FormFormatterFactory {
  private static readonly formatters = new Map<typeof BaseElement, new () => IFormatter<BaseElement>>()

  public static initialize(): void {
    this.registerFormatter(FormElement, FormFormatter)
    this.registerFormatter(InputElement, InputFormatter)
    this.registerFormatter(LabelElement, LabelFormatter)
    this.registerFormatter(HorizontalGroupElement, HorizontalGroupFormatter)
    this.registerFormatter(VerticalGroupElement, VerticalGroupFormatter)
    this.registerFormatter(CheckboxElement, CheckboxFormatter)
    this.registerFormatter(PagesElement, PagesFormatter)
    this.registerFormatter(PageElement, PageFormatter)
    this.registerFormatter(CommandBarElement, CommandBarFormatter)
    this.registerFormatter(ButtonElement, ButtonFormatter)
    this.registerFormatter(ButtonGroupElement, ButtonGroupFormatter)
    this.registerFormatter(TableElement, TableFormatter)
    this.registerFormatter(TableColumnElement, TableColumnFormatter)
    this.registerFormatter(TableColumnGroupElement, TableColumnFormatter)
    this.registerFormatter(TableCellElement, TableCellFormatter)
    this.registerFormatter(OneLineGroupElement, OneLineGroupFormatter)
    this.registerFormatter(EditorContainerElement, EditorContainerFormatter)
  }

  public static registerFormatter(
    elementKind: typeof BaseElement,
    formatterCtor: new () => IFormatter<BaseElement>
  ): void {
    this.formatters.set(elementKind, formatterCtor)
  }

  public static getFormatter(element: BaseElement): IFormatter<BaseElement> {
    const FormatterCtor = this.formatters.get(element.constructor as typeof BaseElement)
    if (!FormatterCtor) {
      throw new Error(`Formatter for ${element.constructor.name} not found`)
    }
    return new FormatterCtor()
  }

  public static getPropertiesFormatter(): PropertiesFormatter {
    return new PropertiesFormatter()
  }
}

FormFormatterFactory.initialize()
