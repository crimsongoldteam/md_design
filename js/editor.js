require.config({ paths: { vs: "vs" } });
require(["vs/editor/editor.main"], function () {
  var editor = monaco.editor.create(document.getElementById("container"), {
    minimap: { enabled: false },
    suggest: { showWords: false },
    autoResizeEditorLayout: true,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    selectionHighlight: false,
    lineNumbers: "off",
    contextmenu: true,
    insertSpaces:false,
    tabSize: 4
  });

  window.setEditorText = function (text) {
    editor.setValue(text);
  };

  window.getEditorText = function () {
    return editor.getValue();
  };
  
  window.setEditorPosition = function (lineNumber, column) {
    return editor.setPosition({
      lineNumber: lineNumber,
      column: column
    });
  };
  
  sendEvent = function (eventName, eventParams) {
    let lastEvent = new MouseEvent("click");
    lastEvent.eventData1C = { event: eventName, params: eventParams };
    return dispatchEvent(lastEvent);
  };

  editor.onDidChangeCursorSelection((e) => {
    let params = {
      line: e.selection.startLineNumber,
      column: e.selection.startColumn,
    };
    sendEvent("EVENT_CHANGE_CURSOR_SELECTION", params);
  });

  editor.onDidChangeModelContent((e) => {
    let params = { text: editor.getValue() };
    sendEvent("EVENT_CHANGE_CONTENT", params);
  });

  window.addEventListener("resize", function (event) {
    editor.layout();
  });
});
