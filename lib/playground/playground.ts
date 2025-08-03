import "../polyfill.js"
import { playgroundData } from "./playgroundData"
import { TreeView } from "../playground/treeView"
import { FormElement } from "../elements/formElement"
import { Application } from "../application.js"
import { Importer } from "@/importer/importer.js"
import { IAttributes, IBaseElement } from "@/elements/interfaces.js"
import { IElementPathData } from "@/editor/interfaces.js"
import { Exporter } from "@/exporter/exporter.js"
import { EnterpriseConnectorChangeContentData } from "@/enterpriseConnector.js"
import { create, insertMultiple, search } from "@orama/orama"
import { stemmer } from "@orama/stemmers/russian"
import { pluginPT15 } from "@orama/plugin-pt15"

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

// Инициализируем TensorFlow.js и создаем базу данных
async function initializeTensorFlowAndDB() {
  const db = create({
    schema: {
      title: "string",
      // embeddings: "vector[512]",
    },
    components: {
      tokenizer: {
        stemming: true,
        language: "russian",
        stemmer,
      },
    },
    plugins: [pluginPT15()],
  })

  await insertMultiple(db, playgroundData, undefined, "russian")

  console.log("Начинаем поиск...")
  const result = await search(db, {
    term: "договор",
    // tolerance: 3,
    // relevance: {
    //   // Term frequency saturation parameter.
    //   // Увеличиваем для большей чувствительности к точным совпадениям
    //   // Default value: 1.2
    //   // Recommended value: between 1.2 and 2
    //   k: 2,

    //   // // Length normalization parameter.
    //   // // Уменьшаем для приоритизации точных совпадений
    //   // // Default value: 0.75
    //   // // Recommended value: > 0.75
    //   // b: 0.5,

    //   // // Frequency normalization lower bound.
    //   // // Увеличиваем для большей чувствительности к редким терминам
    //   // // Default value: 0.5
    //   // // Recommended value: between 0.5 and 1
    //   // d: 0.8,
    // },
  })
  console.log(result)
  console.log("Поиск завершен")
}
// Вызываем функцию инициализации
initializeTensorFlowAndDB().catch(console.error)
