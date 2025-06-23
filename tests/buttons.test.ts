import { expect, test } from "vitest"
import { formatText, cleanString } from "./utils"

test("Command bar with two buttons", () => {
  expect(formatText("<Кнопка 1|Кнопка 2>")).toBe("< Кнопка 1 | Кнопка 2 >")
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

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})
