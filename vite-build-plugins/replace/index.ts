import { readFile, writeFile } from "node:fs/promises"
import { Plugin } from "vite"

export default function replaceContentPlugin(): Plugin {
  return {
    name: "replace-content-plugin",
    async closeBundle() {
      const buildDir = "temp/monacoeditorwork"
      const path = buildDir + "/editor.worker.bundle.js"
      let content: string = await readFile(path, { encoding: "utf8" })
      content = content.replace(/globalThis/g, "self")

      await writeFile(path, content)
    },
  }
}
