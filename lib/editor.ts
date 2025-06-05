// import { editor as monacoEditor } from "monaco-editor-core"
// import { CodeModel } from "./codeModel"
// import { EditorWrapper } from "./editorWrapper"

// export class EditorManager {
//   mainEditor: EditorWrapper
//   groupEditor: EditorWrapper
//   model: CodeModel
//   // mainEditorDecorationsCollection: monacoEditor.IEditorDecorationsCollection

//   constructor(model: CodeModel) {
//     this.model = model

//     const containerMainEditor = document.getElementById("container-up")
//     const containerGroupEditor = document.getElementById("container-down")
//     if (!containerMainEditor || !containerGroupEditor) {
//       throw new Error("Container not found")
//     }

//     this.mainEditor = new EditorWrapper(containerMainEditor)
//     this.groupEditor = new EditorWrapper(containerGroupEditor)
//     // this.mainEditor = this.initMainEditor(containerMainEditor)

//     // this.groupEditor = this.initGroupEditor(containerGroupEditor)
//     // ;(window as any).addEventListener("resize", () => {
//     //   this.mainEditor.layout()
//     // })
//   }

//   // private initMainEditor(container: HTMLElement): monacoEditor.IStandaloneCodeEditor {
//   //   const result = this.createEditor(container)
//   //   this.mainEditorDecorationsCollection = result.createDecorationsCollection([])
//   //   result.onDidChangeCursorSelection(this.onDidChangeCursorSelection.bind(this))
//   //   result.onDidChangeModelContent(this.onDidChangeModelContent.bind(this))

//   //   return result
//   // }

//   // private initGroupEditor(container: HTMLElement): monacoEditor.IStandaloneCodeEditor {
//   //   const result = this.createEditor(container)
//   //   this.mainEditorDecorationsCollection = result.createDecorationsCollection([])
//   //   result.onDidChangeCursorSelection(this.onDidChangeCursorSelection.bind(this))
//   //   result.onDidChangeModelContent(this.onDidChangeModelContent.bind(this))

//   //   return result
//   // }

//   private createEditor(container: HTMLElement): monacoEditor.IStandaloneCodeEditor {
//     return monacoEditor.create(container, {
//       language: "plaintext",
//       minimap: { enabled: false },
//       unicodeHighlight: {
//         ambiguousCharacters: false,
//       },
//       suggest: { showWords: false },
//       automaticLayout: true,
//       scrollBeyondLastLine: false,
//       selectionHighlight: false,
//       renderLineHighlight: "none",
//       // @ts-expect-error
//       renderIndentGuides: false,
//       lineNumbers: "off",
//       contextmenu: true,
//       insertSpaces: true,
//       tabSize: 2,
//     })
//   }

//   public getEditorText(): string {
//     return this.mainEditor.getText()
//   }

//   public setEditorText(text: string): void {
//     this.mainEditor.setText(text)
//   }

//   public setPosition(lineNumber: number, column: number): void {
//     this.mainEditor.setPosition(lineNumber, column)
//   }

//   private onDidChangeCursorSelection(e: any) {
//     this.model.setCursor(e.selection.startLineNumber, e.selection.startColumn)
//   }

//   private onDidChangeModelContent() {
//     const text = this.mainEditor.getText()
//     this.model.setText(text)

//     const decorations = this.model.getDecorations()
//     this.mainEditor.setDecorations(decorations)
//   }
// }
