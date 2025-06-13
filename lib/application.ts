import * as monaco from "monaco-editor-core"

import { EditorWrapper } from "./editor/editorWrapper"
import { FormModel } from "./editor/formModel"
import { GroupModel } from "./editor/groupModel"

import { AbstractModel } from "./editor/abstractModel"
import { BaseElement, CstPath } from "./elements/baseElement"
import { EditorContainerElement } from "./elements/EditorContainerElement"
import { VerticalGroupElement } from "./elements/VerticalGroupElement"
import { TableElement } from "./elements/tableElement"

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

export class Application implements IApplication {
  private readonly mainEditor: EditorWrapper
  private readonly groupEditor: EditorWrapper
  private readonly mainModel: FormModel
  private readonly groupModel: GroupModel

  private groupPath: CstPath | undefined
  private readonly groupEditorContainer: HTMLElement
  private currentEditor: EditorWrapper

  constructor(mainEditorContainer: HTMLElement, groupEditorContainer: HTMLElement) {
    this.mainModel = new FormModel()
    this.mainEditor = new EditorWrapper(mainEditorContainer, this.mainModel, "plaintext")
    this.mainEditor.onChangeContent = this.onChangeMainEditorContent.bind(this)

    this.groupEditorContainer = groupEditorContainer
    this.groupModel = new GroupModel()
    this.groupEditor = new EditorWrapper(groupEditorContainer, this.groupModel, "plaintext")
    this.groupEditor.onChangeContent = this.onChangeGroupEditorContent.bind(this)

    monaco.languages.registerLinkProvider("plaintext", {
      provideLinks: this.provideLinks.bind(this),
      resolveLink: this.resolveLink.bind(this),
    })

    this.currentEditor = this.mainEditor

    this.setCurrentGroup(undefined)
  }

  public onChangeContent: (semanticTree: BaseElement) => void = () => {
    throw new Error("onChangeContent is not implemented")
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

  public setCurrentGroup(group: BaseElement | undefined): void {
    this.groupPath = undefined
    if (group) {
      this.groupPath = group.getCstPath()
    }

    this.groupEditorContainer.style.display = group ? "block" : "none"
  }

  private selectGroup(group: BaseElement | undefined): void {
    this.setCurrentGroup(group)
    this.updateGroupEditorByMainEditor()
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
}
