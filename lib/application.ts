import { CstPath } from "./elements/cstPathHelper"
import { elementsManager } from "./elementsManager"
import { ElementPathData } from "./elementPathData"
import { CSTModel } from "./editor/cstModel"
import { GroupCursorBuilder, GroupCursorFormatter } from "./editor/groupCursor"
import { MainCursorBuilder, MainCursorFormatter } from "./editor/mainCursor"
import { ModelCursor } from "./editor/modelCursor"
import { IApplication, IView } from "./interfaces"
import { IBaseElement } from "./elements/interfaces"
import { ICSTModel, IElementPathData, IModelCursor } from "./editor/interfaces"
import { View } from "./view"
import { TableElement } from "./elements"

export class Application implements IApplication {
  // private readonly mainEditor: EditorWrapper
  // private readonly groupEditor: EditorWrapper
  private readonly model: ICSTModel
  private readonly mainCursor: IModelCursor
  private readonly groupCursor: IModelCursor
  // private readonly mainEditorContainer: HTMLElement

  private readonly view: IView

  // private groupPath: CstPath | undefined
  // private readonly groupEditorContainer: HTMLElement
  // private currentEditor: EditorWrapper

  constructor(mainEditorContainer: HTMLElement, groupEditorContainer: HTMLElement) {
    this.model = new CSTModel()

    this.mainCursor = new ModelCursor(this.model, new MainCursorBuilder(), new MainCursorFormatter())
    this.model.registerCursor(this.mainCursor)

    this.groupCursor = new ModelCursor(this.model, new GroupCursorBuilder(), new GroupCursorFormatter())

    this.view = new View(mainEditorContainer, groupEditorContainer, this.mainCursor, this.groupCursor)
    this.view.onCloseGroup = this.onCloseGroup.bind(this)
    this.view.onSelectGroup = this.onSelectGroup.bind(this)

    // this.mainEditorContainer = mainEditorContainer
    // this.mainEditor = new EditorWrapper(mainEditorContainer, this.model, this.mainCursor)
    // this.mainEditor.onChangeContent = this.onChangeMainEditorContent.bind(this)
    // this.mainEditor.onChangeCurrentElement = this.onChangeMainEditorCurrentElement.bind(this)

    // this.groupEditorContainer = groupEditorContainer
    // this.groupEditor = new EditorWrapper(groupEditorContainer, this.model, this.groupCursor)
    // this.groupEditor.onChangeContent = this.onChangeGroupEditorContent.bind(this)
    // this.groupEditor.onChangeCurrentElement = this.onChangeGroupEditorCurrentElement.bind(this)

    // monaco.languages.registerLinkProvider("plaintext", {
    //   provideLinks: this.provideLinks.bind(this),
    //   resolveLink: this.resolveLink.bind(this),
    // })

    // this.currentEditor = this.mainEditor

    // this.initSplitter()

    // this.setCurrentGroup(undefined)
  }
  getCst(): IBaseElement {
    return this.model.cst
  }

  // getCreateTable(): TableElement {
  //   const element = this.view.currentCursor.getCurrentTableElement()
  //   if (element) return element

  //   return new TableElement()
  // }

  public onChangeContent: (cst: IBaseElement) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  public onChangeCurrentElement: (currentElement: ElementPathData | undefined) => void = () => {
    throw new Error("onChangeCurrentElement is not implemented")
  }

  public insertText(text: string): void {
    this.view.currentEditor.insertText(text)
  }

  public formatText(): void {
    this.view.currentCursor.format()
  }

  // public getProduction(): any {
  //   return this.model.getProduction()
  // }

  public getText(): string {
    return this.mainCursor.text
  }

  public setText(text: string): void {
    this.mainCursor.text = text
  }

  // public setValues(data: ValueData): void {
  //   this.model.setValues(data)
  // }

  // public setProperties(data: ElementsProperies): void {
  //   this.mainModel.setProperties(data)
  // }

  // public getCurrentElementData(): ElementPathData {
  //   const element = this.mainCursor.getCst()
  //   const path = element.getCstPath()
  //   return new ElementPathData(element, path, false)
  // }

  public getTableData(): IElementPathData {
    const cursor = this.view.currentCursor

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
    const classType: any = elementsManager.getByTypeDescription(type)
    if (!classType) {
      throw new Error(`Class type ${type} not found`)
    }

    return new classType() as IBaseElement
  }

  public createOrUpdateElement(data: ElementPathData): void {
    this.model.createOrUpdateElement(data)
  }

  // public setCurrentGroup(group: IBaseElement | undefined): void {
  //   this.groupPath = undefined
  //   if (group) {
  //     this.groupPath = group.getCstPath()
  //   }

