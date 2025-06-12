import { CstChildrenDictionary, CstElement, CstNode, IToken } from "chevrotain"
import { parser } from "./parser"
import {
  FormElement,
  InputElement,
  CheckboxElement,
  CommandBarElement,
  ButtonElement,
  ButtonGroupElement,
  TableElement,
  TableColumnElement,
  BaseFormElement,
  LabelElement,
  TableEmptyElement,
  TableCellElement,
  TableColumnGroupElement,
  TableHeaderElement,
  PagesElement,
  PageElement,
  HorizontalGroupElement,
  VerticalGroupElement,
  TypeDescription,
  OneLineGroupElement,
  EditorContainerElement,
} from "./visitorTools/formElements"
import { CommandBarManager } from "./visitorTools/commandBarManager"
import { TableManager, TableRowType } from "./visitorTools/tableManager"
import { TypesUtils } from "./visitorTools/typesUtuls"
import { SemanticTokensManager, SemanticTokensTypes } from "./visitorTools/sematicTokensManager"
import { NameGenerator } from "./visitorTools/nameGenerator"
import { HorizontalGroupDictionary, PagesDictionary } from "./nodes"

const BaseVisitor = parser.getBaseCstVisitorConstructor()

export class Visitor extends BaseVisitor {
  private readonly semanticTokensManager: SemanticTokensManager = new SemanticTokensManager()
  private readonly nameGenerator: NameGenerator = new NameGenerator()

  constructor(semanticTokensManager: SemanticTokensManager, ...args: any) {
    super(args)
    this.semanticTokensManager = semanticTokensManager
  }
  // #region form

  editorContainer(ctx: CstChildrenDictionary): EditorContainerElement {
    const result = new EditorContainerElement()

    result.add("items", this.visitAll(ctx.Items as CstNode[]))

    return result
  }

  form(ctx: CstChildrenDictionary): FormElement {
    this.nameGenerator.reset()
    const result = new FormElement()

    result.add("items", this.visitAll(ctx.Items as CstNode[]))

    this.visit(ctx.formHeader as CstNode[], { element: result })

    this.semanticTokensManager.add(SemanticTokensTypes.FormHeader, ctx.formHeader as CstNode[], result, ["properties"])

    this.semanticTokensManager.prepare()

    return result
  }

  formHeader(ctx: CstChildrenDictionary, params: { element: FormElement }): void {
    let header = this.joinTokens(ctx.HeaderText)
    if (header) {
      this.setProperty(params.element, "Заголовок", header)
    }
    this.visit(ctx.properties as CstNode[], { element: params.element })

    this.semanticTokensManager.add(SemanticTokensTypes.Properties, ctx.properties as CstNode[], params.element)
  }
  // #endregion

  // #region pages

  pages(ctx: PagesDictionary): PagesElement {
    const result = new PagesElement()

    this.visit(ctx.properties, { element: result })

    result.add("items", this.visitAll(ctx.Items))

    return result
  }

  page(ctx: CstChildrenDictionary): PageElement {
    const result = new PageElement()

    const pageHeader = ctx.PageHeader[0] as CstNode

    let header = this.joinTokens(pageHeader.children.PageHeaderText)
    this.setProperty(result, "Заголовок", header)

    this.visit(pageHeader.children.properties as CstNode[], { element: result })

    result.add("items", this.visitAll(ctx.Items as CstNode[]))

    let headerTokens = [...(pageHeader.children.PageHeaderText ?? []), ...(pageHeader.children.Slash ?? [])]
    this.semanticTokensManager.add(SemanticTokensTypes.PageHeader, headerTokens, result)
    this.semanticTokensManager.add(SemanticTokensTypes.Properties, pageHeader.children.properties, result)

    return result
  }

  // #endregion

  // #region groups

  horizontalGroup(ctx: HorizontalGroupDictionary): HorizontalGroupElement {
    const result = new HorizontalGroupElement()

    this.visit(ctx.properties, { element: result })

    result.add("items", this.visitAll(ctx.Items))

    return result
  }

