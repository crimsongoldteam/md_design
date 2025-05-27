import "../polyfill.js"
import { CodeModel } from "../codeModel"
import { Editor } from "../editor"
import { TreeView } from "../playground/treeView"
import { FormElement } from "../parser/visitorTools/formElements.js"

const treeViewContainer = document.getElementById("output") as HTMLElement

let treeView = new TreeView(treeViewContainer)
let model = new CodeModel()

model.on("codeModelChanged", (cst: FormElement) => {
  treeView.setCST(cst)
})

model.on("onPositionChange", (hierarchy: string[]) => {
  treeView.setHierarchy(hierarchy)
})

let editor = new Editor(model)

;(window as any).getEditorText = editor.getEditorText
;(window as any).setEditorText = editor.setEditorText
