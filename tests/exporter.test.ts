import { TypeDescription } from "@/elements/typeDescription"
import { expect, test } from "vitest"
import { Exporter } from "@/exporter/exporter"

test("Export type description", () => {
  const typeDescription = new TypeDescription()
  typeDescription.types = ["Число", "Справочник.Контрагенты"]

  const result = Exporter.export(typeDescription)

  expect(result).toEqual(
    '{"Типы":["Число","Справочник.Контрагенты"],"ДлинаЧисла":0,"ТочностьЧисла":0,"ДлинаСтроки":0,"ЧастиДаты":"Дата","ЭтоНовый":false,"Авто":true}'
  )
})
