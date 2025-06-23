import { expect, test } from "vitest"
import { formatText, cleanString } from "./utils"

test("Group with two groups", () => {
  const before = `
#Группа 1 #Группа 2
  Элемент группы 1 + Элемент группы 2`

  const after = `
#Группа 1          #Группа 2
  Элемент группы 1 +Элемент группы 2`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Element before group", () => {
  const before = `
#Группа 1 # Группа 2
Элемент группы 1 + Элемент группы 2

Элемент после группы`

  const after = `
#Группа 1          #Группа 2
  Элемент группы 1 +Элемент группы 2
Элемент после группы`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Second group without content", () => {
  const before = `
#Группа 1 #Группа 2
Элемент группы 1 +`

  const after = `
#Группа 1          #Группа 2
  Элемент группы 1 +`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("First group without content", () => {
  const before = `
#Группа 1 # Группа 2
+ Элемент группы 1`

  const after = `
#Группа 1 #Группа 2
          +Элемент группы 1`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Allow to pass group", () => {
  const before = `
#Группа 1 #Группа 2 #Группа 3
Элемент группы 1+Элемент группы 2`

  const after = `
#Группа 1          #Группа 2         #Группа 3
  Элемент группы 1 +Элемент группы 2 +`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Define end of group", () => {
  const before = `
#Группа 1 #Группа 2
Элемент группы 1+Элемент группы 2
Элемент вне группы`

  const after = `
#Группа 1          #Группа 2
  Элемент группы 1 +Элемент группы 2
Элемент вне группы`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Set property to vertical group", () => {
  const before = `
#Группа 1 {ЦветФона = Красный} #Группа 2
Элемент группы 1 + Элемент группы 2`

  const after = `
#Группа 1 {ЦветФона = Красный} #Группа 2
  Элемент группы 1             +Элемент группы 2`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create group without title", () => {
  const before = `
# #
Элемент группы 1 + Элемент группы 2`

  const after = `
#                  #
  Элемент группы 1 +Элемент группы 2`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Set property to horizontal group", () => {
  const before = `
{ЦветФона = Красный}
#Группа 1 #Группа 2
Элемент группы 1 + Элемент группы 2`

  const after = `
{ЦветФона = Красный}
#Группа 1          #Группа 2
  Элемент группы 1 +Элемент группы 2`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})