  verticalGroup(ctx: CstChildrenDictionary): VerticalGroupElement {
    const result = new VerticalGroupElement()

    const groupHeader = ctx.GroupHeader[0] as CstNode

    let header = this.joinTokens(groupHeader.children.GroupHeaderText)
    this.setProperty(result, "Заголовок", header)

    this.setGroupDisplayAndBehavior(result, groupHeader)

    this.visit(groupHeader.children.properties as CstNode[], { element: result })

    result.add("items", this.visitAll(ctx.Items as CstNode[]))

    result.defineElementName(this.nameGenerator)

    let headerTokens = [...(groupHeader.children.GroupHeaderText ?? []), ...(groupHeader.children.Hash ?? [])]
    this.semanticTokensManager.add(SemanticTokensTypes.VerticalGroupHeader, headerTokens, result)
    this.semanticTokensManager.add(SemanticTokensTypes.Properties, groupHeader.children.properties, result)

    return result
  }

  private setGroupDisplayAndBehavior(verticalGroup: VerticalGroupElement, groupHeader: CstNode): void {
    const hash = this.joinTokens(groupHeader.children.Hash)

    const count = hash?.length ?? 1

    let currentDisplay = undefined
    let currentBehavior = undefined

    if (count === 2) {
      currentDisplay = "СлабоеВыделение"
    } else if (count === 3) {
      currentDisplay = "ОбычноеВыделение"
    } else if (count === 4) {
      currentDisplay = "СильноеВыделение"
    } else if (count === 5) {
      currentDisplay = "ОбычноеВыделение"
      currentBehavior = "Свертываемая"
    } else if (count === 6) {
      currentDisplay = "ОбычноеВыделение"
      currentBehavior = "Всплывающая"
    }

    if (currentDisplay) {
      this.setProperty(verticalGroup, "Отображение", currentDisplay)
    }

    if (currentBehavior) {
      this.setProperty(verticalGroup, "Поведение", currentBehavior)
    }
  }

  oneLineGroup(ctx: CstChildrenDictionary): OneLineGroupElement {
    const result = new OneLineGroupElement()

    this.visit(ctx.properties as CstNode[], { element: result })

    result.add("items", this.visitAll(ctx.Items as CstNode[]))

    this.semanticTokensManager.add(SemanticTokensTypes.Properties, ctx.properties, result)

    return result
  }

  // #endregion

  // #region field

  field(ctx: CstChildrenDictionary): BaseFormElement {
    const firstKey = Object.keys(ctx)[0]
    const firstValue = ctx[firstKey as keyof typeof ctx]
    return this.visit(firstValue as CstNode[])
  }

  // #endregion

  // #region labelField

  labelField(ctx: CstChildrenDictionary): LabelElement {
    const result = new LabelElement()

    this.setAligment(ctx, result)

    let content = this.joinTokens(ctx.LabelContent)
    this.setProperty(result, "Заголовок", content)

    this.visit(ctx.properties as CstNode[], { element: result })

    result.defineElementName(this.nameGenerator)

    this.semanticTokensManager.add(SemanticTokensTypes.LableHeader, ctx.LabelContent as CstNode[], result)
    this.semanticTokensManager.add(SemanticTokensTypes.Properties, ctx.properties as CstNode[], result)

    return result
  }

  // #endregion

  // #region inputField

  inputField(ctx: CstChildrenDictionary): InputElement {
    const result = new InputElement()

    this.setAligment(ctx, result)

    let header = this.joinTokens(ctx.InputHeader)
    this.setProperty(result, "Заголовок", header)

    let content = this.joinTokens(ctx.InputValue)
    if (content) {
      result.value = content
    }

    let height: number = ctx.inputFieldMultiline?.length ?? 0

    if (height > 0) {
      this.setProperty(result, "МногострочныйРежим", true)
      this.setProperty(result, "Высота", height + 1)
    }

    result.typeDescription = this.getTypeByContent(content)

    let modifiers = this.joinTokens(ctx.InputModifiers)
    this.addInputModifiers(modifiers, result)

    this.visit(ctx.properties as CstNode[], { element: result })

    result.defineElementName(this.nameGenerator)

    this.semanticTokensManager.add(SemanticTokensTypes.InputHeader, ctx.InputHeader as CstNode[], result)
    let inputValueTokens = [...(ctx.InputValue ?? []), ...(ctx.InputModifiers ?? [])]
    this.semanticTokensManager.add(SemanticTokensTypes.InputValue, inputValueTokens, result)
    this.semanticTokensManager.add(SemanticTokensTypes.InputMultiline, ctx.inputFieldMultiline, result)
    this.semanticTokensManager.add(SemanticTokensTypes.Properties, ctx.properties as CstNode[], result)

    return result
  }

