import { CstPath } from "./elements/cstPathHelper"
import { elementsManager } from "./elementsManager"
import { ElementPathData } from "./elementPathData"
import { CSTModel } from "./editor/cstModel"
import { GroupCursorBuilder, GroupCursorFormatter } from "./editor/groupCursorHelpers"
import { MainCursorBuilder, MainCursorFormatter } from "./editor/mainCursor"
import { ModelCursor } from "./editor/modelCursorHelpers"
import { IApplication, IView } from "./interfaces"
import { IBaseElement } from "./elements/interfaces"
import { ICSTModel, IElementPathData, IModelCursor } from "./editor/interfaces"
import { View } from "./view"
import { TableElement } from "./elements"

export class Application implements IApplication {
  private readonly model: ICSTModel
  private readonly mainCursor: IModelCursor
  private readonly groupCursor: IModelCursor

  private readonly view: IView

  constructor(mainEditorContainer: HTMLElement, groupEditorContainer: HTMLElement) {
    this.model = new CSTModel()
    this.model.onChangeContent = this.onChangeModelContent.bind(this)

    this.mainCursor = new ModelCursor(this.model, new MainCursorBuilder(), new MainCursorFormatter())
    this.mainCursor.onSelectElement = this.onSelectElementMainCursor.bind(this)
    this.model.registerCursor(this.mainCursor)

    this.groupCursor = new ModelCursor(this.model, new GroupCursorBuilder(), new GroupCursorFormatter())
    this.groupCursor.onSelectElement = this.onSelectElementGroupCursor.bind(this)

    this.view = new View(mainEditorContainer, groupEditorContainer, this.mainCursor, this.groupCursor)
    this.view.onCloseGroup = this.onCloseGroup.bind(this)
    this.view.onSelectGroup = this.onSelectGroup.bind(this)
  }
  // region events

  public onChangeContent: (cst: IBaseElement | undefined) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  public onSelectElement: (currentElement: IElementPathData | undefined) => void = () => {
    throw new Error("onSelectElement is not implemented")
  }
  // endregion events

  getCst(): IBaseElement {
    return this.model.cst
  }

  public insertText(text: string): void {
    this.view.currentEditor.insertText(text)
  }

  public formatText(): void {
    this.currentCursor.format(true)
  }

  public getText(): string {
    return this.mainCursor.text
  }

  public setText(text: string): void {
    this.mainCursor.text = text
  }

  public getTableData(): IElementPathData {
    const cursor = this.currentCursor

    let table = cursor.getCurrentTableElement()
    let path: CstPath = []

    const isNew = table === undefined
    if (table) {
      path = table.getCstPath()
    } else {
      table = new TableElement()
      const element = cursor.getCurrentElement()
      path = element.getCstPath()
    }

    const result = new ElementPathData(table, path, isNew)

    return result
  }

  getNewValue(type: string): IBaseElement {
    return elementsManager.getNewValue(type)
  }

  public createOrUpdateElement(data: ElementPathData): void {
    this.model.createOrUpdateElement(data)
  }

  private onSelectElementMainCursor(currentElement: IElementPathData | undefined): void {
    this.onSelectElement(currentElement)
  }

  private onSelectElementGroupCursor(currentElement: IElementPathData | undefined): void {
    this.onSelectElement(currentElement)
  }

  private get currentCursor(): IModelCursor {
    return this.view.currentCursor
  }

  private onCloseGroup(): void {
    this.model.unregisterCursor(this.groupCursor)
  }

  private onSelectGroup(group: IElementPathData): void {
    this.model.registerCursor(this.groupCursor)
    this.groupCursor.path = group.path
  }

  private onChangeModelContent(cst: IBaseElement | undefined): void {
    this.onChangeContent(cst)
  }
}
