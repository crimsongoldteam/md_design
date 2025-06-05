import { IEvent } from "monaco-editor-core"
import { EditorWrapper } from "./editorWrapper"
import { BaseFormElement, FormElement } from "./parser/visitorTools/formElements"

export class Application {
  mainEditor: EditorWrapper
  groupEditor: EditorWrapper
  currentEditor: EditorWrapper
  groupId: string

  constructor(mainEditorContainer: HTMLElement, groupEditorContainer: HTMLElement) {
    this.mainEditor = new EditorWrapper(mainEditorContainer)
    this.mainEditor.onChangeContent = this.onChangeMainEditorContent.bind(this)

    this.groupEditor = new EditorWrapper(groupEditorContainer)
    // this.groupEditor.onChangeEditorContent(this.onChangeGroupEditorContent.bind(this))

    this.currentEditor = this.mainEditor

    this.groupId = ""
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

  public onReceiveFormatText(text: string): void {
    this.setText(text)
  }

  public getText(): string {
    return this.mainEditor.getText()
  }

  public setText(text: string): void {
    this.mainEditor.setText(text)
  }

  public setCurrentGroup(groupId: string): void {
    this.groupId = groupId
    const element = this.mainEditor.getElementByName(this.groupId)

    this.groupEditor.setSemanicTree(element)
  }

  private onChangeMainEditorContent(semanticTree: BaseFormElement): void {
    this.currentEditor = this.mainEditor
    this.onChangeContent(semanticTree)
    this.groupEditor.setSemanicTree(semanticTree)
  }

  private onChangeGroupEditorContent(semanticTree: BaseFormElement): void {
    this.currentEditor = this.groupEditor
    this.mainEditor.updateGroup(this.groupId, this.groupEditor.getSemanicTree())
    // this.fetchFormatText()
  }

  // public abstract setProperty(id: string, value: string): void

  // public abstract onChangeText(listener: (text: string) => void): void

  // public abstract onChangeCurrentElement(listener: (text: string) => void): void

  // private getCurrentEditor(): EditorWrapper {
  //   return this.editorWrapper
  // }
}
