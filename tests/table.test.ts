import { expect, test } from "vitest"
import { cleanString, formatText } from "./utils"

test("Create short-format table", () => {
  const before = `
Колонка 1 | Колонка 2
--- | ---
Значение 1 | Значение 2`

  const after = `
| Колонка 1  | Колонка 2  |
| ---------- | ---------- |
| Значение 1 | Значение 2 |`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create full-format table", () => {
  const before = `
|Колонка 1 | Колонка 2|
|--- | --- |
|Значение 1 | Значение 2|`

  const after = `
| Колонка 1  | Колонка 2  |
| ---------- | ---------- |
| Значение 1 | Значение 2 |`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create table with one column", () => {
  const before = `
|Список|
| ---|
|Значение 1|
|Значение 2|`

  const after = `
| Список     |
| ---------- |
| Значение 1 |
| Значение 2 |`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create table with multi-level rows", () => {
  const before = `
|Колонка 1 || Колонка 2|
|Подколонка 1.1 | Подколонка 1.2 ||
|---|---|---|
| Значение 1|| Значение 3 |
| Значение 1.1| Значение 1.2||
| Значение 2|| Значение 4 |
| Значение 2.1| Значение 2.2||`

  const after = `
| Колонка 1                      | Колонка 2  |
| ------------------------------ | ---------- |
| Значение 1                     | Значение 3 |
| Значение 1.1   | Значение 1.2  |            |
| Значение 2                     | Значение 4 |
| Значение 2.1   | Значение 2.2  |            |`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create table with group of columns", () => {
  const before = `
|-Группа 1-||
|Подколонка 1.1|Подколонка 1.2|
|---|---|
|Значение 1.1|Значение 1.2|
|Значение 2.1|Значение 2.2|`

  const after = `
| -Группа 1-                      |
| ------------------------------ |
| Значение 1.1   | Значение 1.2    |
| Значение 2.1   | Значение 2.2    |`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create two tables", () => {
  const before = `
|Колонка 1| Колонка 2  |
|---|---|
|Значение 1|Значение 2|

|Колонка 3|Колонка 4|
|---|---|
|Значение 3|Значение 4|`

  const after = `
| Колонка 1  | Колонка 2  |
| ---------- | ---------- |
| Значение 1 | Значение 2 |

| Колонка 3  | Колонка 4  |
| ---------- | ---------- |
| Значение 3 | Значение 4 |`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create table with unchecked checkbox", () => {
  const before = `
|Колонка 1|
|---|
|[]Значение 1|`

  const after = `
| Колонка 1      |
| -------------- |
| [ ] Значение 1 |`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})

test("Create table with checked checkbox", () => {
  const before = `
  |Колонка 1|
  |---|
  |[в]Значение 1|`

  const after = `
  | Колонка 1      |
  | -------------- |
  | [X] Значение 1 |`

  expect(formatText(cleanString(before))).toBe(cleanString(after))
})