  //   const gutter = document.getElementsByClassName("gutter-vertical")[0] as HTMLElement
  //   this.groupEditorContainer.style.display = group ? "block" : "none"

  //   if (!group) {
  //     this.mainEditorContainer.classList.add("up-container-full-size")
  //   } else {
  //     this.mainEditorContainer.classList.remove("up-container-full-size")
  //   }

  //   gutter.style.display = group ? "block" : "none"
  // }

  // private selectGroup(group: IBaseElement | undefined): void {
  //   this.setCurrentGroup(group)
  //   this.updateGroupEditorByMainEditor()
  // }

  // public closeGroupEditor(): void {
  //   this.setCurrentGroup(undefined)
  // }

  // private onChangeMainEditorContent(_semanticTree: IBaseElement): void {
  //   this.currentEditor = this.mainEditor

  //   this.updateGroupEditorByMainEditor()

  //   this.onChangeContent(this.mainCursor.getCst())
  // }

  // private onChangeGroupEditorContent(_semanticTree: IBaseElement): void {
  //   this.currentEditor = this.groupEditor
  //   this.updateMainEditorByGroupEditor()

  //   this.onChangeContent(this.mainCursor.getCst())
  // }

  // private onChangeMainEditorCurrentElement(currentElement: ElementPathData | undefined): void {
  //   this.onChangeCurrentElement(currentElement)
  // }

  // private onChangeGroupEditorCurrentElement(currentElement: ElementPathData | undefined): void {
  //   this.onChangeCurrentElement(currentElement)
  // }

  // private isGroupEditorEnabled(): boolean {
  //   return this.groupPath !== undefined
  // }

  // private updateMainEditorByGroupEditor(): void {
  //   if (!this.isGroupEditorEnabled()) return

  //   // this.mainModel.updateVerticalGroup(this.groupPath as CstPath, this.groupModel.getSemanicTree())
  // }

  // private updateGroupEditorByMainEditor(): void {
  //   if (!this.isGroupEditorEnabled()) return

  //   const element = this.model.getElement(this.groupPath as CstPath)

  //   if (!element || !(element instanceof VerticalGroupElement)) {
  //     this.groupPath = undefined
  //     return
  //   }

  //   const container = new EditorContainerElement()
  //   container.items.push(...element.items)
  //   this.groupEditor.setCst(container)
  // }

  // private provideLinks(
  //   model: monaco.editor.ITextModel,
  //   _token: monaco.CancellationToken
  // ): monaco.languages.ProviderResult<monaco.languages.ILinksList> {
  //   if (model === this.mainEditor.getEditorModel()) {
  //     return this.mainCursor.links
  //   }

  //   if (model === this.groupEditor.getEditorModel()) {
  //     return this.groupCursor.links
  //   }

  //   return undefined
  // }

  // private resolveLink(): monaco.languages.ProviderResult<monaco.languages.ILink> {
  //   const element = this.mainCursor.getCst()
  //   if (!element) {
  //     throw new Error("No element found")
  //   }

  //   this.selectGroup(element)

  //   return undefined
  // }

  // private getCurrentModel(): AbstractModel<any> {
  //   return this.currentEditor.getModel()
  // }

  // public getCreateTable(): TableElement {
  //   const element = this.getCurrentModel().getCurrentTableElement()
  //   if (element) return element

  //   return new TableElement()
  // }

  // public getCurrentElementProperties(): { [key: string]: any } | undefined {
  //   const element = this.getCurrentModel().getCurrentElement()
  //   if (!element) return undefined

  //   return element.properties
  // }

  // private onCloseGroupButtonClick(e: Event): void {
  //   e.stopPropagation()
  //   this.closeGroupEditor()
  // }

  // private initSplitter(): void {
  //   Split(["#container-up", "#container-down"], {
  //     direction: "vertical",
  //     gutterSize: 15,
  //     gutter: (_index, direction) => {
  //       const gutter = document.createElement("div")
  //       gutter.className = `gutter gutter-${direction}`

  //       const closeBtn = document.createElement("div")
  //       closeBtn.className = "group-editor-close-button"
  //       closeBtn.innerHTML = "×"
  //       closeBtn.onclick = this.onCloseGroupButtonClick.bind(this)

  //       gutter.appendChild(closeBtn)
  //       return gutter
  //     },
  //   })
  // }

  private onCloseGroup(): void {
    this.model.unregisterCursor(this.groupCursor)
  }

  private onSelectGroup(group: IElementPathData): void {
    this.model.registerCursor(this.groupCursor)
    this.groupCursor.path = group.path
  }
}
