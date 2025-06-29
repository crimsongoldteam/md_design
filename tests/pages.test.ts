import { test } from "vitest"
import { expectFormattedText } from "./utils"

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

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
})

test("Page in group", () => {
  const before = `
#Заголовок 1 #Заголовок 2
  Элемент+/Страница 2
    +	Элемент на странице 2`

  const after = `
#Заголовок 1 #Заголовок 2
  Элемент    +/Страница 2
             +  Элемент на странице 2`

  expectFormattedText(before, after)
})

test("Page with property", () => {
  const before = `
/Страница 1{ЦветФона=Красный}
  Элемент 1`

  const after = `
/Страница 1 {ЦветФона = Красный}
  Элемент 1`

  expectFormattedText(before, after)
})

test("Ignore empty lines inside page", () => {
  const before = `
/Страница

  Элемент 1`

  const after = `
/Страница
  Элемент 1`

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
})

test("One line group in page", () => {
  const before = `
/Страница 1
  Элемент 1 & Элемент 2
  Элемент 3`

  const after = `
/Страница 1
  Элемент 1 & Элемент 2
  Элемент 3`

  expectFormattedText(before, after)
})
