import { test, expect } from "vitest"
import { cleanString, expectFormattedText } from "./utils"
import { CSTGenerator } from "@/editor/cstGenerator"
import { PropertiesFormatter } from "@/formatter/propertiesFormatter"
import { TypeDescription } from "@/elements/typeDescription"
import { DateFractions } from "@/elements/types"

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

// Тесты для метода isEqual
test("isEqual - одинаковые объекты", () => {
  const type1 = new TypeDescription("Строка")
  type1.length = 10
  type1.auto = false

  const type2 = new TypeDescription("Строка")
  type2.length = 10
  type2.auto = false

  expect(type1.isEqual(type2)).toBe(true)
})

test("isEqual - разные типы", () => {
  const type1 = new TypeDescription("Строка")
  const type2 = new TypeDescription("Число")

  expect(type1.isEqual(type2)).toBe(false)
})

test("isEqual - разные длины массивов types", () => {
  const type1 = new TypeDescription("Строка")
  type1.types.push("Дополнительный")

  const type2 = new TypeDescription("Строка")

  expect(type1.isEqual(type2)).toBe(false)
})

test("isEqual - разные свойства", () => {
  const type1 = new TypeDescription("Число")
  type1.digits = 10
  type1.fractionDigits = 2

  const type2 = new TypeDescription("Число")
  type2.digits = 15
  type2.fractionDigits = 2

  expect(type1.isEqual(type2)).toBe(false)
})

test("isEqual - сравнение с самим собой", () => {
  const type1 = new TypeDescription("Строка")
  type1.length = 10
  type1.auto = false

  expect(type1.isEqual(type1)).toBe(true)
})

test("isEqual - сложные типы с разными свойствами", () => {
  const type1 = new TypeDescription("Дата")
  type1.dateFractions = DateFractions.DateTime
  type1.isNew = true
  type1.auto = false

  const type2 = new TypeDescription("Дата")
  type2.dateFractions = DateFractions.Date
  type2.isNew = true
  type2.auto = false

  expect(type1.isEqual(type2)).toBe(false)
})

test("isEqual - одинаковые сложные типы", () => {
  const type1 = new TypeDescription("Дата")
  type1.dateFractions = DateFractions.DateTime
  type1.isNew = true
  type1.auto = false
  type1.types.push("Дополнительный")

  const type2 = new TypeDescription("Дата")
  type2.dateFractions = DateFractions.DateTime
  type2.isNew = true
  type2.auto = false
  type2.types.push("Дополнительный")

  expect(type1.isEqual(type2)).toBe(true)
})

test("isEqual - разный порядок элементов в types", () => {
  const type1 = new TypeDescription("Строка")
  type1.types.push("Число")
  type1.types.push("Дата")

  const type2 = new TypeDescription("Дата")
  type2.types.push("Число")
  type2.types.push("Строка")

  expect(type1.isEqual(type2)).toBe(true)
})

test("isEqual - разный порядок элементов в types с дополнительными свойствами", () => {
  const type1 = new TypeDescription("Строка")
  type1.types.push("Число")
  type1.types.push("Дата")
  type1.length = 10
  type1.auto = false

  const type2 = new TypeDescription("Дата")
  type2.types.push("Число")
  type2.types.push("Строка")
  type2.length = 10
  type2.auto = false

  expect(type1.isEqual(type2)).toBe(true)
})
