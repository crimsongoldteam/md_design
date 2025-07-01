import * as monaco from "monaco-editor-core"
import { EditorWrapper } from "./editor/editorWrapper"
import { IEditorWrapper, IElementPathData, IModelCursor } from "./editor/interfaces"
import Split from "split.js"
import { IView } from "./interfaces"

export class View implements IView {
  private readonly mainEditor: IEditorWrapper
  private readonly groupEditor: IEditorWrapper
  private readonly mainCursor: IModelCursor
  private readonly groupCursor: IModelCursor
  private readonly mainEditorContainer: HTMLElement
  private readonly groupEditorContainer: HTMLElement

  private mainCursorLinks: monaco.languages.ILink[] = []
  private groupCursorLinks: monaco.languages.ILink[] = []

  private _currentEditor: IEditorWrapper

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

    this.mainEditorContainer = mainEditorContainer
    this.groupEditorContainer = groupEditorContainer

    monaco.languages.registerLinkProvider("plaintext", {
      provideLinks: this.provideLinks.bind(this),
      resolveLink: this.resolveLink.bind(this),
    })

    this.initSplitter()

    this.toggleGroupEditorVisible(false)
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
    return this._currentEditor.cursor
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
      const linksList = this.mainCursor.links
      this.mainCursorLinks = linksList.links
      return linksList
    }

    if (this.groupEditor.isEditorModel(model)) {
      const linksList = this.groupCursor.links
      this.groupCursorLinks = linksList.links
      return linksList
    }

    return undefined
  }

  private getCursorByLink(link: monaco.languages.ILink): IModelCursor | undefined {
    if (this.mainCursorLinks.includes(link)) {
      return this.mainCursor
    }

    if (this.groupCursorLinks.includes(link)) {
      return this.groupCursor
    }

    return undefined
  }

  private resolveLink(link: monaco.languages.ILink): monaco.languages.ProviderResult<monaco.languages.ILink> {
    const cursor = this.getCursorByLink(link)

    if (!cursor) {
      throw new Error("No cursor found")
    }

    const element = cursor.getElementDataAtPosition({
      line: link.range.startLineNumber,
      column: link.range.startColumn,
    })

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

    this._currentEditor = this.mainEditor
  }
}
