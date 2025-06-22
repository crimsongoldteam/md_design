import { CstNode } from "chevrotain"
import { AbstractModel } from "./abstractModel"
import { parser } from "../parser/parser"
import { FormElement } from "../elements/formElement"
import { EditorContainerElement } from "../elements/editorContainerElement"
import { VerticalGroupElement } from "../elements/verticalGroupElement"
import { CstPath } from "@/elements/cstPathHelper"
import { InputElement } from "@/elements/inputElement"
import { CheckboxElement } from "@/elements/checkboxElement"
import { FormatterUtils } from "@/formatter/formatterUtils"
import { TableElement } from "@/elements/tableElement"
import { ElementPathData } from "@/application"

export interface TableValueData {
  items: TableValueData[]
  data: { [key: string]: string | boolean | number }
}

export class ValueData {
  [key: string]: string | boolean | number | TableValueData
}

export class FormModel extends AbstractModel<FormElement> {
  constructor() {
    super()
  }

  public onChangeContent: (content: string) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  public updateVerticalGroup(groupPath: CstPath, containerElement: EditorContainerElement) {
    const element = this.findElementByCstPath(groupPath)
    if (element && element instanceof VerticalGroupElement) {
      element.items.length = 0
      element.items.push(...containerElement.items)
    }
    this.format()
  }

  public createOrUpdateElement(data: ElementPathData) {
    if (data.isNew) {
      this.createElement(data)
    } else {
      this.updateElement(data)
    }
    this.format()
  }

  private createElement(data: ElementPathData) {
    if (data.item instanceof FormElement) throw new Error("FormElement cannot be created")

    const parentPath = this.cst.getInContainerPosition(data.path)
    const parent = parentPath.parent
    const list = parent.getList(parentPath.parentList)
    if (!list) throw new Error("List not found")

    if (parentPath.parentListIndex > list.length) {
      list.push(data.item)
    } else {
      list.splice(parentPath.parentListIndex, 0, data.item)
    }
    data.item.parent = parent
    data.item.parentList = parentPath.parentList
  }

  private updateElement(data: ElementPathData) {
    if (data.item instanceof FormElement) {
      this.cst = data.item
      return
    }

    const element = this.cst.getElementPosition(data.item, data.path)
    if (!element) return

    const parent = element.parent

    const list = parent.getList(element.parentList)
    if (!list) throw new Error("List not found")

    list[element.parentListIndex] = data.item
    data.item.parent = parent
    data.item.parentList = element.parentList
  }

  public setValues(data: ValueData): void {
    for (const key in data) {
      const value = data[key]
      this.setValue(key, value)
    }
    this.format()
  }

  public setValue(key: string, value: string | boolean | number | Date | TableValueData): void {
    const element = this.elementMap.get(key)
    if (!element) {
      return
    }

    const isPrimitive =
      typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value instanceof Date

    if (element instanceof InputElement && isPrimitive) {
      element.value = FormatterUtils.formatValue(value, element.typeDescription)
      return
    }

    if (element instanceof CheckboxElement && typeof value === "boolean") {
      element.value = value
      return
    }

    if (element instanceof TableElement) {
      element.setValues(value as TableValueData)
    }
  }

  protected override parse(): CstNode {
    return parser.parseForm()
  }
}
