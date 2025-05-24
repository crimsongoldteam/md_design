import fs from "node:fs/promises"
import { Plugin } from "vite"

export default function replaceContentPlugin(): Plugin {
  return {
    name: "replace-content-plugin",
    async closeBundle() {
      const buildDir = "temp/monacoeditorwork"
      const path = buildDir + "/editor.worker.bundle.js"
      let content: string = await fs.readFile(path, { encoding: "utf8" })
      content = content.replaceAll("globalThis", "self")

      await fs.writeFile(path, content)
    },
  }
}
