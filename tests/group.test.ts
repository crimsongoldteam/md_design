import { expect, test } from "vitest"
import { formatText, cleanString, expectFormattedText } from "./utils"

test("Group with two groups", () => {
  const before = `
#Группа 1 #Группа 2
  Элемент группы 1 + Элемент группы 2`

  const after = `
#Группа 1          #Группа 2
  Элемент группы 1 +Элемент группы 2`

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
})

test("Second group without content", () => {
  const before = `
#Группа 1 #Группа 2
Элемент группы 1 +`

  const after = `
#Группа 1          #Группа 2
  Элемент группы 1 +`

  expectFormattedText(before, after)
})

test("First group without content", () => {
  const before = `
#Группа 1 # Группа 2
+ Элемент группы 1`

  const after = `
#Группа 1 #Группа 2
          +Элемент группы 1`

  expectFormattedText(before, after)
})

test("Allow to pass group", () => {
  const before = `
#Группа 1 #Группа 2 #Группа 3
Элемент группы 1+Элемент группы 2`

  const after = `
#Группа 1          #Группа 2         #Группа 3
  Элемент группы 1 +Элемент группы 2 +`

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
})

test("Set property to vertical group", () => {
  const before = `
#Группа 1 {ЦветФона = Красный} #Группа 2
Элемент группы 1 + Элемент группы 2`

  const after = `
#Группа 1 {ЦветФона = Красный} #Группа 2
  Элемент группы 1             +Элемент группы 2`

  expectFormattedText(before, after)
})

test("Create group without title", () => {
  const before = `
# #
Элемент группы 1 + Элемент группы 2`

  const after = `
#                  #
  Элемент группы 1 +Элемент группы 2`

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
})

test("Vertical group", () => {
  const before = `
#Группа
  Элемент`

  const after = `
#Группа
  Элемент`

  expectFormattedText(before, after)
})
test("Vertical group and separate element", () => {
  const before = `
#Группа
Элемент`

  const after = `
#Группа
Элемент`

  expectFormattedText(before, after)
})

test("Ignore empty lines inside vertical group", () => {
  const before = `
#Группа

  Элемент`

  const after = `
#Группа
  Элемент`

  expectFormattedText(before, after)
})
