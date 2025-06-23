import { FormModel } from "@/editor/formModel"

export function formatText(input: string): string {
  const formModel = new FormModel()
  formModel.setText(input)
  formModel.format()
  return formModel.getText()
}

export function cleanString(text: string): string {
  return text.replace(/^\n+/, "")
}
