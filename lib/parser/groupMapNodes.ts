import { CstNode, IToken } from "chevrotain"

interface ItemCstNode {
  name: string
  children: { Items: (CstNode | IToken)[]; Properties: any[] }
}

export abstract class TreeNode {
  item: ItemCstNode = {
    name: "",
    children: { Items: [], Properties: [] },
  }
  parent: TreeNode
  indent: number
  children: TreeNode[] = []

  constructor(indent: number = 0, parent: TreeNode | undefined = undefined) {
    this.indent = indent
    this.parent = parent ?? this
    parent?.children.push(this)
  }
}
export class FormNode extends TreeNode {
  item = {
    name: "form",
    children: { formHeader: [] as CstNode[], Items: [], Properties: [] },
  }

  constructor(formHeader: CstNode[] | undefined) {
    super()
    if (formHeader) {
      this.item.children.formHeader = formHeader
    }
  }
}
export class HorizontalGroupNode extends TreeNode {
  item = {
    name: "horizontalGroup",
    children: { Items: [], Properties: [] },
  }
  children: VerticalGroupNode[] = []

  constructor(parent: TreeNode) {
    super(-1, parent)
  }
}
export class VerticalGroupNode extends TreeNode {
  item = {
    name: "verticalGroup",
    children: { GroupHeader: [], Items: [], Properties: [] },
  }
  children: VerticalGroupNode[] = []

  constructor(headerNode: CstNode, indent: number, parent: HorizontalGroupNode) {
    super(indent, parent)
    if (headerNode) {
      ;(this.item.children.GroupHeader as CstNode[]).push(headerNode)
    }
  }
}
export class PagesNode extends TreeNode {
  item = {
    name: "pages",
    children: { Items: [], Properties: [] },
  }
  children: PageNode[] = []

  constructor(parent: TreeNode) {
    super(-1, parent)
  }
}
export class PageNode extends TreeNode {
  item = {
    name: "page",
    children: { PageHeader: [], Items: [], Properties: [] },
  }
  children: VerticalGroupNode[] = []

  constructor(headerNode: CstNode, indent: number, parent: PagesNode) {
    super(indent, parent)
    if (headerNode) {
      ;(this.item.children.PageHeader as CstNode[]).push(headerNode)
    }
  }
}

export class ContentNode extends TreeNode {
  item: {
    name: string
    children: {
      Items: IToken[]
      Properties: any[]
    }
  } = {
    name: "inline",
    children: { Items: [], Properties: [] },
  }

  constructor(parent: TreeNode) {
    super(-1, parent)
  }
}

export type ContainerNode = FormNode | PageNode | VerticalGroupNode
