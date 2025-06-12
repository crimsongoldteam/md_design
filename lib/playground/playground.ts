import "../polyfill.js"
import Split from "split.js"
import { TreeView } from "../playground/treeView"
import { BaseFormElement, FormElement } from "../parser/visitorTools/formElements.js"
import { Application } from "../application.js"

const treeViewContainer = document.getElementById("output") as HTMLElement

let treeView = new TreeView(treeViewContainer)
// let model = new CodeModel()

// model.on("CSTChange", (cst: FormElement) => {
//   treeView.setCST(cst)
// })

// model.on("PositionChange", (hierarchy: string[]) => {
//   treeView.setHierarchy(hierarchy)
// })

const application = new Application(
  document.getElementById("container-up") as HTMLElement,
  document.getElementById("container-down") as HTMLElement
)

Split(["#container-up", "#container-down"], {
  direction: "vertical",
})

application.onChangeContent = (semanticTree: BaseFormElement) => {
  treeView.setCST(semanticTree as FormElement)
}

// let editor = new EditorWrapper(document.getElementById("editor") as HTMLElement)
// ;(window as any).getEditorText = editor.getEditorText
// ;(window as any).setEditorText = editor.setEditorText
