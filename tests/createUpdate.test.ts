import { expect, test } from "vitest"
import { CSTModel } from "@/editor/cstModel"
import { ModelCursor, MainCursorBuilder, MainCursorFormatter } from "@/editor"
import { ElementPathData } from "@/elementPathData"
import { elementsManager } from "@/elementsManager"
import { CstPathItem } from "@/elements/cstPathHelper"
import { ElementListType, HorizontalGroupElement, LabelElement, VerticalGroupElement } from "@/elements"
import { cleanString } from "./utils"

test("insert new element in empty form", () => {
  const model = new CSTModel()
  const mainCursor = new ModelCursor(model, new MainCursorBuilder(), new MainCursorFormatter())
  model.registerCursor(mainCursor)

  const newLabel = elementsManager.getNewValue("Надпись") as LabelElement

  const path = [new CstPathItem(LabelElement, 0, ElementListType.Items)]
  newLabel.setProperty("Заголовок", "Надпись")

  const insertData = new ElementPathData(newLabel, path, true)

  model.createOrUpdateElement(insertData)

  expect(mainCursor.text).toBe("Надпись")
})

test("insert new element in form between elements", () => {
  const model = new CSTModel()
  const mainCursor = new ModelCursor(model, new MainCursorBuilder(), new MainCursorFormatter())
  model.registerCursor(mainCursor)

  mainCursor.text = cleanString(`
Элемент до
Элемент после`)

  const newLabel = elementsManager.getNewValue("Надпись") as LabelElement

  const path = [new CstPathItem(LabelElement, 0, ElementListType.Items)]
  newLabel.setProperty("Заголовок", "Надпись")

  const insertData = new ElementPathData(newLabel, path, true)

  model.createOrUpdateElement(insertData)

  expect(mainCursor.text).toBe(
    cleanString(`
Элемент до
Надпись
Элемент после`)
  )
})

test("insert new element in group", () => {
  const model = new CSTModel()
  const mainCursor = new ModelCursor(model, new MainCursorBuilder(), new MainCursorFormatter())
  model.registerCursor(mainCursor)

  mainCursor.text = cleanString(`
#Группа`)

  const newLabel = elementsManager.getNewValue("Надпись") as LabelElement

  const path = [
    new CstPathItem(HorizontalGroupElement, 0, ElementListType.Items),
    new CstPathItem(VerticalGroupElement, 0, ElementListType.Items),
    new CstPathItem(LabelElement, 0, ElementListType.Items),
  ]

  newLabel.setProperty("Заголовок", "Надпись")

  const insertData = new ElementPathData(newLabel, path, true)

  model.createOrUpdateElement(insertData)

  expect(mainCursor.text).toBe(
    cleanString(`
#Группа
  Надпись`)
  )
})
