import { editor as monacoEditor } from "monaco-editor-core"
import { CodeModel } from "./codeModel"
import { BaseFormElement } from "./parser/visitorTools/formElements"

export class EditorWrapper {
  private readonly editor: monacoEditor.IStandaloneCodeEditor
  private readonly model: CodeModel

  decorationsCollection: monacoEditor.IEditorDecorationsCollection

  constructor(container: HTMLElement) {
    this.model = new CodeModel()

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

  public readonly onChangeCurrentElement: (() => void) | undefined

  public updateGroup(groupEditorCurrentElement: string, semanticTree: any) {
    this.model.updateVerticalGroup(groupEditorCurrentElement, semanticTree)
  }

  public getElementByName(elementName: string): BaseFormElement {
    return this.model.getElementByName(elementName)
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

  private createEditor(container: HTMLElement): monacoEditor.IStandaloneCodeEditor {
    return monacoEditor.create(container, {
      language: "plaintext",
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
    })
  }

  private handleResize(): void {
    this.editor.layout()
  }

  private onChangeModelContent(content: string): void {
    this.editor.setValue(content)
  }

  private onChangeEditorContent() {
    const text = this.editor.getValue()
    this.model.setText(text)

    const decorations = this.model.getDecorations()
    this.decorationsCollection.set(decorations)

    this.onChangeContent(this.model.getSemanicTree())
  }

  private onDidChangeCursorSelection(e: monacoEditor.ICursorSelectionChangedEvent) {
    this.model.setCursor(e.selection.startLineNumber, e.selection.startColumn)
    this.onChangeCurrentElement?.()
  }
}
