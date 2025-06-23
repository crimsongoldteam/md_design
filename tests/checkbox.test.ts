import { expect, test } from "vitest"
import { cleanString, formatText } from "./utils"

test("Create checkbox with mark", () => {
  const before = `
[v] Флажок
`

  const after = `
[X] Флажок`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create checkbox without mark", () => {
  const before = `
[] Флажок
`

  const after = `
[ ] Флажок`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create checkbox-switch with mark", () => {
  const before = `
[|v] Флажок
`

  const after = `
[ |1] Флажок`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create checkbox-switch without mark", () => {
  const before = `
[v|] Флажок
`

  const after = `
[0| ] Флажок`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create checkbox with left header", () => {
  const before = `
Флажок [v]
`

  const after = `
Флажок [X]`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})
