import { ButtonElement } from "@/elements/index"
import * as t from "../parser/lexer"
import { FormFormatterFactory } from "./formatterFactory"
import { IFormatter } from "./formFormatter"

export class ButtonFormatter implements IFormatter<ButtonElement> {
  public format(element: ButtonElement): string[] {
    if (element.elementKind === "ГруппаКнопок") {
      return [" " + (t.VBar.LABEL as string)]
    }

    const excludeProperties = ["Заголовок", "Картинка", "ПоложениеКартинки"]

    const propertiesFormatter = FormFormatterFactory.getPropertiesFormatter()
    const properties = propertiesFormatter.format(element, { excludeProperties })

    const result = this.getCaption(element) + properties

    return [result]
  }

  private getCaption(element: ButtonElement, isMenu = false): string {
    let textPicture: string | undefined = element.getProperty("Картинка") as string | undefined
    let textTitle = element.getProperty("Заголовок") as string | undefined
    const picturePosition = element.getProperty("ПоложениеКартинки") ?? "Лево"

    if (textPicture) {
      textPicture = "@" + textPicture
    }

    if (isMenu && textTitle) {
      textPicture = undefined
    }

    if (textPicture === undefined) {
      return textTitle ?? ""
    }

    if (picturePosition === "Лево") {
      return textPicture + " " + textTitle
    }

    return textTitle + " " + textPicture
  }
}
