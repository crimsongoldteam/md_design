import { AttributesTypeDescriptionDetector } from "@/ai/attributesTypeDescriptionDetector"
import { TypeDescriptionDetectorRequestTerm } from "@/ai/typeDescriptionDetectorRequest"
import { TypeDescription } from "@/elements/typeDescription"
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
    terms: [
      new TypeDescriptionDetectorRequestTerm({ type: "Справочник", singular: "Контрагент", plural: "Контрагенты" }),
    ],
  })

  expect(result).toEqual([new TypeDescription("Справочник.Контрагенты", false, false)])
})

test("multiple reference in right order", async () => {
  const detector = new AttributesTypeDescriptionDetector()

  await detector.addMetadata([
    {
      type: "ВидыКонтрагентов",
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
    terms: [
      new TypeDescriptionDetectorRequestTerm({ type: "Справочник", singular: "Контрагент", plural: "Контрагенты" }),
    ],
  })

  expect(result).toEqual([
    new TypeDescription("Справочник.Контрагенты", false, false),
    new TypeDescription("Справочник.ВидыКонтрагентов", false, false),
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
    terms: [new TypeDescriptionDetectorRequestTerm({ type: "Справочник", singular: "Договор", plural: "Договоры" })],
  })

  expect(result).toEqual([new TypeDescription("Справочник.Договоры", true, false)])
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
      new TypeDescriptionDetectorRequestTerm({ type: "Справочник", singular: "Контрагент", plural: "Контрагенты" }),
      new TypeDescriptionDetectorRequestTerm({
        type: "Справочник",
        singular: "Организация",
        plural: "Организации",
      }),
    ],
  })

  expect(result).toEqual([
    new TypeDescription("Справочник.Контрагенты", false, false),
    new TypeDescription("Справочник.Организации", false, false),
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
      new TypeDescriptionDetectorRequestTerm({ type: "Справочник", singular: "Контрагент", plural: "Контрагенты" }),
      new TypeDescriptionDetectorRequestTerm({
        type: "Справочник",
        singular: "Организация",
        plural: "Организации",
      }),
    ],
  })

  expect(result).toEqual([
    new TypeDescription("Справочник.Контрагенты", false, false),
    new TypeDescription("Справочник.Организации", true, false),
  ])
})

test("primitive types", async () => {
  const detector = new AttributesTypeDescriptionDetector()

  await detector.addMetadata([
    {
      type: "Годы",
      section: "Справочник",
      description: "Годы",
    },
  ])

  const result = detector.search({
    id: "1",
    terms: [
      new TypeDescriptionDetectorRequestTerm({ type: "Справочник", singular: "Год", plural: "Годы" }),
      new TypeDescriptionDetectorRequestTerm({ type: "Строка", length: 4 }),
    ],
  })

  const typeString = new TypeDescription("Строка", false, false)
  typeString.length = 4

  expect(result).toEqual([new TypeDescription("Справочник.Годы", false, false), typeString])
})