  addInputModifiers(modifiers: string | undefined, elementData: InputElement): void {
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

    for (const element of modifiers) {
      const key = element.toLowerCase()
      if (propertyMap[key]) {
        this.setProperty(elementData, propertyMap[key], true)
      }
    }
  }

  // #endregion

  // #region checkboxLeftField

  checkboxLeftField(ctx: CstChildrenDictionary): CheckboxElement {
    return this.checkboxCommonField(ctx, true)
  }

  checkboxRightField(ctx: CstChildrenDictionary): CheckboxElement {
    return this.checkboxCommonField(ctx, false)
  }

  private checkboxCommonField(ctx: CstChildrenDictionary, left: boolean): CheckboxElement {
    const result = new CheckboxElement()
    if (left) {
      this.setProperty(result, "ПоложениеЗаголовка", "Право")
    }

    if (ctx.CheckboxChecked || ctx.SwitchChecked) {
      result.value = true
    }

    if (ctx.SwitchChecked || ctx.SwitchUnchecked) {
      this.setProperty(result, "ВидФлажка", "Выключатель")
    }

    this.setAligment(ctx, result)

    let content = this.joinTokens(ctx.CheckboxHeader)
    this.setProperty(result, "Заголовок", content)

    this.visit(ctx.properties as CstNode[], { element: result })

    result.defineElementName(this.nameGenerator)

    let checkboxTokens = [
      ...(ctx.CheckboxChecked ?? []),
      ...(ctx.CheckboxUnchecked ?? []),
      ...(ctx.SwitchChecked ?? []),
      ...(ctx.SwitchUnchecked ?? []),
      ...(ctx.CheckboxHeader ?? []),
    ]
    this.semanticTokensManager.add(SemanticTokensTypes.Checkbox, checkboxTokens, result)

    this.semanticTokensManager.add(SemanticTokensTypes.Properties, ctx.properties as CstNode[], result)

    return result
  }
  // #endregion

  // #region commandBar

  commandBar(ctx: CstChildrenDictionary): CommandBarElement {
    const result = new CommandBarElement()

    this.setAligment(ctx, result)

    this.visit(ctx.properties as CstNode[], { element: result })
    result.defineElementName(this.nameGenerator)

    let items = this.visitAll(ctx.buttonGroup)

    const manager = new CommandBarManager(result)
    manager.addButtonGroups(items)

    this.visitAll(ctx.commandBarLine as CstNode[], { manager: manager })

    this.semanticTokensManager.add(SemanticTokensTypes.CommandBarSeparator, ctx.LAngle, result)
    this.semanticTokensManager.add(SemanticTokensTypes.CommandBarSeparator, ctx.RAngle, result)
    this.semanticTokensManager.add(SemanticTokensTypes.CommandBarSeparator, ctx.ButtonGroup, result)

    // this.addChildLocation(result.items, result)

    return result
  }

  buttonGroup(ctx: CstChildrenDictionary): ButtonGroupElement {
    const result = new ButtonGroupElement()
    result.defineElementName(this.nameGenerator)

    result.add("items", this.visitAll(ctx.button, { line: false }))

    this.semanticTokensManager.add(SemanticTokensTypes.CommandBarSeparator, ctx.VBar as CstNode[], result)

    return result
  }

  commandBarLine(ctx: CstChildrenDictionary, params: { manager: CommandBarManager }): void {
    const dots = this.joinTokens(ctx.Dots)
    const level = dots ? dots.length : 0

    if (!ctx.button) {
      const separator = new ButtonGroupElement()
      params.manager.addButton(separator, level)
      return
    }

    const button = this.visit(ctx.button as CstNode[], { line: true })
    params.manager.addButton(button, level)
  }

  button(ctx: CstChildrenDictionary, params: { line: boolean }): ButtonElement {
    const result = new ButtonElement()

    let header = this.joinTokens(ctx.Button)
    this.setProperty(result, "Заголовок", header)

    if (ctx.leftPicture) {
      let picture = this.joinTokens(ctx.leftPicture)
      if (picture) {
        picture = picture.substring(1)
        this.setProperty(result, "Картинка", picture)
      }
    } else if (ctx.rightPicture) {
      let picture = this.joinTokens(ctx.rightPicture)
      if (picture) {
        picture = picture.substring(1)
        this.setProperty(result, "Картинка", picture)
        this.setProperty(result, "ПоложениеКартинки", "Право")
      }
    }

    this.visit(ctx.properties as CstNode[], { element: result })
    result.defineElementName(this.nameGenerator)

    this.semanticTokensManager.add(SemanticTokensTypes.Properties, ctx.properties as CstNode[], result)

    let buttonTokens = [...(ctx.Button ?? []), ...(ctx.leftPicture ?? []), ...(ctx.rightPicture ?? [])]
    const buttontype = params.line ? SemanticTokensTypes.LineButton : SemanticTokensTypes.Button
    this.semanticTokensManager.add(buttontype, buttonTokens, result)

    return result
  }

