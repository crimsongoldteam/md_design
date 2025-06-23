import { test } from "vitest"
import { expectFormattedText } from "./utils"

test("Create one-line groups", () => {
  const before = "Элемент группы 1&Элемент группы 2"
  const after = "Элемент группы 1 & Элемент группы 2"

  expectFormattedText(before, after)
})

test("Create one-line group with element properties", () => {
  const before = "Элемент группы 1 {ЦветФона=Зеленый}&Элемент группы 2 {ЦветФона=Красный}"
  const after = "Элемент группы 1 {ЦветФона = Зеленый} & Элемент группы 2 {ЦветФона = Красный}"

  expectFormattedText(before, after)
})

test("Ignore empty values in one-line group", () => {
  const before = "Элемент группы 1&&Элемент группы 2"
  const after = "Элемент группы 1 & Элемент группы 2"

  expectFormattedText(before, after)
})

test("One-line group with properties", () => {
  const before = `
{ЦветФона=Зеленый}
Элемент группы 1&Элемент группы 2`

  const after = `
{ЦветФона = Зеленый}
Элемент группы 1 & Элемент группы 2`

  expectFormattedText(before, after)
})
