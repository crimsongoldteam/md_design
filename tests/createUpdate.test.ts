import { expect, test } from "vitest"
import { CSTModel } from "@/editor/cstModel"
import { ModelCursor, MainCursorBuilder, MainCursorFormatter } from "@/editor"
import { ElementPathData } from "@/elementPathData"
import { elementsManager } from "@/elementsManager"
import { CstPathItem } from "@/elements/cstPathHelper"
import { ElementListType, LabelElement } from "@/elements"

test("insert new element", () => {
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
