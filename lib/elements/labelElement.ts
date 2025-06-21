import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"
import { PlainToClassDiscriminator } from "../importer/plainToClassDiscriminator"

export class LabelElement extends BaseElementWithoutAttributes {
  public type = "Надпись"
  public elementType = "ДекорацияФормы"
  public elementKind = "Надпись"

  protected get defaultId(): string {
    return "Надпись"
  }
}

PlainToClassDiscriminator.addClass(LabelElement, "Надпись")
