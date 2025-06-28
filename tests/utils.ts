import { CSTModel } from "@/editor/cstModel"
import { MainCursorBuilder, MainCursorFormatter } from "@/editor/mainCursor"
import { ModelCursor } from "@/editor/modelCursorHelpers"
import { Exporter, Importer, ElementPathData } from "@/index"
import { expect } from "vitest"

export function formatText(input: string): string {
  const model = new CSTModel()
  const mainCursor = new ModelCursor(model, new MainCursorBuilder(), new MainCursorFormatter())
  model.registerCursor(mainCursor)
  mainCursor.text = input
  mainCursor.format()
  return mainCursor.text
}

export function cleanString(text: string): string {
  if (text.startsWith("\n")) {
    return text.replace(/^\n+/, "")
  }
  return text
}

export const expectFormattedText = (before: string, after: string) => {
  const model = new CSTModel()
  const mainCursor = new ModelCursor(model, new MainCursorBuilder(), new MainCursorFormatter())
  model.registerCursor(mainCursor)
  mainCursor.text = cleanString(before)
  mainCursor.format()

  expect(mainCursor.text).toBe(cleanString(after))

  const dataPath = new ElementPathData(model.cst, [], false)
  const json = Exporter.export(dataPath) as string
  const dataPathImported = Importer.import(json)

  // mainCursor.reset()
  model.createOrUpdateElement(dataPathImported)
  expect(mainCursor.text).toBe(cleanString(after))
}
