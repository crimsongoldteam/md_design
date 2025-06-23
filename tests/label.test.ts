import { expect, test } from "vitest"
import { formatText } from "./utils"

test("Label field with property", () => {
  expect(formatText("Надпись{ЦветФона=Зеленый}")).toBe("Надпись {ЦветФона = Зеленый}")
})
