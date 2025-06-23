import { expect, test } from "vitest"
import { formatText } from "./utils"

test("Create one-line groups", () => {
  const before = "Элемент группы 1&Элемент группы 2"
  const after = "Элемент группы 1 & Элемент группы 2"

  expect(formatText(before)).toBe(after)
})

test("Create one-line group with element properties", () => {
  const before = "Элемент группы 1 {ЦветФона=Зеленый}&Элемент группы 2 {ЦветФона=Красный}"
  const after = "Элемент группы 1 {ЦветФона = Зеленый} & Элемент группы 2 {ЦветФона = Красный}"

  expect(formatText(before)).toBe(after)
})

test("Ignore empty values in one-line group", () => {
  const before = "Элемент группы 1&&Элемент группы 2"
  const after = "Элемент группы 1 & Элемент группы 2"

  expect(formatText(before)).toBe(after)
})
