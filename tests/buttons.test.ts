import { test } from "vitest"
import { expectFormattedText } from "./utils"

test("Command bar with two buttons", () => {
  const before = "<Кнопка 1|Кнопка 2>"
  const after = "< Кнопка 1 | Кнопка 2 >"

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
