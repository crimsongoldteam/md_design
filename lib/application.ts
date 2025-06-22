import * as monaco from "monaco-editor-core"

import { EditorWrapper } from "./editor/editorWrapper"
import { FormModel, ValueData } from "./editor/formModel"
import { GroupModel } from "./editor/groupModel"

import { AbstractModel } from "./editor/abstractModel"
import { BaseElement } from "./elements/baseElement"
import { CstPath, CstPathItem } from "./elements/cstPathHelper"
import { EditorContainerElement } from "./elements/editorContainerElement"
import { VerticalGroupElement } from "./elements/verticalGroupElement"
import Split from "split.js"
import { Expose, Type, Transform } from "class-transformer"
import { TableElement } from "./elements/tableElement"
import { PlainToClassTransformer } from "./importer/plaintToClassTransformer"
import { PlainToClassDiscriminator } from "./importer/plainToClassDiscriminator"
import { elementsManager } from "./elementsManager"

interface IApplication {
  onChangeContent: (semanticTree: BaseElement) => void
  getText(): string
  getProduction(): any
  setText(text: string): void
  insertText(text: string): void
  formatText(): void
  getCreateTable(): void
  getCurrentElementProperties(): { [key: string]: any } | undefined
}

export class ElementPathData {
  @Expose({ name: "Элемент" })
  @Type(() => BaseElement, PlainToClassDiscriminator.discriminatorOptions)
  @Transform(PlainToClassTransformer.transform, { toClassOnly: true })
  public item: BaseElement

  @Expose({ name: "Путь" })
  @Type(() => CstPathItem)
  public path: CstPath

  @Expose({ name: "ЭтоНовый" })
  public isNew: boolean

  constructor(item: BaseElement, path: CstPath, isNew: boolean) {
    this.item = item
    this.path = path
    this.isNew = isNew
  }
}

export class Application implements IApplication {
  private readonly mainEditor: EditorWrapper
  private readonly groupEditor: EditorWrapper
  private readonly mainModel: FormModel
  private readonly mainEditorContainer: HTMLElement
  private readonly groupModel: GroupModel

  private groupPath: CstPath | undefined
  private readonly groupEditorContainer: HTMLElement
  private currentEditor: EditorWrapper

  constructor(mainEditorContainer: HTMLElement, groupEditorContainer: HTMLElement) {
    this.mainModel = new FormModel()
    this.mainEditorContainer = mainEditorContainer
    this.mainEditor = new EditorWrapper(mainEditorContainer, this.mainModel)
    this.mainEditor.onChangeContent = this.onChangeMainEditorContent.bind(this)
    this.mainEditor.onChangeCurrentElement = this.onChangeMainEditorCurrentElement.bind(this)

    this.groupEditorContainer = groupEditorContainer
    this.groupModel = new GroupModel()
    this.groupEditor = new EditorWrapper(groupEditorContainer, this.groupModel)
    this.groupEditor.onChangeContent = this.onChangeGroupEditorContent.bind(this)
    this.groupEditor.onChangeCurrentElement = this.onChangeGroupEditorCurrentElement.bind(this)

    monaco.languages.registerLinkProvider("plaintext", {
      provideLinks: this.provideLinks.bind(this),
      resolveLink: this.resolveLink.bind(this),
    })

    this.currentEditor = this.mainEditor

    this.initSplitter()

    this.setCurrentGroup(undefined)
  }

  public onChangeContent: (semanticTree: BaseElement) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  public onChangeCurrentElement: (currentElement: ElementPathData | undefined) => void = () => {
    throw new Error("onChangeCurrentElement is not implemented")
  }

  public insertText(text: string): void {
    this.currentEditor.insertText(text)
  }

  public formatText(): void {
    this.currentEditor.format()
  }

  public getText(): string {
    return this.mainEditor.getText()
  }

  public getProduction(): any {
    return this.mainModel.getProduction()
  }

  public setText(text: string): void {
    this.mainEditor.setText(text)
  }

  public setValues(data: ValueData): void {
    this.mainModel.setValues(data)
  }

  // public setProperties(data: ElementsProperies): void {
  //   this.mainModel.setProperties(data)
  // }

  public getCurrentElementData(): ElementPathData {
    const element = this.mainModel.getCurrentElement()
    const path = element.getCstPath()
    return new ElementPathData(element, path, false)
  }

  public getTableData(): ElementPathData {
    let table = this.mainModel.getCurrentTableElement()
    let path: CstPath = []

    const isNew = table === undefined
    if (table) {
      path = table.getCstPath()
    } else {
      table = new TableElement()
      const element = this.mainModel.getCurrentElement()
      path = element.getCstPath()
    }

    const result = new ElementPathData(table, path, isNew)

    return result
  }

