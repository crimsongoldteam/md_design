import { Exporter, Importer, ElementPathData, FormModel } from "@/index"
import { expect } from "vitest"

export function formatText(input: string): string {
  const formModel = new FormModel()
  formModel.setText(input)
  formModel.format()
  return formModel.getText()
}

export function cleanString(text: string): string {
  if (text.startsWith("\n")) {
    return text.replace(/^\n+/, "")
  }
  return text
}

export const expectFormattedText = (before: string, after: string) => {
  const formModel = new FormModel()
  formModel.setText(cleanString(before))
  formModel.format()

  expect(formModel.getText()).toBe(cleanString(after))

  const dataPath = new ElementPathData(formModel.cst, [], false)
  const json = Exporter.export(dataPath)
  const dataPathImported = Importer.import(json)

  formModel.reset()
  formModel.createOrUpdateElement(dataPathImported)
  expect(formModel.getText()).toBe(cleanString(after))
}
