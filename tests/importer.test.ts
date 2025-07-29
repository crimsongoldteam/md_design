import { expect, test } from "vitest"
import { Importer } from "@/importer/importer"

test("Import type description", () => {
  const text =
    '{"Типы":["Число","Справочник.Контрагенты"],"ДлинаЧисла":0,"ТочностьЧисла":0,"ДлинаСтроки":0,"ЧастиДаты":"Дата","Авто":true}'

  const result = Importer.importTypeDescription(text)

  expect(result.types).toEqual(["Число", "Справочник.Контрагенты"])
  expect(result.digits).toEqual(0)
  expect(result.fractionDigits).toEqual(0)
  expect(result.length).toEqual(0)
  expect(result.dateFractions).toEqual("Дата")
  expect(result.auto).toEqual(true)
})