  getNewValue(type: string): BaseElement {
    const classType: any = elementsManager.getByTypeDescription(type)
    if (!classType) {
      throw new Error(`Class type ${type} not found`)
    }

    return new classType() as BaseElement
  }

  public createOrUpdateElement(data: ElementPathData): void {
    this.mainModel.createOrUpdateElement(data)
  }

  public setCurrentGroup(group: BaseElement | undefined): void {
    this.groupPath = undefined
    if (group) {
      this.groupPath = group.getCstPath()
    }

    const gutter = document.getElementsByClassName("gutter-vertical")[0] as HTMLElement
    this.groupEditorContainer.style.display = group ? "block" : "none"

    if (!group) {
      this.mainEditorContainer.classList.add("up-container-full-size")
    } else {
      this.mainEditorContainer.classList.remove("up-container-full-size")
    }

    gutter.style.display = group ? "block" : "none"
  }

  private selectGroup(group: BaseElement | undefined): void {
    this.setCurrentGroup(group)
    this.updateGroupEditorByMainEditor()
  }

  public closeGroupEditor(): void {
    this.setCurrentGroup(undefined)
  }

  private onChangeMainEditorContent(_semanticTree: BaseElement): void {
    this.currentEditor = this.mainEditor

    this.updateGroupEditorByMainEditor()

    this.onChangeContent(this.mainEditor.getSemanicTree())
  }

  private onChangeGroupEditorContent(_semanticTree: BaseElement): void {
    this.currentEditor = this.groupEditor
    this.updateMainEditorByGroupEditor()

    this.onChangeContent(this.mainEditor.getSemanicTree())
  }

  private onChangeMainEditorCurrentElement(currentElement: ElementPathData | undefined): void {
    this.onChangeCurrentElement(currentElement)
  }

  private onChangeGroupEditorCurrentElement(currentElement: ElementPathData | undefined): void {
    this.onChangeCurrentElement(currentElement)
  }

  private isGroupEditorEnabled(): boolean {
    return this.groupPath !== undefined
  }

  private updateMainEditorByGroupEditor(): void {
    if (!this.isGroupEditorEnabled()) return

    this.mainModel.updateVerticalGroup(this.groupPath as CstPath, this.groupModel.getSemanicTree())
  }

  private updateGroupEditorByMainEditor(): void {
    if (!this.isGroupEditorEnabled()) return

    const element = this.mainModel.findElementByCstPath(this.groupPath as CstPath)

    if (!element || !(element instanceof VerticalGroupElement)) {
      this.groupPath = undefined
      return
    }

    const container = new EditorContainerElement()
    container.items.push(...element.items)
    this.groupEditor.setSemanicTree(container)
  }

  private provideLinks(
    model: monaco.editor.ITextModel,
    _token: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.ILinksList> {
    if (model === this.mainEditor.getEditorModel()) {
      return this.mainModel.getLinks()
    }

    if (model === this.groupEditor.getEditorModel()) {
      return this.groupModel.getLinks()
    }

    return undefined
  }

  private resolveLink(): monaco.languages.ProviderResult<monaco.languages.ILink> {
    const element = this.mainModel.getCurrentElement()
    if (!element) {
      throw new Error("No element found")
    }

    this.selectGroup(element)

    return undefined
  }

  private getCurrentModel(): AbstractModel<any> {
    return this.currentEditor.getModel()
  }

  public getCreateTable(): TableElement {
    const element = this.getCurrentModel().getCurrentTableElement()
    if (element) return element

    return new TableElement()
  }

  public getCurrentElementProperties(): { [key: string]: any } | undefined {
    const element = this.getCurrentModel().getCurrentElement()
    if (!element) return undefined

    return element.properties
  }

  private onCloseGroupButtonClick(e: Event): void {
    e.stopPropagation()
    this.closeGroupEditor()
  }

  private initSplitter(): void {
    Split(["#container-up", "#container-down"], {
      direction: "vertical",
      gutterSize: 15,
      gutter: (_index, direction) => {
        const gutter = document.createElement("div")
        gutter.className = `gutter gutter-${direction}`

        const closeBtn = document.createElement("div")
        closeBtn.className = "group-editor-close-button"
        closeBtn.innerHTML = "×"
        closeBtn.onclick = this.onCloseGroupButtonClick.bind(this)

        gutter.appendChild(closeBtn)
        return gutter
      },
    })
  }
}
