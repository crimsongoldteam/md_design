import { editor as monacoEditor } from "monaco-editor-core"

declare global {
  interface Window {
    setEditorText: (text: string) => void
    getEditorText: () => string
    setEditorPosition: (lineNumber: number, column: number) => void
  }
  interface MouseEvent {
    eventData1C: any
  }
}

const container = document.getElementById("container")
if (container) {
  let editor: any = monacoEditor.create(container, {
    language: "plaintext",
    minimap: { enabled: false },
    unicodeHighlight: {
      ambiguousCharacters: false,
    },
    suggest: { showWords: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    selectionHighlight: false,
    lineNumbers: "off",
    contextmenu: true,
    insertSpaces: false,
    tabSize: 2,
  })

  window.setEditorText = function (text) {
    editor.setValue(text)
  }

  window.getEditorText = function () {
    return editor.getValue()
  }

  window.setEditorPosition = function (lineNumber, column) {
    return editor.setPosition({
      lineNumber: lineNumber,
      column: column,
    })
  }

  const sendEvent = function (eventName: string, eventParams: any) {
    let lastEvent = new MouseEvent("click")
    lastEvent.eventData1C = { event: eventName, params: eventParams }
    return dispatchEvent(lastEvent)
  }

  editor.onDidChangeCursorSelection((e: any) => {
    let params = {
      line: e.selection.startLineNumber,
      column: e.selection.startColumn,
    }
    sendEvent("EVENT_CHANGE_CURSOR_SELECTION", params)
  })

  editor.onDidChangeModelContent((_e: any) => {
    let params = { text: editor.getValue() }
    sendEvent("EVENT_CHANGE_CONTENT", params)
  })

  window.addEventListener("resize", function () {
    editor.layout()
  })
}
