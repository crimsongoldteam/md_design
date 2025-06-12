import * as monaco from "monaco-editor-core"
import { AbstractModel } from "./abstractModel"
import { BaseFormElement } from "./parser/visitorTools/formElements"

export class EditorWrapper {
  private readonly editor: monaco.editor.IStandaloneCodeEditor
  private readonly model: AbstractModel<any>
  private readonly languageSelector: string
  private readonly decorationsCollection: monaco.editor.IEditorDecorationsCollection
  private skipNextTrigger: boolean = false

  constructor(container: HTMLElement, model: AbstractModel<any>, languageSelector: string) {
    this.model = model
    this.languageSelector = languageSelector

    this.editor = this.createEditor(container)
    this.decorationsCollection = this.editor.createDecorationsCollection([])
    this.editor.onDidChangeCursorSelection(this.onDidChangeCursorSelection.bind(this))

    this.editor.onDidChangeModelContent(this.onChangeEditorContent.bind(this))

    this.model.onChangeContent = this.onChangeModelContent.bind(this)

    window.addEventListener("resize", this.handleResize.bind(this))
  }

  public onChangeContent: (semanticTree: BaseFormElement) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  public onSelectGroup: (groupId: string) => void = () => {
    throw new Error("onSelectGroup is not implemented")
  }

  public readonly onChangeCurrentElement: (() => void) | undefined

  // public updateGroup(groupUuid: string, semanticTree: any) {
  //   this.model.updateVerticalGroup(groupUuid, semanticTree)
  // }

  getEditorModel(): monaco.editor.ITextModel {
    return this.editor.getModel() as monaco.editor.ITextModel
  }

  public getElementByUuid(elementUuid: string): BaseFormElement | undefined {
    return this.model.getElementByUuid(elementUuid)
  }

  public getSemanicTree(): BaseFormElement {
    return this.model.getSemanicTree()
  }

  public setSemanicTree(element: BaseFormElement): void {
    this.model.setSemanicTree(element)
  }

  public getText(): string {
    return this.editor.getValue()
  }

  public setText(text: string): void {
    this.editor.setValue(text)
  }

  public setPosition(lineNumber: number, column: number): void {
    this.editor.setPosition({
      lineNumber: lineNumber,
      column: column,
    })
  }

  private createEditor(container: HTMLElement): monaco.editor.IStandaloneCodeEditor {
    const editor = monaco.editor.create(container, {
      language: this.languageSelector,
      minimap: { enabled: false },
      unicodeHighlight: {
        ambiguousCharacters: false,
      },
      suggest: { showWords: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      selectionHighlight: false,
      renderLineHighlight: "none",
      // @ts-expect-error
      renderIndentGuides: false,
      lineNumbers: "off",
      contextmenu: true,
      insertSpaces: true,
      tabSize: 2,
      folding: false,
    })

    return editor
  }

  private handleResize(): void {
    this.editor.layout()
  }

  private onChangeModelContent(content: string): void {
    this.skipNextTrigger = true
    this.editor.setValue(content)
    this.refreshDecorations()
  }

  private onChangeEditorContent() {
    if (this.skipNextTrigger) {
      this.skipNextTrigger = false
      return
    }

    const text = this.editor.getValue()
    this.model.setText(text)

    this.refreshDecorations()

    this.onChangeContent(this.model.getSemanicTree())
  }

  private refreshDecorations() {
    const decorations = this.model.getDecorations()
    this.decorationsCollection.set(decorations)
  }

  private onDidChangeCursorSelection(e: monaco.editor.ICursorSelectionChangedEvent) {
    this.model.setCursor(e.selection.startLineNumber, e.selection.startColumn)
    this.onChangeCurrentElement?.()
  }
}
