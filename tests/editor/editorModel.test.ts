import { expect, test, vi } from "vitest"
import { ModelCursor, MainCursorBuilder, MainCursorFormatter, GroupCursorBuilder, GroupCursorFormatter } from "@/editor"
import { CstPath } from "@/elements/cstPathHelper"
import { CSTModel } from "@/editor/cstModel"
import { cleanString } from "../utils"

test("set cursor on group", () => {
  const text = `
    #Группа 1 # Группа 2
    Элемент 1+ Элемент 2`

  const model = new CSTModel()
  const mainCursor = new ModelCursor(model, new MainCursorBuilder(), new MainCursorFormatter())
  mainCursor.text = text

  const cursor = new ModelCursor(model, new GroupCursorBuilder(), new GroupCursorFormatter())
  const path = model.getPathByElementId("Группа1") as CstPath
  cursor.path = path

  expect(cursor.text).toEqual("Элемент 1")
})

test("set group cursor text", () => {
  const text = `
    #Группа 1 # Группа 2
    Элемент 1+ Элемент 2`

  const model = new CSTModel()
  const mainCursor = new ModelCursor(model, new MainCursorBuilder(), new MainCursorFormatter())
  model.registerCursor(mainCursor)
  mainCursor.text = text

  const cursor = new ModelCursor(model, new GroupCursorBuilder(), new GroupCursorFormatter())
  model.registerCursor(cursor)
  const path = model.getPathByElementId("Группа1") as CstPath
  cursor.path = path
  cursor.text = "Элемент 3"

  expect(mainCursor.text).toEqual(
    cleanString(`
#Группа 1   #Группа 2
  Элемент 3 +Элемент 2`)
  )
})

test("unregister after remove element", () => {
  const text = `
    #Группа 1 # Группа 2
    Элемент 1+ Элемент 2`
  const onUnregisterCursorMock = vi.fn()

  const model = new CSTModel()
  const mainCursor = new ModelCursor(model, new MainCursorBuilder(), new MainCursorFormatter())
  model.registerCursor(mainCursor)
  mainCursor.text = text

  const cursor = new ModelCursor(model, new GroupCursorBuilder(), new GroupCursorFormatter())

  cursor.onUnregisterCursor = onUnregisterCursorMock
  model.registerCursor(cursor)
  cursor.path = model.getPathByElementId("Группа1") as CstPath

  mainCursor.text = ""

  expect(onUnregisterCursorMock).toHaveBeenCalled()
})
