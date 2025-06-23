import { test } from "vitest"
import { expectFormattedText } from "./utils"

test("Input field", () => {
  const before = "Поле:Значение"
  const after = "Поле: Значение"

  expectFormattedText(before, after)
})

test("Input field with properties", () => {
  const before = "Поле:Значение{ЦветФона=Зеленый}"
  const after = "Поле: Значение {ЦветФона = Зеленый}"

  expectFormattedText(before, after)
})

test("Input field with type declaration", () => {
  const before = "Поле:10.50{Тип=Число(15,2),Строка(100),Булево,Дата(Время)}"
  const after = "Поле: 10.50 { Тип = Число(15,2), Строка(100), Булево, Дата(Время) }"

  expectFormattedText(before, after)
})

test("Mulitline input field", () => {
  const before = `
Поле:Значение
___
Поле:Значение`

  const after = `
Поле: Значение
      ________
      ________`

  expectFormattedText(before, after)
})
