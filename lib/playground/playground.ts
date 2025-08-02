import "../polyfill.js"
import { TreeView } from "../playground/treeView"
import { FormElement } from "../elements/formElement"
import { Application } from "../application.js"
import { Importer } from "@/importer/importer.js"
import { IAttributes, IBaseElement } from "@/elements/interfaces.js"
import { IElementPathData } from "@/editor/interfaces.js"
import { Exporter } from "@/exporter/exporter.js"
import { EnterpriseConnectorChangeContentData } from "@/enterpriseConnector.js"
import { create, insertMultiple, search } from "@orama/orama"
import { pluginEmbeddings } from "@orama/plugin-embeddings"
import "@tensorflow/tfjs-backend-cpu"

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

const plugin = await pluginEmbeddings({
  embeddings: {
    // Schema property used to store generated embeddings
    defaultProperty: "embeddings",
    onInsert: {
      // Generate embeddings at insert-time
      generate: true,
      // properties to use for generating embeddings at insert time.
      // Will be concatenated to generate a unique embedding.
      properties: ["description"],
      verbose: true,
    },
  },
})

const db = create({
  schema: {
    title: "string",
    embeddings: "vector[512]",
  },
  plugins: [plugin],
})

insertMultiple(db, [
  { title: "УИ_РедакторКодаКлиентСервер" },
  { title: "АвтоматическиеСкидки" },
  { title: "АдресатыПисем" },
  { title: "АктыОтбораПробЗЕРНО" },
])

const searchResults = search(db, {
  term: "Контрагент",
  mode: "vector",
  similarity: 0.75,
})
