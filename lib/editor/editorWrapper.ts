import * as monaco from "monaco-editor-core"
import { IEditorWrapper, IElementPathData, IModelCursor } from "./interfaces"

export class EditorWrapper implements IEditorWrapper {
  protected readonly editor: monaco.editor.IStandaloneCodeEditor
  private readonly _cursor: IModelCursor
  private readonly decorationsCollection: monaco.editor.IEditorDecorationsCollection
  private skipNextTrigger: boolean = false

  constructor(container: HTMLElement, cursor: IModelCursor) {
    this._cursor = cursor
    this._cursor.onChangeText = this.onChangeText.bind(this)

    this.editor = this.createEditor(container)
    this.editor.onDidChangeCursorSelection(this.onDidChangeCursorSelection.bind(this))
    this.editor.onDidChangeModelContent(this.onChangeEditorContent.bind(this))

    this.decorationsCollection = this.editor.createDecorationsCollection([])

    window.addEventListener("resize", this.handleResize.bind(this))
  }

  public onSelectGroup: (group: IElementPathData) => void = () => {
    throw new Error("onSelectGroup is not implemented")
  }

  get cursor(): IModelCursor {
    return this._cursor
  }

  public isEditorModel(model: monaco.editor.ITextModel): boolean {
    return model === this.editor.getModel()
  }

  public insertText(text: string): void {
    const position = this.editor.getModel()?.getPositionAt(0)

    if (!position) {
      throw new Error("No position found")
    }

    const range = {
      startLineNumber: position.lineNumber,
      startColumn: position.column,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    }

    this.editor.executeEdits("insertText", [{ range: range, text: text }])
  }

  private createEditor(container: HTMLElement): monaco.editor.IStandaloneCodeEditor {
    const editor = monaco.editor.create(container, {
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
      occurrencesHighlight: false,
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

  private onChangeEditorContent() {
    if (this.skipNextTrigger) {
      this.skipNextTrigger = false
      return
    }

    const text = this.editor.getValue()

    this.cursor.text = text

    this.refreshDecorations()
  }

  private refreshDecorations() {
    const decorations = this.cursor.decorations
    this.decorationsCollection.set(decorations)
  }

  private onDidChangeCursorSelection(e: monaco.editor.ICursorSelectionChangedEvent) {
    this.cursor.setPosition({ line: e.selection.startLineNumber, column: e.selection.startColumn })
  }

  private onChangeText(text: string, canUndo: boolean): void {
    if (text === this.editor.getValue()) return
    this.skipNextTrigger = true

    if (canUndo) {
      const fullRange = this.editor.getModel()?.getFullModelRange()

      if (!fullRange) {
        throw new Error("No editor model found")
      }

      this.editor.executeEdits("changeText", [{ range: fullRange, text: text }])
    } else {
      this.editor.setValue(text)
    }

    this.refreshDecorations()
  }
}
