import { TreeToTableConverter } from "@/formatter/table/tableToTreeConverter"
import { ConvertableTreeNode } from "@/formatter/table/interfaces"
import { expect, test } from "vitest"

class TestTreeNode implements ConvertableTreeNode {
  constructor(public value: string, public items: TestTreeNode[] = []) {}
}

function simpleTable(table: ConvertableTreeNode[][]): string[][] {
  return table.map((row) => row.map((item) => (item as TestTreeNode).value))
}

test("Convert two linear", () => {
  const item1 = new TestTreeNode("Item 1")
  const item2 = new TestTreeNode("Item 2")

  const converter = new TreeToTableConverter()
  converter.add(item1)
  converter.add(item2)

  expect(simpleTable(converter.table)).toEqual([["Item 1", "Item 2"]])
})

test("Convert linear with child", () => {
  const item = new TestTreeNode("Item")
  const child = new TestTreeNode("Child")
  item.items.push(child)

  const converter = new TreeToTableConverter()
  converter.add(item)

  // prettier-ignore
  expect(simpleTable(converter.table)).toEqual([
    ["Item"],
    ["Child"]])
})

test("Convert linear with two children", () => {
  const item = new TestTreeNode("Item")
  const child1 = new TestTreeNode("Child 1")
  const child2 = new TestTreeNode("Child 2")
  item.items.push(child1)
  item.items.push(child2)

  const converter = new TreeToTableConverter()
  converter.add(item)

  // prettier-ignore
  expect(simpleTable(converter.table)).toEqual(
      [["Item", "Item"], 
       ["Child 1", "Child 2"]])
})

test("Convert linear with two children and other item", () => {
  const item1 = new TestTreeNode("Item 1")
  const child1 = new TestTreeNode("Child 1")
  const child2 = new TestTreeNode("Child 2")
  item1.items.push(child1)
  item1.items.push(child2)
  const item2 = new TestTreeNode("Item 2")

  const converter = new TreeToTableConverter()
  converter.add(item1)
  converter.add(item2)

  // prettier-ignore
  expect(simpleTable(converter.table)).toEqual(
        [["Item 1", "Item 1", "Item 2"], 
         ["Child 1", "Child 2", "Item 2"]])
})

test("Convert linear with two items and second item with child", () => {
  const item1 = new TestTreeNode("Item 1")
  const item2 = new TestTreeNode("Item 2")
  const child1 = new TestTreeNode("Child 1")
  item2.items.push(child1)

  const converter = new TreeToTableConverter()
  converter.add(item1)
  converter.add(item2)

  // prettier-ignore
  expect(simpleTable(converter.table)).toEqual(
          [["Item 1", "Item 2"], 
           ["Item 1", "Child 1"]])
})

test("Filter items", () => {
  const group = new TestTreeNode("Group")
  const child1 = new TestTreeNode("Child 1")
  const child2 = new TestTreeNode("Child 2")
  group.items.push(child1)
  group.items.push(child2)

  const item = new TestTreeNode("Item")

  const converter = new TreeToTableConverter((item) => {
    return (item as TestTreeNode).value !== "Group"
  })
  converter.add(group)
  converter.add(item)

  // prettier-ignore
  expect(simpleTable(converter.table)).toEqual(
    [["Child 1", "Child 2", "Item"]])
})

test("Filter subgroups", () => {
  const item = new TestTreeNode("Item")
  const group = new TestTreeNode("Group")
  item.items.push(group)
  const child1 = new TestTreeNode("Child 1")
  group.items.push(child1)

  const converter = new TreeToTableConverter((item) => {
    return (item as TestTreeNode).value !== "Group"
  })
  converter.add(item)

  // prettier-ignore
  expect(simpleTable(converter.table)).toEqual(
      [["Item"],
       ["Child 1"]])
})
