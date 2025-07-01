import { Plugin } from "vite"

export function fixHtmlPlugin(monacoPlugin: Plugin): void {
  monacoPlugin.transformIndexHtml = (_html) => {
    const script = `function getDirectoryUrlSimple(fileUrl) {
        return fileUrl.substring(0, fileUrl.lastIndexOf("/"))
      }
      self["MonacoEnvironment"] = (function (paths) {
        return {
          globalAPI: false,
          getWorkerUrl: function (moduleId, label) {
            var result = paths[label]
            var currentUrl = String(window.location)
            result = getDirectoryUrlSimple(currentUrl) + result
            var js = "/*" + label + '*/importScripts("' + result + '");'
            var blob = new Blob([js], { type: "application/javascript" })
            return URL.createObjectURL(blob)
          },
        }
      })({
        editorWorkerService: "/monacoeditorwork/editor.worker.bundle.js",
      })`
    return [
      {
        tag: "script",
        children: script,
        injectTo: "head-prepend",
      },
    ]
  }
}
