import { test } from "vitest"
import { expectFormattedText } from "./utils"

test("Create checked checkbox", () => {
  const before = `
[v] Флажок`
  const after = `
[X] Флажок`

  expectFormattedText(before, after)
})

// test("Create unchecked checkbox", () => {
//   const before = `
// [] Флажок
// `
//   const after = `
// [ ] Флажок`

//   expectFormattedText(before, after)
// })

// test("Create checked switch", () => {
//   const before = `
// [|v] Флажок
// `
//   const after = `
// [ |1] Флажок`

//   expectFormattedText(before, after)
// })

// test("Create unchecked switch", () => {
//   const before = `
// [v|] Флажок
// `
//   const after = `
// [0| ] Флажок`

//   expectFormattedText(before, after)
// })

// test("Create checked checkbox with left header", () => {
//   const before = `
// Флажок [v]
// `
//   const after = `
// Флажок [X]`

//   expectFormattedText(before, after)
// })

// test("Create unchecked checkbox with left header", () => {
//   const before = `
// Флажок [ ]
// `
//   const after = `
// Флажок [ ]`

//   expectFormattedText(before, after)
// })

// test("Create unchecked switch with left header", () => {
//   const before = `
// Флажок [v|]`
//   const after = `
// Флажок [0| ]`

//   expectFormattedText(before, after)
// })

// test("Create checked switch with left header", () => {
//   const before = `
// Флажок [|v]`

//   const after = `
// Флажок [ |1]`

//   expectFormattedText(before, after)
// })
