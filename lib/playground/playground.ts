import "../polyfill.js"
import { CodeModel } from "../codeModel"
import { Editor } from "../editor"
import { TreeView } from "../playground/treeView"
import { FormElement } from "../parser/visitorTools/formElements.js"

const treeViewContainer = document.getElementById("output") as HTMLElement

let treeView = new TreeView(treeViewContainer)
let model = new CodeModel()

model.on("CSTChange", (cst: FormElement) => {
  treeView.setCST(cst)
})

model.on("PositionChange", (hierarchy: string[]) => {
  treeView.setHierarchy(hierarchy)
})

let editor = new Editor(model)

;(window as any).getEditorText = editor.getEditorText
;(window as any).setEditorText = editor.setEditorText

// monaco.languages.registerDocumentSemanticTokensProvider("plaintext", {
//   getLegend: () => {
//     return {
//       tokenTypes: ["comment"],
//       tokenModifiers: [],
//     }
//   },
//   provideDocumentSemanticTokens: (_model, _lastResultId, _token) => {
//     // [deltaLine, deltaStartChar, length, tokenTypeIndex, tokenModifiersBits]
//     const data = []

//     data.push(0, 1, 5, 0, 0)

//     return {
//       data: new Uint32Array(data),
//       resultId: undefined,
//     }
//   },
//   releaseDocumentSemanticTokens: (_resultId) => {},
// })

// monaco.languages.registerCodeLensProvider("plaintext", {
//   provideCodeLenses: function (model, token) {
//     return {
//       lenses: [
//         {
//           range: {
//             startLineNumber: 1,
//             startColumn: 1,
//             endLineNumber: 1,
//             endColumn: 1,
//           },
//           id: "First Line 1",
//           command: {
//             // id: commandId,
//             title: "⊙",
//           },
//         },
//       ],
//       dispose: () => {},
//     }
//   },
//   resolveCodeLens: function (model, codeLens, token) {
//     return codeLens
//   },
// })
