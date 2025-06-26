import * as monaco from "monaco-editor-core"
import { BaseElement } from "../elements/baseElement"
import { IEditorWrapper, IElementPathData, IModelCursor } from "./interfaces"

export class EditorWrapper implements IEditorWrapper {
  protected readonly editor: monaco.editor.IStandaloneCodeEditor
  private readonly cursor: IModelCursor
  private readonly decorationsCollection: monaco.editor.IEditorDecorationsCollection
  private skipNextTrigger: boolean = false

  constructor(container: HTMLElement, cursor: IModelCursor) {
    this.cursor = cursor

    this.editor = this.createEditor(container)
    this.editor.onDidChangeCursorSelection(this.onDidChangeCursorSelection.bind(this))
    this.editor.onDidChangeModelContent(this.onChangeEditorContent.bind(this))

    // this.model.onChangeContent = this.onChangeModelContent.bind(this)

    this.decorationsCollection = this.editor.createDecorationsCollection([])

    window.addEventListener("resize", this.handleResize.bind(this))
  }

  public onSelectGroup: (group: IElementPathData) => void = () => {
    throw new Error("onSelectGroup is not implemented")
  }

  public onChangeContent: (semanticTree: BaseElement) => void = () => {
    throw new Error("onChangeContent is not implemented")
  }

  public onChangeCurrentElement: (currentElement: IElementPathData | undefined) => void = () => {
    throw new Error("onChangeCurrentElement is not implemented")
  }

  public isEditorModel(model: monaco.editor.ITextModel): boolean {
    return model === this.editor.getModel()
  }

  // getEditorModel(): monaco.editor.ITextModel {
  //   return this.editor.getModel() as monaco.editor.ITextModel
  // }

  // public getCst(): BaseElement {
  //   return this.model.getSemanicTree()
  // }

  // public setCst(element: BaseElement): void {
  //   this.model.setCst(element)
  // }

  // public getText(): string {
  //   return this.editor.getValue()
  // }

  // public setText(text: string): void {
  //   this.editor.setValue(text)
  // }

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

  // public format(): void {
  //   this.model.format()
  // }

  // public setPosition(lineNumber: number, column: number): void {
  //   this.editor.setPosition({
  //     lineNumber: lineNumber,
  //     column: column,
  //   })
  // }

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
    this.cursor.text = text

    this.refreshDecorations()

    // this.onChangeContent(this.model.getSemanicTree())
  }

  private refreshDecorations() {
    const decorations = this.cursor.decorations
    this.decorationsCollection.set(decorations)
  }

  private onDidChangeCursorSelection(e: monaco.editor.ICursorSelectionChangedEvent) {
    this.cursor.setPosition({ line: e.selection.startLineNumber, column: e.selection.startColumn })
    // this.onChangeCurrentElement?.(this.model.getCurrentElementPathData())
  }
}
