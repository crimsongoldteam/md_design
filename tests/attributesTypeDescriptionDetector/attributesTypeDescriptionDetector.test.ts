import { AttributesTypeDescriptionDetector } from "@/ai/attributesTypeDescriptionDetector"
import { TypeDescription } from "@/elements/typeDescription"
import { expect, test } from "vitest"

test("single reference", async () => {
  const detector = new AttributesTypeDescriptionDetector()

  await detector.addMultiple([
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

  const result = await detector.search({ terms: ["Контрагент"], preferedType: "Справочник" })

  expect(result).toEqual([{ type: new TypeDescription("Справочник.Контрагенты"), isNew: false }])
})

// test("multiple reference in right order", async () => {
//   const detector = new AttributesTypeDescriptionDetector()

//   await detector.addMultiple([
//     {
//       type: "Виды контрагентов",
//       section: "Справочник",
//       description: "Виды контрагентов",
//     },
//     {
//       type: "Контрагенты",
//       section: "Справочник",
//       description: "Контрагенты",
//     },
//   ])

//   const result = await detector.search({ terms: ["Контрагент"], preferedType: "Справочник" })

//   expect(result).toEqual([
//     { type: new TypeDescription("Справочник.Контрагенты"), isNew: false },
//     { type: new TypeDescription("Справочник.Виды контрагентов"), isNew: false },
//   ])
// })

// test("new object", async () => {
//   const detector = new AttributesTypeDescriptionDetector()

//   await detector.addMultiple([
//     {
//       type: "Виды контрагентов",
//       section: "Справочник",
//       description: "Виды контрагентов",
//     },
//     {
//       type: "Контрагенты",
//       section: "Справочник",
//       description: "Контрагенты",
//     },
//   ])

//   const result = await detector.search({ terms: ["Договор"], preferedType: "Справочник" })

//   expect(result).toEqual([{ type: new TypeDescription("Справочник.Договоры"), isNew: true }])
// })
