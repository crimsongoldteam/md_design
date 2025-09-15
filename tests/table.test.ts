import { test } from "vitest"
import { expectFormattedText } from "./utils"

test("Create short-format table", () => {
  const before = `
Колонка 1 | Колонка 2
--- | ---
Значение 1 | Значение 2`

  const after = `
| Колонка 1  | Колонка 2  |
| ---------- | ---------- |
| Значение 1 | Значение 2 |`

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
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
| Колонка 1                      || Колонка 2  |
| Подколонка 1.1 | Подколонка 1.2 |            |
| -------------- | -------------- | ---------- |
| Значение 1                     || Значение 3 |
| Значение 1.1   | Значение 1.2   |            |
| Значение 2                     || Значение 4 |
| Значение 2.1   | Значение 2.2   |            |`

  expectFormattedText(before, after)
})

test("Create table with group of columns", () => {
  const before = `
|-Группа 1-||
|Подколонка 1.1|Подколонка 1.2|
|---|---|
|Значение 1.1|Значение 1.2|
|Значение 2.1|Значение 2.2|`

  const after = `
| - Группа 1 -                   ||
| Подколонка 1.1 | Подколонка 1.2 |
| -------------- | -------------- |
| Значение 1.1   | Значение 1.2   |
| Значение 2.1   | Значение 2.2   |`

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
})

test("Create two tables inside group", () => {
  const before = `
# #
+|Колонка 1| Колонка 2  |
+|---|---|
+|Значение 1|Значение 2|
+
+|Колонка 3|Колонка 4|
+|---|---|
+|Значение 3|Значение 4|`

  const after = `
# #
  +| Колонка 1  | Колонка 2  |
  +| ---------- | ---------- |
  +| Значение 1 | Значение 2 |
  +
  +| Колонка 3  | Колонка 4  |
  +| ---------- | ---------- |
  +| Значение 3 | Значение 4 |`

  expectFormattedText(before, after)
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

  expectFormattedText(before, after)
})

test("Create tree", () => {
  const before = `
|Колонка 1|Колонка 2|
|---|---|
|Значение 1| Значение 2|
|.Значение 1.1|Значение 2.1|
|.Значение 3.1|Значение 3.2|
|..Значение 4.1|Значение 4.2|`

  const after = `
| Колонка 1      | Колонка 2    |
| -------------- | ------------ |
| Значение 1     | Значение 2   |
| .Значение 1.1  | Значение 2.1 |
| .Значение 3.1  | Значение 3.2 |
| ..Значение 4.1 | Значение 4.2 |`

  expectFormattedText(before, after)
})

test("Create table without data", () => {
  const before = `
|Колонка 1|
|---|`

  const after = `
| Колонка 1 |
| --------- |`

  expectFormattedText(before, after)
})

test("Add table properties", () => {
  const before = `
{РастягиватьПоВертикали=Истина}
|Колонка 1 | Колонка 2|
|--- | --- |
|Значение 1 | Значение 2|`

  const after = `
{РастягиватьПоВертикали = Истина}
| Колонка 1  | Колонка 2  |
| ---------- | ---------- |
| Значение 1 | Значение 2 |`

  expectFormattedText(before, after)
})

test("Create table with empty value", () => {
  const before = `
  |Колонка 1 | Колонка 2|
  |--- | --- |
  |Значение 1 | |`

  const after = `
| Колонка 1  | Колонка 2 |
| ---------- | --------- |
| Значение 1 |           |`

  expectFormattedText(before, after)
})

test("Create table with type", () => {
  const before = `
|Колонка 1 {Тип=Число}|
|--- |`

  const after = `
| Колонка 1 {Тип = Число} |
| ----------------------- |`

  expectFormattedText(before, after)
})

test("Create table without header", () => {
  const before = `
||
|---|
|Значение 1|`

  const after = `
|            |
| ---------- |
| Значение 1 |`

  expectFormattedText(before, after)
})

test("Create table column with checkbox only", () => {
  const before = `
| Колонка|
|---|
|[ ]|`

  const after = `
| Колонка |
| ------- |
| [ ]     |`

  expectFormattedText(before, after)
})
