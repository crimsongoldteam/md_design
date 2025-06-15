import "./polyfill.js"

import { Application } from "./application.js"
import { EnterpriseConnector } from "./enterpriseConnector.js"
import Split from "split.js"

const application = new Application(
  document.getElementById("container-up") as HTMLElement,
  document.getElementById("container-down") as HTMLElement
)

Split(["#container-up", "#container-down"], {
  direction: "vertical",
})

const connector = new EnterpriseConnector(application)

;(window as any).formatText = connector.formatText.bind(connector)
;(window as any).setText = connector.setText.bind(connector)
;(window as any).insertText = connector.insertText.bind(connector)
;(window as any).setValues = connector.setValues.bind(connector)
