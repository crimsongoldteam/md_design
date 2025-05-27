import { editor as monacoEditor } from "monaco-editor-core"
import { CodeModel } from "./codeModel"

export class Editor {
  editor: monacoEditor.IStandaloneCodeEditor
  model: CodeModel

  constructor(model: CodeModel) {
    this.model = model

    const container = document.getElementById("container")
    if (!container) {
      throw new Error("Container not found")
    }

    this.editor = monacoEditor.create(container, {
      language: "plaintext",
      minimap: { enabled: false },
      unicodeHighlight: {
        ambiguousCharacters: false,
      },
      suggest: { showWords: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      selectionHighlight: false,
      lineNumbers: "off",
      contextmenu: true,
      insertSpaces: false,
      tabSize: 2,
    })

    this.editor.onDidChangeCursorSelection(this.onDidChangeCursorSelection.bind(this))
    this.editor.onDidChangeModelContent(this.onDidChangeModelContent.bind(this))
    ;(window as any).addEventListener("resize", () => {
      this.editor.layout()
    })
  }

  public getEditorText(): string {
    return this.editor.getValue()
  }

  public setEditorText(text: string): void {
    this.editor.setValue(text)
  }

  public setPosition(lineNumber: number, column: number): void {
    this.editor.setPosition({
      lineNumber: lineNumber,
      column: column,
    })
  }

  private onDidChangeCursorSelection(e: any) {
    this.model.setCursor(e.selection.startLineNumber, e.selection.startColumn)
  }

  private onDidChangeModelContent() {
    const text = this.editor.getValue()
    this.model.setText(text)
  }
}
