import { defineConfig } from "vitest/config"
import * as path from "path"

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./lib"),
    },
  },
  test: {
    globals: true,
    coverage: { enabled: false, provider: "v8" },
    environment: "jsdom",
    alias: [
      {
        find: /^monaco-editor-core$/,
        replacement: path.resolve(__dirname, "./node_modules/monaco-editor-core/esm/vs/editor/editor.api"),
      },
    ],
  },
})
