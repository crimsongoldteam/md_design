/// <reference types="vitest/config" />
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import zipPack from "vite-plugin-zip-pack"
import * as path from "path"
import monacoEditorPlugin from "vite-plugin-monaco-editor"
import { fixHtmlPlugin } from "./vite-build-plugins/fixHtml/fixMonacoPlugin"
import { replaceContentPlugin } from "./vite-build-plugins/replace"

export default defineConfig((api) => {
  // @ts-ignore
  const monacoPlugin = monacoEditorPlugin.default({
    globalAPI: false,
    languageWorkers: [],
    customWorkers: [
      {
        label: "editorWorkerService",
        entry: "monaco-editor-core/esm/vs/editor/editor.worker",
      },
    ],
  })

  fixHtmlPlugin(monacoPlugin)

  return {
    test: {
      isolate: false,
      globals: true,
      environment: "node",
      coverage: {
        enabled: true,
        provider: "v8",
        exclude: [
          ".yarn/**",
          "temp/**",
          "node_modules/**",
          "tests/**",
          "dist/**",
          "vitest.config.ts",
          "vite.config.ts",
          "vite.config.playground.ts",
        ],
      },
    },

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
      replaceContentPlugin(),

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
