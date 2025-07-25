import "../polyfill.js"
import { TreeView } from "../playground/treeView"
import { FormElement } from "../elements/formElement"
import { Application } from "../application.js"
import { Importer } from "@/importer/importer.js"
import { IAttributes, IBaseElement } from "@/elements/interfaces.js"
import { IElementPathData } from "@/editor/interfaces.js"
import { Exporter } from "@/exporter/exporter.js"
import { EnterpriseConnectorChangeContentData } from "@/enterpriseConnector.js"

const treeViewContainer = document.getElementById("output") as HTMLElement

let treeView = new TreeView(treeViewContainer)

const application = new Application(
  document.getElementById("container-up") as HTMLElement,
  document.getElementById("container-down") as HTMLElement
)

application.onChangeContent = (cst: IBaseElement | undefined, attributes: IAttributes) => {
  const data = new EnterpriseConnectorChangeContentData(cst, attributes)
  console.log(Exporter.export(data))
  treeView.setCST(cst as FormElement)
}

application.onSelectElement = (_currentElement: IElementPathData | undefined) => {
  // console.log(currentElement)
}
;(window as any).setValues = (plainText: string): void => {
  const data = Importer.importElements(plainText)
  application.createOrUpdateElement(data)
}
;(window as any).application = application
