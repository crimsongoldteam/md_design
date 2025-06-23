import { test } from "vitest"
import { expectFormattedText } from "./utils"

test("Label field with property", () => {
  const before = "Надпись{ЦветФона=Зеленый}"
  const after = "Надпись {ЦветФона = Зеленый}"

  expectFormattedText(before, after)
})
