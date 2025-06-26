import * as monaco from "monaco-editor-core"
import { EditorWrapper } from "./editor/editorWrapper"
import { IEditorWrapper, IElementPathData, IModelCursor } from "./editor/interfaces"
import Split from "split.js"
import { IView } from "./interfaces"

export class View implements IView {
  private readonly mainEditor: IEditorWrapper
  private readonly groupEditor: IEditorWrapper
  private readonly _currentEditor: IEditorWrapper
  private readonly _currentCursor: IModelCursor
  private readonly mainCursor: IModelCursor
  private readonly groupCursor: IModelCursor
  private readonly mainEditorContainer: HTMLElement
  private readonly groupEditorContainer: HTMLElement

  constructor(
    mainEditorContainer: HTMLElement,
    groupEditorContainer: HTMLElement,
    mainCursor: IModelCursor,
    groupCursor: IModelCursor
  ) {
    this.mainCursor = mainCursor
    this.groupCursor = groupCursor

    this.mainEditor = new EditorWrapper(mainEditorContainer, mainCursor)
    this.mainEditor.onSelectGroup = this.onSelectGroup.bind(this)

    this.groupEditor = new EditorWrapper(groupEditorContainer, groupCursor)
    this.groupEditor.onSelectGroup = this.onSelectGroup.bind(this)

    this.groupCursor.onRegisterCursor = this.onRegisterGroupCursor.bind(this)
    this.groupCursor.onUnregisterCursor = this.onUnregisterGroupCursor.bind(this)

    this._currentEditor = this.mainEditor
    this._currentCursor = this.mainCursor

    this.mainEditorContainer = mainEditorContainer
    this.groupEditorContainer = groupEditorContainer

    monaco.languages.registerLinkProvider("plaintext", {
      provideLinks: this.provideLinks.bind(this),
      resolveLink: this.resolveLink.bind(this),
    })

    this.initSplitter()
  }

  public onCloseGroup: () => void = () => {
    throw new Error("onCloseGroup is not implemented")
  }

  public onSelectGroup: (group: IElementPathData) => void = () => {
    throw new Error("onSelectGroup is not implemented")
  }

  get currentEditor(): IEditorWrapper {
    return this._currentEditor
  }

  get currentCursor(): IModelCursor {
    return this._currentCursor
  }

  public toggleGroupEditorVisible(show: boolean): void {
    const gutter = document.getElementsByClassName("gutter-vertical")[0] as HTMLElement
    this.groupEditorContainer.style.display = show ? "block" : "none"

    if (!show) {
      this.mainEditorContainer.classList.add("up-container-full-size")
    } else {
      this.mainEditorContainer.classList.remove("up-container-full-size")
    }

    gutter.style.display = show ? "block" : "none"
  }

  private provideLinks(
    model: monaco.editor.ITextModel,
    _token: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.ILinksList> {
    if (this.mainEditor.isEditorModel(model)) {
      return this.mainCursor.links
    }

    if (this.groupEditor.isEditorModel(model)) {
      return this.groupCursor.links
    }

    return undefined
  }

  private resolveLink(): monaco.languages.ProviderResult<monaco.languages.ILink> {
    const element = this.mainCursor.getCurrentElementData()
    if (!element) {
      throw new Error("No element found")
    }

    this.toggleGroupEditorVisible(true)
    this.onSelectGroup(element)

    return undefined
  }

  private initSplitter(): void {
    Split(["#container-up", "#container-down"], {
      direction: "vertical",
      gutterSize: 15,
      gutter: (_index, direction) => {
        const gutter = document.createElement("div")
        gutter.className = `gutter gutter-${direction}`

        const closeBtn = document.createElement("div")
        closeBtn.className = "group-editor-close-button"
        closeBtn.innerHTML = "×"
        closeBtn.onclick = this.onCloseGroupButtonClick.bind(this)

        gutter.appendChild(closeBtn)
        return gutter
      },
    })
  }

  private onCloseGroupButtonClick(e: Event): void {
    e.stopPropagation()
    this.onCloseGroup()
  }

  private onRegisterGroupCursor(): void {
    this.toggleGroupEditorVisible(true)
  }

  private onUnregisterGroupCursor(): void {
    this.toggleGroupEditorVisible(false)
  }
}
