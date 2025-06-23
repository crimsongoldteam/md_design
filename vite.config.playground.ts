import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import * as path from "path"

export default defineConfig((api) => {
  const isDev = api.mode === "development"

  return {
    build: {
      minify: !isDev,
      sourcemap: isDev,
      target: "es2018",
      rollupOptions: {
        input: {
          playground: path.resolve(__dirname, "./playground.html"),
        },
      },
    },
    esbuild: {
      // Configure this value when the browser version of the development environment is lower
      target: "es2018",
      include: /\.(ts|jsx|tsx)$/,
    },
    plugins: [viteSingleFile()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./lib"),
      },
    },
    server: {
      open: "/playground.html",
    },
  }
})
