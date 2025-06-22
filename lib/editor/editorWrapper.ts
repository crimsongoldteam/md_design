import * as monaco from "monaco-editor-core"
import { AbstractModel } from "./abstractModel"
import { BaseElement } from "../elements/baseElement"
import { ElementPathData } from "@/application"

export class EditorWrapper {
  protected readonly editor: monaco.editor.IStandaloneCodeEditor
  private readonly model: AbstractModel<any>
  private readonly decorationsCollection: monaco.editor.IEditorDecorationsCollection
  private skipNextTrigger: boolean = false

  constructor(container: HTMLElement, model: AbstractModel<any>) {
    this.model = model

    this.editor = this.createEditor(container)
    this.editor.onDidChangeCursorSelection(this.onDidChangeCursorSelection.bind(this))
    this.editor.onDidChangeModelContent(this.onChangeEditorContent.bind(this))

    this.model.onChangeContent = this.onChangeModelContent.bind(this)

    this.decorationsCollection = this.editor.createDecorationsCollection([])

    window.addEventListener("resize", this.handleResize.bind(this))
  }

  getModel(): AbstractModel<any> {
    return this.model
  }

  public onChangeContent: (semanticTree: BaseElement) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  public onChangeCurrentElement: (currentElement: ElementPathData | undefined) => void = () => {
    throw new Error("onChangeCurrentElement is not implemented")
  }

  getEditorModel(): monaco.editor.ITextModel {
    return this.editor.getModel() as monaco.editor.ITextModel
  }

  public getSemanicTree(): BaseElement {
    return this.model.getSemanicTree()
  }

  public setSemanicTree(element: BaseElement): void {
    this.model.setSemanicTree(element)
  }

  public getText(): string {
    return this.editor.getValue()
  }

  public setText(text: string): void {
    this.editor.setValue(text)
  }

  public insertText(text: string): void {
    const position = this.model.getCursor()
    const range = {
      startLineNumber: position.line,
      startColumn: position.column,
      endLineNumber: position.line,
      endColumn: position.column,
    }

    this.editor.executeEdits("insertText", [{ range: range, text: text }])
  }

  public format(): void {
    this.model.format()
  }

  public setPosition(lineNumber: number, column: number): void {
    this.editor.setPosition({
      lineNumber: lineNumber,
      column: column,
    })
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
    this.onChangeCurrentElement?.(this.model.getCurrentElementPathData())
  }
}
