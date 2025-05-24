import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import path from "path"
import monacoEditorPlugin from "vite-plugin-monaco-editor"
import replaceGlobalThis from "./vite-build-plugins/replace"
// import zipPack from "vite-plugin-zip-pack"

export default defineConfig((api) => {
  const isDev = api.mode === "development"

  return {
    build: {
      minify: !isDev,
      sourcemap: isDev,
      target: "es2018",
    },
    esbuild: {
      // Configure this value when the browser version of the development environment is lower
      target: "es2018",
      include: /\.(ts|jsx|tsx)$/,
    },

    plugins: [
      monacoEditorPlugin({
        globalAPI: false,
        languageWorkers: [],
        customWorkers: [
          {
            label: "editorWorkerService",
            entry: "monaco-editor-core/esm/vs/editor/editor.worker",
          },
        ],
      }),
      viteSingleFile({
        removeViteModuleLoader: true,
        deleteInlinedFiles: true,
      }),
      replaceGlobalThis(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./assets"),
      },
    },
  }
})
