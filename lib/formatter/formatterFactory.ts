import {
  BaseFormElement,
  ButtonElement,
  ButtonGroupElement,
  CheckboxElement,
  CommandBarElement,
  FormElement,
  HorizontalGroupElement,
  InputElement,
  LabelElement,
  PageElement,
  PagesElement,
  TableCellElement,
  TableColumnElement,
  TableColumnGroupElement,
  TableElement,
  VerticalGroupElement,
} from "../parser/visitorTools/formElements"
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

export class FormFormatterFactory {
  private static readonly formatters = new Map<typeof BaseFormElement, new () => IFormatter<BaseFormElement>>()

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
  }

  public static registerFormatter(
    elementKind: typeof BaseFormElement,
    formatterCtor: new () => IFormatter<BaseFormElement>
  ): void {
    this.formatters.set(elementKind, formatterCtor)
  }

  public static getFormatter(element: BaseFormElement): IFormatter<BaseFormElement> {
    const FormatterCtor = this.formatters.get(element.constructor as typeof BaseFormElement)
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