  // #endregion

  // #region table

  table(ctx: CstChildrenDictionary): TableElement {
    const result = new TableElement()
    result.defineElementName(this.nameGenerator)

    const manager = new TableManager(result)

    for (const line of ctx.tableLine) {
      this.visit(line as CstNode, { manager: manager })
    }

    manager.defineColumnsTypeDescription()

    return result
  }

  tableLine(ctx: { tableCell: []; VBar: [] }, params: { manager: TableManager }): void {
    params.manager.defineRowType(ctx.tableCell as CstNode[])

    this.visitAll(ctx.tableCell, { manager: params.manager })

    this.semanticTokensManager.add(SemanticTokensTypes.TableSeparator, ctx.VBar, params.manager.getTableElement())

    params.manager.nextRow()
  }

  tableCell(ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    const rowType = params.manager.getRowType()

    if (rowType == TableRowType.Header) {
      this.tableHeaderNode(ctx, { manager: params.manager })
      return
    }

    if (rowType == TableRowType.Separator) {
      this.tableSeparatorNode(ctx, { manager: params.manager })
      return
    }

    this.tableCellNode(ctx, { manager: params.manager })
  }

  tableHeaderNode(ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    if (params.manager.isEmptyNode(ctx)) {
      this.tableEmptyColumnNode(ctx, { manager: params.manager })
      return
    }

    this.tableColumnNode(ctx, { manager: params.manager })
  }

  tableEmptyColumnNode(_ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    params.manager.addHeaderElement(new TableEmptyElement())
  }

  tableColumnNode(ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    const data = (ctx.tableDataCell[0] as CstNode).children

    let result: TableHeaderElement = new TableColumnElement()

    let content = this.joinTokens(data.TableCell)
    const isColumnGroup = /^-+.*-+$/.test(content ?? "")

    if (isColumnGroup) {
      result = new TableColumnGroupElement()
      content = content?.slice(1, -1)
    }

    this.setProperty(result, "Заголовок", content)

    this.visit(ctx.properties as CstNode[], { element: result })

    result.defineElementName(this.nameGenerator)

    params.manager.addHeaderElement(result)

    this.semanticTokensManager.add(SemanticTokensTypes.Properties, data.properties as CstNode[], result)
    this.semanticTokensManager.add(SemanticTokensTypes.TableColumn, data.TableCell, result)
  }

  tableSeparatorNode(ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    const column = params.manager.addSeparator(ctx)
    if (!column) return

    if (!ctx.tableSeparatorCell || ctx.tableSeparatorCell.length == 0) return

    const data = (ctx.tableSeparatorCell[0] as CstNode).children

    const hasLeft = !!data.leftColon
    const hasRight = !!data.rightColon

    if (hasLeft && !hasRight) {
      this.setProperty(column, "ГоризонтальноеПоложение", "Лево")
      return
    }

    if (hasLeft && hasRight) {
      this.setProperty(column, "ГоризонтальноеПоложение", "Центр")
      return
    }

    if (!hasLeft && hasRight) {
      this.setProperty(column, "ГоризонтальноеПоложение", "Право")
    }

    let tokens = [...(data.leftColon ?? []), ...(data.Dashes ?? []), ...(data.rightColon ?? [])]
    this.semanticTokensManager.add(SemanticTokensTypes.TableSeparator, tokens, column)
  }

  tableCellNode(ctx: CstChildrenDictionary, params: { manager: TableManager }): void {
    const data = (ctx.tableDataCell[0] as CstNode).children

    const dots = this.joinTokens(data.Dots)
    const level = dots ? dots.length : 0

    const result = new TableCellElement()

    const content = this.joinTokens(data.TableCell)
    result.value = content ?? ""

    if (data.CheckboxChecked) {
      result.hasCheckbox = true
      result.valueCheckbox = true
    }

    if (data.CheckboxUnchecked) {
      result.hasCheckbox = true
      result.valueCheckbox = false
    }

    this.visit(data.properties as CstNode[], { element: result })

    let cellTokens = [
      ...(ctx.Dots ?? []),
      ...(ctx.CheckboxUnchecked ?? []),
      ...(ctx.CheckboxChecked ?? []),
      ...(ctx.TableCell ?? []),
    ]
    this.semanticTokensManager.add(SemanticTokensTypes.Properties, data.properties as CstNode[], result)
    this.semanticTokensManager.add(SemanticTokensTypes.TableCell, cellTokens, result)

    params.manager.addRowElement(result, level)
  }

