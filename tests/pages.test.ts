import { expect, test } from "vitest"
import { cleanString, formatText } from "./utils"

test("Page with two pages", () => {
  const before = `
/Страница 1
  Элемент 1
/Страница 2
  Элемент 2`

  const after = `
/Страница 1
  Элемент 1
/Страница 2
  Элемент 2`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Element after page", () => {
  const before = `
/Страница 1
  Элемент 1
Элемент после страниц`

  const after = `
/Страница 1
  Элемент 1
Элемент после страниц`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Nested pages", () => {
  const before = `
/Страница 1
  /Страница 2
    Элемент 2`

  const after = `
/Страница 1
  /Страница 2
    Элемент 2`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Vertical group in page", () => {
  const before = `
/Страница 1
  #Группа 1
    Реквизит 1`

  const after = `
/Страница 1
  #Группа 1
    Реквизит 1`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Horizonatal group in page", () => {
  const before = `
/Страница 1
  #Группа 1 #Группа 2
    Реквизит 1 + Реквизит 2`

  const after = `
/Страница 1
  #Группа 1    #Группа 2
    Реквизит 1 +Реквизит 2`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Page in group", () => {
  const before = `
#Заголовок 1 #Заголовок 2
  /Страница 1 +/Страница 2
    Элемент на странице 1 +	Элемент на странице 2`

  const after = `
#Заголовок 1              #Заголовок 2
  /Страница 1             +/Страница 2
    Элемент на странице 1 +  Элемент на странице 2`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Page with property", () => {
  const before = `
/Страница 1{ЦветФона=Красный}
  Элемент 1`

  const after = `
/Страница 1 {ЦветФона = Красный}
  Элемент 1`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Ignore empty lines inside page", () => {
  const before = `
/Страница


  Элемент 1`

  const after = `
/Страница
  Элемент 1`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Group in several pages", () => {
  const before = `
/Вкладка 1
  #Группа 1#Группа2
  Реквизит 1+Реквизит2
/Вкладка 2
  Просто текст`

  const after = `
/Вкладка 1
  #Группа 1    #Группа2
    Реквизит 1 +Реквизит2
/Вкладка 2
  Просто текст`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})
