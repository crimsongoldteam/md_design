import { BaseElementWithoutAttributes } from "./baseElementWithoutAttributes"

export class LabelElement extends BaseElementWithoutAttributes {
  public type = "Надпись"
  public elementType = "ДекорацияФормы"
  public elementKind = "Надпись"

  protected get defaultId(): string {
    return "Надпись"
  }
}
