import "../polyfill.js"
import Split from "split.js"
import { TreeView } from "../playground/treeView"
import { BaseElement } from "../elements/baseElement"
import { FormElement } from "../elements/formElement"
import { Application } from "../application.js"

const treeViewContainer = document.getElementById("output") as HTMLElement

let treeView = new TreeView(treeViewContainer)

const application = new Application(
  document.getElementById("container-up") as HTMLElement,
  document.getElementById("container-down") as HTMLElement
)

Split(["#container-up", "#container-down"], {
  direction: "vertical",
})

application.onChangeContent = (semanticTree: BaseElement) => {
  treeView.setCST(semanticTree as FormElement)
}
