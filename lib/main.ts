import "./polyfill.js"

import { Application } from "./application.js"
import { EnterpriseConnector } from "./enterpriseConnector.js"

const application = new Application(
  document.getElementById("container-up") as HTMLElement,
  document.getElementById("container-down") as HTMLElement
)

const connector = new EnterpriseConnector(application)

;(window as any).formatText = connector.formatText.bind(connector)
;(window as any).setText = connector.setText.bind(connector)
;(window as any).getText = connector.getText.bind(connector)
;(window as any).insertText = connector.insertText.bind(connector)
;(window as any).getTable = connector.getTable.bind(connector)
;(window as any).createOrUpdateElement = connector.createOrUpdateElement.bind(connector)
;(window as any).getNewValue = connector.getNewValue.bind(connector)
;(window as any).formatTypeDescription = connector.formatTypeDescription.bind(connector)
;(window as any).parseTypeDescription = connector.parseTypeDescription.bind(connector)
;(window as any).addMetadata = connector.addMetadata.bind(connector)
;(window as any).searchTypeInMetadata = connector.searchTypeInMetadata.bind(connector)
