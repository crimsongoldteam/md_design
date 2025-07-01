import "../polyfill.js"
import { TreeView } from "../playground/treeView"
import { FormElement } from "../elements/formElement"
import { Application } from "../application.js"
import { Importer } from "@/importer/importer.js"
import { IBaseElement } from "@/elements/interfaces.js"
import { IElementPathData } from "@/editor/interfaces.js"
import { EnterpriseConnector } from "@/enterpriseConnector.js"

const treeViewContainer = document.getElementById("output") as HTMLElement

let treeView = new TreeView(treeViewContainer)

const application = new Application(
  document.getElementById("container-up") as HTMLElement,
  document.getElementById("container-down") as HTMLElement
)

application.onChangeContent = (cst: IBaseElement | undefined) => {
  treeView.setCST(cst as FormElement)
}

application.onSelectElement = (_currentElement: IElementPathData | undefined) => {
  // console.log(currentElement)
}
;(window as any).setValues = (plainText: string): void => {
  const data = Importer.import(plainText)
  // data.isNew = true
  application.createOrUpdateElement(data)
  console.log(data)
}
;(window as any).application = application

const connector = new EnterpriseConnector(application)

;(window as any).formatText = connector.formatText.bind(connector)
;(window as any).setText = connector.setText.bind(connector)
;(window as any).getText = connector.getText.bind(connector)
;(window as any).insertText = connector.insertText.bind(connector)
;(window as any).getTable = connector.getTable.bind(connector)
;(window as any).createOrUpdateElement = connector.createOrUpdateElement.bind(connector)
;(window as any).getNewValue = connector.getNewValue.bind(connector)
