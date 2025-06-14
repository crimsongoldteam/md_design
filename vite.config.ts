import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import path from "path"
import monacoEditorPlugin from "vite-plugin-monaco-editor"
import replaceGlobalThis from "./vite-build-plugins/replace"
import zipPack from "vite-plugin-zip-pack"

export default defineConfig((api) => {
  const isDev = api.mode === "development"
  // @ts-expect-error
  const monacoPlugin = monacoEditorPlugin.default({
    globalAPI: false,
    languageWorkers: ["editorWorkerService"],
  })

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
  return {
    build: {
      minify: false,
      sourcemap: true,

      outDir: "temp",
      target: "es2018",
    },
    esbuild: {
      target: "es2018",
      include: /\.(ts|jsx|tsx)$/,
    },

    plugins: [
      monacoPlugin,
      viteSingleFile({
        removeViteModuleLoader: true,
        deleteInlinedFiles: true,
      }),
      replaceGlobalThis(),
      zipPack({ inDir: "temp", outFileName: "../src/MDDesign/Templates/БиблиотекаJS/Ext/Template.bin" }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./lib"),
        "@assets": path.resolve(__dirname, "./assets"),
      },
    },
  }
})
