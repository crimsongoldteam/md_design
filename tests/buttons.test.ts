import { test } from "vitest"
import { expectFormattedText } from "./utils"

test("Command bar with picture button", () => {
  const before = "<@Назад>"
  const after = "< @Назад >"

  expectFormattedText(before, after)
})

test("Command bar with left picture button", () => {
  const before = "<@Назад Текст>"
  const after = "< @Назад Текст >"

  expectFormattedText(before, after)
})

test("Command bar with right picture button", () => {
  const before = "<Текст @Назад>"
  const after = "< Текст @Назад >"

  expectFormattedText(before, after)
})

test("Command bar with two buttons", () => {
  const before = "<Кнопка 1|Кнопка 2>"
  const after = "< Кнопка 1 | Кнопка 2 >"

  expectFormattedText(before, after)
})

test("Command bar with empty button", () => {
  const before = "<>"
  const after = "< >"

  expectFormattedText(before, after)
})

test("Command bar with menu", () => {
  const before = `
<Кнопка 1|Меню
Меню 
.Подменю
.Подменю 2>`

  const after = `
< Кнопка 1 | Меню
Меню
. Подменю
. Подменю 2 >`

  expectFormattedText(before, after)
})

test("Command bar with submenu with picture and text", () => {
  const before = `
<Кнопка 1|@Печать Печать
Печать
.Подменю>`

  const after = `
< Кнопка 1 | @Печать Печать
Печать
. Подменю >`

  expectFormattedText(before, after)
})

test("Command bar with submenu with picture", () => {
  const before = `
<Кнопка 1|@Печать
@Печать
.Подменю>`

  const after = `
< Кнопка 1 | @Печать
@Печать
. Подменю >`

  expectFormattedText(before, after)
})
