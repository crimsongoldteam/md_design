import {
  BaseFormElement,
  CheckboxElement,
  HorizontalGroupElement,
  InputElement,
  LabelElement,
  VerticalGroupElement,
} from "../parser/visitorTools/formElements"
import { IFormatter } from "./formFormatter"
import { InputFormatter } from "./inputFormatter"
import { LabelFormatter } from "./labelFormatter"
import { HorizontalGroupFormatter } from "./horizontalGroupFormatter"
import { VerticalGroupFormatter } from "./verticalGroupFormatter"
import { PropertiesFormatter } from "./propertiesFormatter"
import { CheckboxFormatter } from "./checkboxFormatter"

export class FormFormatterFactory {
  private static readonly formatters = new Map<typeof BaseFormElement, new () => IFormatter<BaseFormElement>>()

  public static initialize(): void {
    this.registerFormatter(InputElement, InputFormatter)
    this.registerFormatter(LabelElement, LabelFormatter)
    this.registerFormatter(HorizontalGroupElement, HorizontalGroupFormatter)
    this.registerFormatter(VerticalGroupElement, VerticalGroupFormatter)
    this.registerFormatter(CheckboxElement, CheckboxFormatter)
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
