import { test, expect } from "vitest"
import { cleanString, expectFormattedText } from "./utils"
import { CSTGenerator } from "@/editor/cstGenerator"
import { PropertiesFormatter } from "@/formatter/propertiesFormatter"

test("Format linked types", () => {
  const before = "Поле:Значение {Тип=Справочники.Контрагенты}"
  const after = "Поле: Значение {Тип = Справочник.Контрагенты}"

  expectFormattedText(before, after)
})

test("Format types", () => {
  const before = "Справочники.Контрагенты"
  const after = "Справочник.Контрагенты"

  const typeDescription = CSTGenerator.buildTypeDescription(before)
  const formatter = new PropertiesFormatter()
  const result = formatter.formatTypeDescription(typeDescription)

  expect(result).toBe(cleanString(after))
})

test("Format complextypes", () => {
  const before = "Справочники.Контрагенты, Документы.Реализация"
  const after = "Документ.Реализация, Справочник.Контрагенты"

  const typeDescription = CSTGenerator.buildTypeDescription(before)
  const formatter = new PropertiesFormatter()
  const result = formatter.formatTypeDescription(typeDescription)

  expect(result).toBe(cleanString(after))
})

test("Format types with params", () => {
  const before = "Число (10)"
  const after = "Число(10)"

  const typeDescription = CSTGenerator.buildTypeDescription(before)
  const formatter = new PropertiesFormatter()
  const result = formatter.formatTypeDescription(typeDescription)

  expect(result).toBe(cleanString(after))
})
