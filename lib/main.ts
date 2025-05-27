import "./polyfill.js"
import { CodeModel } from "./codeModel"
import { Editor } from "./editor"
import { EnterpriseConnector } from "./enterpriseConnector.js"

let model = new CodeModel()
let connector = new EnterpriseConnector()

model.on("codeModelChanged", () => {
  connector.changeCST({
    text: model.getText(),
    semanticsTree: model.getProduction(),
    selectionHierarchy: model.getSelectionHierarchy(),
  })
})

model.on("onPositionChange", () => {
  const location = model.getCursor()
  connector.changeSelectionHierarchy({
    line: location.line,
    column: location.column,
    selectionHierarchy: model.getSelectionHierarchy(),
  })
})

let editor = new Editor(model)

;(window as any).getEditorText = editor.getEditorText
;(window as any).setEditorText = editor.setEditorText
