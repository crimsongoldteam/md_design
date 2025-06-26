import "../polyfill.js"
import { TreeView } from "../playground/treeView"
import { BaseElement } from "../elements/baseElement"
import { FormElement } from "../elements/formElement"
import { Application } from "../application.js"
import { Exporter } from "@/exporter/exporter.js"
import { Importer } from "@/importer/importer.js"
import { IBaseElement } from "@/elements/interfaces.js"

const treeViewContainer = document.getElementById("output") as HTMLElement

let treeView = new TreeView(treeViewContainer)

const application = new Application(
  document.getElementById("container-up") as HTMLElement,
  document.getElementById("container-down") as HTMLElement
)

application.onChangeContent = (cst: IBaseElement) => {
  treeView.setCST(cst as FormElement)
}
;(window as any).setValues = (plainText: string): void => {
  const data = Importer.import(plainText)
  // data.isNew = true
  application.createOrUpdateElement(data)
  console.log(data)
}
;(window as any).application = application
