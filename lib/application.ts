import * as monaco from "monaco-editor-core"

import { EditorWrapper } from "./editorWrapper"
import { FormModel } from "./formModel"
import { GroupModel } from "./groupModel"
import {
  BaseFormElement,
  EditorContainerElement,
  FormElement,
  VerticalGroupElement,
} from "./parser/visitorTools/formElements"

export class Application {
  private readonly mainEditor: EditorWrapper
  private readonly groupEditor: EditorWrapper
  private readonly mainModel: FormModel
  private readonly groupModel: GroupModel

  private groupId: string | undefined
  private readonly groupEditorContainer: HTMLElement
  private currentEditor: EditorWrapper

  constructor(mainEditorContainer: HTMLElement, groupEditorContainer: HTMLElement) {
    this.mainModel = new FormModel()
    this.mainEditor = new EditorWrapper(mainEditorContainer, this.mainModel, "plaintext")
    this.mainEditor.onChangeContent = this.onChangeMainEditorContent.bind(this)
    this.mainEditor.onSelectGroup = this.onSelectGroup.bind(this)

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

  public onChangeContent: (semanticTree: BaseFormElement) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  getSemanicTree(): FormElement {
    return this.mainEditor.getSemanicTree() as FormElement
  }
  // public abstract setTable(): void
  // public abstract fetchFormat(): void
  // public abstract setText(text: string): void

  public getText(): string {
    return this.mainEditor.getText()
  }

  public setText(text: string): void {
    this.mainEditor.setText(text)
  }

  public setCurrentGroup(groupId: string | undefined): void {
    this.groupId = groupId

    this.groupEditorContainer.style.display = groupId ? "block" : "none"
  }

  private onSelectGroup(groupId: string | undefined): void {
    this.setCurrentGroup(groupId)
    this.updateGroupEditorByMainEditor()
  }

  private onChangeMainEditorContent(_semanticTree: BaseFormElement): void {
    this.currentEditor = this.mainEditor

    this.updateGroupEditorByMainEditor()

    this.onChangeContent(this.mainEditor.getSemanicTree())
  }

  private onChangeGroupEditorContent(_semanticTree: BaseFormElement): void {
    this.currentEditor = this.groupEditor
    this.updateMainEditorByGroupEditor()

    this.onChangeContent(this.mainEditor.getSemanicTree())
  }

  private isGroupEditorEnabled(): boolean {
    return this.groupId !== undefined
  }

  private updateMainEditorByGroupEditor(): void {
    if (!this.isGroupEditorEnabled()) return

    this.mainModel.updateVerticalGroup(this.groupId as string, this.groupModel.getSemanicTree())
  }

  private updateGroupEditorByMainEditor(): void {
    if (!this.isGroupEditorEnabled()) return

    const element = this.mainModel.getElementByUuid(this.groupId as string)
    if (element && element instanceof VerticalGroupElement) {
      const container = new EditorContainerElement()
      container.items.push(...element.items)
      this.groupEditor.setSemanicTree(container)
    }
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

  private resolveLink(
    link: monaco.languages.ILink,
    _token: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.ILink> {
    const element = this.mainModel.getCurrentElement()
    if (!element) return undefined
    this.onSelectGroup(element.uuid)
    return { range: link.range }
  }
  // public abstract setProperty(id: string, value: string): void

  // public abstract onChangeText(listener: (text: string) => void): void

  // public abstract onChangeCurrentElement(listener: (text: string) => void): void

  // private getCurrentEditor(): EditorWrapper {
  //   return this.editorWrapper
  // }
}
