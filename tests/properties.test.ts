import { test } from "vitest"
import { expectFormattedText } from "./utils"

test("Clean wrong properties", () => {
  const before = "Надпись {Свойство с ошибкой = Зеленый}"
  const after = "Надпись {Свойствосошибкой = Зеленый}"

  expectFormattedText(before, after)
})
