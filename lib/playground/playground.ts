import "../polyfill.js"
import { TreeView } from "../playground/treeView"
import { BaseElement } from "../elements/baseElement"
import { FormElement } from "../elements/formElement"
import { Application } from "../application.js"
import { plainToInstance } from "class-transformer"
import { ValueData } from "@/editor/formModel.js"

const treeViewContainer = document.getElementById("output") as HTMLElement

let treeView = new TreeView(treeViewContainer)

const application = new Application(
  document.getElementById("container-up") as HTMLElement,
  document.getElementById("container-down") as HTMLElement
)

application.onChangeContent = (semanticTree: BaseElement) => {
  treeView.setCST(semanticTree as FormElement)
  // console.log(application.getProduction())
}
;(window as any).setValues = (plainText: string): void => {
  const plainObject = JSON.parse(plainText)
  const data: ValueData = plainToInstance(ValueData, plainObject)
  application.setValues(data)
}
