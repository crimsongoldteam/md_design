import { EditorWrapper } from "./editorWrapper"
import { GroupModel } from "./groupModel"
import * as monaco from "monaco-editor-core"

// class CloseButtonWidget implements monaco.editor.IOverlayWidget {
//   private readonly domNode: HTMLElement

//   constructor() {
//     this.domNode = document.createElement("div")
//     this.domNode.innerHTML = "×"
//     this.domNode.classList.add("group-editor-close-button")
//     // this.domNode.style.position = "absolute"
//     // this.domNode.style.top = "10px"
//     // this.domNode.style.right = "10px"
//     // this.domNode.style.cursor = "pointer"
//     // this.domNode.style.color = "white"
//     // this.domNode.style.backgroundColor = "#333"
//     // this.domNode.style.borderRadius = "3px"
//     // this.domNode.style.padding = "2px 8px"
//     // this.domNode.style.zIndex = "100"
//   }

//   getPosition(): monaco.editor.IOverlayWidgetPosition | null {
//     return {
//       preference: monaco.editor.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER,
//     }
//   }
//   getMinContentWidthInPx?(): number {
//     return 0
//   }
//   public getId(): string {
//     return "close-button-widget"
//   }

//   public getDomNode(): HTMLElement {
//     return this.domNode
//   }
// }

export class GroupEditorWrapper extends EditorWrapper {
  constructor(container: HTMLElement, model: GroupModel) {
    super(container, model)

    // this.editor.addOverlayWidget(new CloseButtonWidget())
  }
}
