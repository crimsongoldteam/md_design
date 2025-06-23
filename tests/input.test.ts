import { expect, test } from "vitest"
import { formatText } from "./utils"

test("Input field", () => {
  expect(formatText("Поле:Значение")).toBe("Поле: Значение")
})
