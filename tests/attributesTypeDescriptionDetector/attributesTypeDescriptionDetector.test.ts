import { AttributesTypeDescriptionDetector } from "@/ai/attributesTypeDescriptionDetector"
import { TypeDescription } from "@/elements/typeDescription"
import { DateFractions } from "@/elements/types"
import { expect, test } from "vitest"

test("single reference", async () => {
  const detector = new AttributesTypeDescriptionDetector()

  await detector.addMetadata([
    {
      type: "Контрагенты",
      section: "Справочник",
      description: "Контрагенты",
    },
    {
      type: "Договоры",
      section: "Справочник",
      description: "Договоры",
    },
  ])

  const result = detector.search({
    id: "1",
    terms: [{ singular: "Контрагент", plural: "Контрагенты" }],
    preferedType: "Справочник",
    baseType: "Нет",
    digits: 0,
    fractionDigits: 0,
    length: 0,
    dateFractions: DateFractions.Date,
  })

  expect(result).toEqual([{ type: new TypeDescription("Справочник.Контрагенты"), isNew: false }])
})

test("multiple reference in right order", async () => {
  const detector = new AttributesTypeDescriptionDetector()

  await detector.addMetadata([
    {
      type: "Виды контрагентов",
      section: "Справочник",
      description: "Виды контрагентов",
    },
    {
      type: "Контрагенты",
      section: "Справочник",
      description: "Контрагенты",
    },
  ])

  const result = detector.search({
    id: "1",
    terms: [{ singular: "Контрагент", plural: "Контрагенты" }],
    preferedType: "Справочник",
    baseType: "Нет",
    digits: 0,
    fractionDigits: 0,
    length: 0,
    dateFractions: DateFractions.Date,
  })

  expect(result).toEqual([
    { type: new TypeDescription("Справочник.Контрагенты"), isNew: false },
    { type: new TypeDescription("Справочник.Виды контрагентов"), isNew: false },
  ])
})

test("new object", async () => {
  const detector = new AttributesTypeDescriptionDetector()

  await detector.addMetadata([
    {
      type: "Виды контрагентов",
      section: "Справочник",
      description: "Виды контрагентов",
    },
    {
      type: "Контрагенты",
      section: "Справочник",
      description: "Контрагенты",
    },
  ])

  const result = detector.search({
    id: "1",
    terms: [{ singular: "Договор", plural: "Договоры" }],
    preferedType: "Справочник",
    baseType: "Нет",
    digits: 0,
    fractionDigits: 0,
    length: 0,
    dateFractions: DateFractions.Date,
  })

  expect(result).toEqual([{ type: new TypeDescription("Справочник.Договоры"), isNew: true }])
})

test("few terms in right order", async () => {
  const detector = new AttributesTypeDescriptionDetector()

  await detector.addMetadata([
    {
      type: "Организации",
      section: "Справочник",
      description: "Организации",
    },
    {
      type: "Контрагенты",
      section: "Справочник",
      description: "Контрагенты",
    },
  ])

  const result = detector.search({
    id: "1",
    terms: [
      { singular: "Контрагент", plural: "Контрагенты" },
      { singular: "Организация", plural: "Организации" },
    ],
    preferedType: "Справочник",
    baseType: "Нет",
    digits: 0,
    fractionDigits: 0,
    length: 0,
    dateFractions: DateFractions.Date,
  })

  expect(result).toEqual([
    { type: new TypeDescription("Справочник.Контрагенты"), isNew: false },
    { type: new TypeDescription("Справочник.Организации"), isNew: false },
  ])
})

test("one term is new", async () => {
  const detector = new AttributesTypeDescriptionDetector()

  await detector.addMetadata([
    {
      type: "Контрагенты",
      section: "Справочник",
      description: "Контрагенты",
    },
  ])

  const result = detector.search({
    id: "1",
    terms: [
      { singular: "Контрагент", plural: "Контрагенты" },
      { singular: "Организация", plural: "Организации" },
    ],
    preferedType: "Справочник",
    baseType: "Нет",
    digits: 0,
    fractionDigits: 0,
    length: 0,
    dateFractions: DateFractions.Date,
  })

  expect(result).toEqual([
    { type: new TypeDescription("Справочник.Контрагенты"), isNew: false },
    { type: new TypeDescription("Справочник.Организации"), isNew: true },
  ])
})
