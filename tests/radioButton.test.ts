import { test } from "vitest"
import { expectFormattedText } from "./utils"

test("Create radio button", () => {
  const before = `
(v)Вариант 1()Вариант 2
`
  const after = `
(X)Вариант 1 ( )Вариант 2`

  expectFormattedText(before, after)
})

// test("Create radio button with header", () => {
//   const before = `
// Заголовок:(v)Вариант 1()Вариант 2
// `
//   const after = `
// Заголовок: ( )Вариант 1( )Вариант 2`

//   expectFormattedText(before, after)
// })
