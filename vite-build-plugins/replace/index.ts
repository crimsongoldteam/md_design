import { promises as fs } from "node:fs"
import { Plugin } from "vite"

export function replaceContentPlugin(): Plugin {
  return {
    name: "replace-content-plugin",
    async closeBundle() {
      const buildDir = "temp/monacoeditorwork"
      const path = buildDir + "/editor.worker.bundle.js"
      let content: string = await fs.readFile(path, { encoding: "utf8" })
      // @ts-ignore
      content = content.replaceAll("globalThis", "self")

      await fs.writeFile(path, content)
    },
  }
}