  // #region properties

  propertyLine(ctx: CstChildrenDictionary): void {
    this.visit(ctx.properties as CstNode[])
  }

  properties(ctx: CstChildrenDictionary, params: { element: FormElement }): void {
    const properties = this.visitAll(ctx.property as CstNode[])

    for (const property of properties as { key: string; value: { value: string; options: any }[] }[]) {
      if (params.element instanceof InputElement && property.key.toLowerCase() == "тип") {
        ;(params.element as InputElement).typeDescription = this.getTypeDescription(property.value)
        continue
      }

      let value = property.value.map((info: any) => info.value).join()

      this.setProperty(params.element, property.key, value)
    }
  }

  property(ctx: CstChildrenDictionary): { key: string; value: string } {
    return {
      key: this.joinTokens(ctx.PropertiesNameText) ?? "",
      value: this.visitAll(ctx.propertyValues) ?? "",
    }
  }

  propertyValues(ctx: CstChildrenDictionary): any {
    const value = this.joinTokens(ctx.PropertiesValueText)
    const options = this.visitAll(ctx.propertyValueOption)

    return { value: value, options: options }
  }

  propertyValueOption(ctx: CstChildrenDictionary): any {
    return this.joinTokens(ctx.PropertiesValueOptionText)
  }

  private setProperty(element: BaseFormElement, key: string, value: string | number | boolean | undefined) {
    const properties = element.properties
    const lowerKey = key.toLowerCase()

    for (const prop in properties) {
      if (prop.toLowerCase() === lowerKey) {
        delete properties[prop]
      }
    }

    properties[key] = value
  }

  private getTypeDescription(types: any): TypeDescription {
    const result = new TypeDescription()
    result.auto = false

    const typeProcessors: { [key: string]: (typeInfo: any) => void } = {
      число: (typeInfo) => this.processNumberType(result, typeInfo),
      строка: (typeInfo) => this.processStringType(result, typeInfo),
      дата: (typeInfo) => this.processDateType(result, typeInfo),
    }

    for (let typeInfo of types) {
      let type = typeInfo.value
      let typeLowerCase = type.toLowerCase()

      result.types.push(type)

      const processor = typeProcessors[typeLowerCase]
      if (processor) {
        processor(typeInfo)
      }
    }

    return result
  }

  private processNumberType(result: TypeDescription, typeInfo: any): void {
    let options = typeInfo.options
    if (options && options.length > 0) {
      result.digits = parseInt(options[0])
    }
    if (options && options.length > 1) {
      result.fractionDigits = parseInt(options[1])
    }
  }

  private processStringType(result: TypeDescription, typeInfo: any): void {
    let options = typeInfo.options
    if (options && options.length > 0) {
      result.length = parseInt(options[0])
    }
  }

  private processDateType(result: TypeDescription, typeInfo: any): void {
    let options = typeInfo.options
    if (options && options.length > 0) {
      result.dateFractions = options[0]
    }
  }

  // #endregion

  // #region utils

  private setAligment(ctx: CstChildrenDictionary, element: BaseFormElement): void {
    //-> *
    if (ctx.leftArrowRight) {
      //-> * <-
      if (ctx.rightArrowLeft) {
        this.setProperty(element, "ГоризонтальноеПоложениеВГруппе", "Центр")
        return
      }
      this.setProperty(element, "ГоризонтальноеПоложениеВГруппе", "Право")
      return
    }

    //  * ->
    if (ctx.rightArrowRight) {
      this.setProperty(element, "РастягиватьПоГоризонтали", true)
    }
  }

  private getTypeByContent(content: string | undefined): TypeDescription {
    return TypesUtils.getTypeByContent(content)
  }

  private visitAll(ctx: CstElement[], param?: any): any {
    if (!ctx) {
      return []
    }
    return (ctx as CstNode[]).map((item) => this.visit(item, param))
  }

  private joinTokens(tokens: CstElement[]): string | undefined {
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
