import fs from "node:fs/promises"
import { Plugin } from "vite"

export default function replaceContentPlugin(): Plugin {
  return {
    name: "replace-content-plugin",
    async closeBundle() {
      const buildDir = "dist/monacoeditorwork"
      const path = buildDir + "/editor.worker.bundle.js"
      let content: string = await fs.readFile(path, { encoding: "utf8" })
      content = content.replaceAll("globalThis", "self")

      // https://github.com/microsoft/vscode/pull/226119
      content = content.replaceAll(
        'var markRegex = new RegExp("\\\\bMARK:\\\\s*(.*)$", "d");',
        'const markFlag = "MARK:"; const markRegex = new RegExp("\\\\b${markFlag}\\\\s*(.*)$");'
      )

      content = content.replaceAll(
        "const column = match.indices[1][0] + 1;",
        "const startColumn = lineContent.indexOf(markFlag) + markFlag.length + 1;"
      )

      content = content.replaceAll(
        "const endColumn = match.indices[1][1] + 1;",
        "const endColumn = startColumn + match[1].length;"
      )

      content = content.replaceAll(
        "const range = { startLineNumber: lineNumber, startColumn: column, endLineNumber: lineNumber, endColumn };",
        "const range = { startLineNumber: lineNumber, startColumn, endLineNumber: lineNumber, endColumn };"
      )
      await fs.writeFile(path, content)
    },
  }
}
