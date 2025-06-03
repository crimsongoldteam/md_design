import { editor as monacoEditor } from "monaco-editor-core"
import { CodeModel } from "./codeModel"
import * as monaco from "monaco-editor-core"

export class Editor {
  editor: monacoEditor.IStandaloneCodeEditor
  model: CodeModel
  decorationsCollection: monacoEditor.IEditorDecorationsCollection

  constructor(model: CodeModel) {
    this.model = model

    const container = document.getElementById("container")
    if (!container) {
      throw new Error("Container not found")
    }

    this.defineTheme()

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
      insertSpaces: true,
      tabSize: 2,
      theme: "myCustomTheme",
      "semanticHighlighting.enabled": true,
    })

    this.decorationsCollection = this.editor.createDecorationsCollection([])

    this.editor.onDidChangeCursorSelection(this.onDidChangeCursorSelection.bind(this))
    this.editor.onDidChangeModelContent(this.onDidChangeModelContent.bind(this))
    ;(window as any).addEventListener("resize", () => {
      this.editor.layout()
    })
  }

  private defineTheme() {
    // monaco.editor.defineTheme("myCustomTheme", {
    //   base: "vs",
    //   inherit: false,
    //   colors: {},
    //   rules: [{ token: "Properties", foreground: "9c2513" }],
    // })
    // monaco.languages.registerDocumentSemanticTokensProvider("plaintext", {
    //   getLegend: () => {
    //     return {
    //       tokenTypes: ["FormHeader", "Properties", "LabelHeader"],
    //       tokenModifiers: [],
    //     }
    //   },
    //   provideDocumentSemanticTokens: (_model, _lastResultId, _token) => {
    //     const data = this.model.getSemanticTokensData()
    //     return {
    //       data: new Uint32Array(data),
    //       resultId: undefined,
    //     }
    //   },
    //   releaseDocumentSemanticTokens: (_resultId) => {},
    // })
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

    const decorations = this.model.getDecorations()
    this.decorationsCollection.set(decorations)
  }
}
