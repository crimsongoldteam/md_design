import { BaseElement, ElementListType } from "./baseElement"

export class EditorContainerElement extends BaseElement {
  public readonly items: BaseElement[] = []

  public static readonly childrenFields = [ElementListType.Items]
}
