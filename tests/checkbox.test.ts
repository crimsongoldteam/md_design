import { expect, test } from "vitest"
import { cleanString, formatText, expectFormattedText } from "./utils"

test("Create checkbox with mark", () => {
  const before = `
[v] Флажок
`

  const after = `
[X] Флажок`

  expectFormattedText(before, after)
})

test("Create checkbox without mark", () => {
  const before = `
[] Флажок
`

  const after = `
[ ] Флажок`

  expectFormattedText(before, after)
})

test("Create checkbox-switch with mark", () => {
  const before = `
[|v] Флажок
`

  const after = `
[ |1] Флажок`

  expectFormattedText(before, after)
})

test("Create checkbox-switch without mark", () => {
  const before = `
[v|] Флажок
`

  const after = `
[0| ] Флажок`

  expectFormattedText(before, after)
})

test("Create checkbox with left header", () => {
  const before = `
Флажок [v]
`

  const after = `
Флажок [X]`

  expectFormattedText(before, after)
})
