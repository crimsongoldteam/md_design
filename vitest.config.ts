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
    isolate: false,

    // globals: true,
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
    environment: "jsdom",
    alias: [
      {
        find: /^monaco-editor-core$/,
        replacement: path.resolve(__dirname, "./node_modules/monaco-editor-core/esm/vs/editor/editor.api"),
      },
    ],
  },
})
