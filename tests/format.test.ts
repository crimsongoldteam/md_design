import { expect, test } from "vitest"
import { FormModel } from "@/editor/formModel"

test("format 'field:value' to equal 'field: value'", () => {
  const formModel = new FormModel()
  formModel.setText("field:value")
  formModel.format()
  expect(formModel.getText()).toBe("field: value")
})

test("format 'description{ЦветФона=Зеленый}' to equal 'description {ЦветФона = Зеленый}'", () => {
  const formModel = new FormModel()
  formModel.setText("description{ЦветФона=Зеленый}")
  formModel.format()
  expect(formModel.getText()).toBe("description {ЦветФона = Зеленый}")
})
