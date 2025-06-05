import { FormElement } from "../parser/visitorTools/formElements"
import editorWorker from "monaco-editor-core/esm/vs/editor/editor.worker?worker"
;(self as any).MonacoEnvironment = {
  getWorker(): Worker {
    return new editorWorker()
  },
}

export class TreeView {
  private readonly container: HTMLElement
  private cst: FormElement = new FormElement()
  private hierarchy: string[] = []

  constructor(container: HTMLElement) {
    this.container = container
  }

  setCST(cst: FormElement): void {
    this.cst = cst
    this.update()
  }

  setHierarchy(hierarchy: string[]) {
    this.hierarchy = hierarchy
    this.update()
  }

  private update() {
    this.container.innerHTML = ""
    this.cstToTree(this.container, this.cst)
  }

  private cstToTree(currentHTMLElement: HTMLElement, cst: FormElement): void {
    const details = currentHTMLElement
      .appendChild(document.createElement("ul"))
      .appendChild(document.createElement("li"))
      .appendChild(document.createElement("details"))
    details.setAttribute("open", "")

    let caption = cst.uuid
    caption = caption + " " + JSON.stringify(cst.properties)

    const summary = details.appendChild(document.createElement("summary"))
    summary.textContent = caption

    if (this.hierarchy.find((item) => item === cst.uuid)) {
      summary.setAttribute("class", "tree-selected")
    }

    for (let childrenField of cst.childrenFields) {
      let items = (cst as any)[childrenField]
      for (let subItem of items) {
        this.cstToTree(details, subItem)
      }
    }
  }
}
