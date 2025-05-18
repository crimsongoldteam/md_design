import { CstChildrenDictionary, CstElement, CstNode, IToken } from "chevrotain"
import { parser } from "./parser"
import {
  FormItem,
  InputItem,
  CheckboxItem,
  CommandBarItem,
  ButtonItem,
  ButtonGroupItem,
  TableItem,
  TableColumnItem,
} from "./formExport"
import { CommandBarManager } from "./commandBarManager"
import { TableManager } from "./tableManager"

const BaseVisitor = parser.getBaseCstVisitorConstructor()

export class Visitor extends BaseVisitor {
  // #region form

  form(ctx: CstChildrenDictionary): FormItem {
    const result = new FormItem("Форма", "Форма", "БезВида")

    result.items = this.visit(ctx.Items as CstNode[])

    return result
  }

  // #endregion

  field(ctx: CstChildrenDictionary): FormItem {
    const firstKey = Object.keys(ctx)[0]
    const firstValue = ctx[firstKey as keyof typeof ctx]
    return this.visit(firstValue as CstNode[])
  }

  // #region labelField

  labelField(ctx: CstChildrenDictionary): FormItem {
    const result = new FormItem("Надпись", "ДекорацияФормы", "Надпись")

    let content = this.joinTokens(ctx.LabelContent)
    this.setProperty(result, "Заголовок", content)

    this.visit(ctx.properties as CstNode[], { element: result })

    return result
  }

  // #endregion

  // #region inputField

  inputField(ctx: CstChildrenDictionary): FormItem {
    const result = new InputItem()

    let header = this.joinTokens(ctx.InputHeader)
    this.setProperty(result, "Заголовок", header)

    let content = this.joinTokens(ctx.InputValue)
    this.setProperty(result, "Значение", content)

    let modifiers = this.joinTokens(ctx.InputModifiers)
    this.addInputModifiers(modifiers, result)

    this.visit(ctx.properties as CstNode[], { element: result })

    return result
  }

  addInputModifiers(modifiers: string | undefined, elementData: FormItem): void {
    if (modifiers === undefined) {
      return
    }

    const propertyMap: { [key: string]: string } = {
      с: "КнопкаВыпадающегоСписка",
      в: "КнопкаВыбора",
      х: "КнопкаОчистки",
      x: "КнопкаОчистки",
      д: "КнопкаРегулирования",
      о: "КнопкаОткрытия",
      o: "КнопкаОткрытия",
    }

    for (let i = 0; i < modifiers.length; i++) {
      const key = modifiers[i].toLowerCase()
      if (propertyMap[key]) {
        this.setProperty(elementData, propertyMap[key], true)
      }
    }
  }

  // #endregion

  // #region checkboxLeftField

  checkboxLeftField(ctx: CstChildrenDictionary): FormItem {
    return this.checkboxCommonField(ctx, true)
  }

  checkboxRightField(ctx: CstChildrenDictionary): FormItem {
    return this.checkboxCommonField(ctx, false)
  }

  private checkboxCommonField(ctx: CstChildrenDictionary, left: boolean): FormItem {
    const result = new CheckboxItem()
    if (left) {
      this.setProperty(result, "ПоложениеЗаголовка", "Право")
    }

    if (ctx.CheckboxChecked || ctx.SwitchChecked) {
      result.value = true
    }

    if (ctx.SwitchChecked || ctx.SwitchUnchecked) {
      this.setProperty(result, "ВидФлажка", "Выключатель")
    }

    let content = this.joinTokens(ctx.CheckboxHeader)
    this.setProperty(result, "Заголовок", content)

    this.visit(ctx.properties as CstNode[], { element: result })

    return result
  }
  // #endregion

  // #region commandBar

  commandBar(ctx: CstChildrenDictionary): CommandBarItem {
    const result = new CommandBarItem()
    let items = this.visitAll(ctx.buttonGroup)

    const manager = new CommandBarManager(result)
    manager.addButtonGroups(items)

    this.visit(ctx.properties as CstNode[], { element: result })

    this.visitAll(ctx.commandBarLine as CstNode[], { manager: manager })

    return result
  }

  buttonGroup(ctx: CstChildrenDictionary): ButtonGroupItem {
    const result = new ButtonGroupItem()
    result.items = this.visitAll(ctx.button)

    return result
  }

  commandBarLine(ctx: CstChildrenDictionary, params: { manager: CommandBarManager }): void {
    const dots = this.joinTokens(ctx.Dots)
    const level = dots ? dots.length : 0

    const button = this.visit(ctx.button as CstNode[])

    params.manager.addButton(button, level)
  }

  button(ctx: CstChildrenDictionary): ButtonItem {
    const result = new ButtonItem()

    let header = this.joinTokens(ctx.Button)
    this.setProperty(result, "Заголовок", header)

    if (ctx.leftPicture) {
      let picture = this.joinTokens(ctx.leftPicture)
      this.setProperty(result, "Картинка", picture)
    } else if (ctx.rightPicture) {
      let picture = this.joinTokens(ctx.rightPicture)
      this.setProperty(result, "Картинка", picture)
      this.setProperty(result, "ПоложениеКартинки", "Право")
    }

    this.visit(ctx.properties as CstNode[], { element: result })

    return result
  }

  // #endregion

  // #region inputField

  table(ctx: CstChildrenDictionary): TableItem {
    const result = new TableItem()

    const manager = new TableManager(result)

    for (const line of ctx.tableLine) {
      this.visit(line as CstNode, { manager: manager })
      manager.endLine()
    }

    return result
  }

  tableLine(ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    this.visitAll(ctx.tableCell as CstNode[], { manager: params.manager })
  }

  tableCell(ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    this.visit(ctx.tableDataCell as CstNode[], { manager: params.manager })
    this.visit(ctx.tableSeparatorCell as CstNode[], { manager: params.manager })
  }

  tableDataCell(ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    // let content = this.joinTokens(ctx.TableCell)
    // const properties = this.visitAll(ctx.property as CstNode[])

    params.manager.addCell(ctx)
  }

  tableSeparatorCell(ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    params.manager.addSeparator()
  }

  // #table

  // #region properties

  properties(ctx: CstChildrenDictionary, params: { element: FormItem }): void {
    const properties = this.visitAll(ctx.property as CstNode[])

    for (const property of properties as { key: string; value: string }[]) {
      this.setProperty(params.element, property.key, property.value)
    }
  }

  property(ctx: CstChildrenDictionary): { key: string; value: string } {
    return {
      key: this.joinTokens(ctx.PropertiesNameText) ?? "",
      value: this.joinTokens(ctx.PropertiesValueText) ?? "",
    }
  }

  // #endregion

  // #region utils

  setProperty(element: FormItem, key: string, value: string | boolean | undefined) {
    const properties = element.properties
    const lowerKey = key.toLowerCase()

    for (const prop in properties) {
      if (prop.toLowerCase() === lowerKey) {
        delete properties[prop]
      }
    }

    properties[key] = value
  }

  visitAll(ctx: CstElement[], param?: any): any {
    return (ctx as CstNode[]).map((item) => this.visit(item, param))
  }

  joinTokens(tokens: CstElement[]): string | undefined {
    if (tokens === undefined) {
      return undefined
    }
    return (tokens as IToken[])
      .map((token) => token.image)
      .join("")
      .trim()
  }

  // #endregion
}

export const visitor = new Visitor()
