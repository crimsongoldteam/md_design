import { CstNode, IToken } from "chevrotain"
import { Detector } from "./detector"
import { Parser } from "./parser"
import {
  FormNode,
  TreeNode,
  ContentNode,
  PagesNode,
  PageNode,
  HorizontalGroupNode,
  VerticalGroupNode,
  ContainerNode,
} from "./groupMapNodes"
import { FieldNode, PropertiesNode } from "./nodes"

class ContainerInfo {
  public exact: boolean = true
  public node: ContainerNode

  constructor(defaultNode: ContainerNode) {
    this.node = defaultNode
  }
}

export class GroupMap {
  private readonly root: FormNode

  private readonly currentLineContainters: ContainerNode[] = []
  private readonly nextLineContentainers: ContainerNode[] = []

  private readonly parser: Parser
  private currentGroupIndex = 0

  private readonly detector: Detector = new Detector()
  private isGroupLine: boolean = false

  constructor(parser: Parser, formHeader: CstNode[] | undefined) {
    this.root = this.createFormNode(formHeader)
    this.parser = parser
    this.currentLineContainters = [this.root]
  }

  // #region public

  public startLine(isGroupLine: boolean): void {
    this.isGroupLine = isGroupLine
  }

  public addPage(node: CstNode, indent: number): void {
    let parentInfo = this.getContainerAtIndent(indent + 1)

    let pages = this.getCreatePagesNode(parentInfo)

    const container = this.createPageNode(pages, indent + 1, node)
    this.addToNextLine(container)
  }

  public addHorizontalGroup(nodes: CstNode[], indent: number): void {
    let parentInfo = this.getContainerAtIndent(indent + 1)

    let horizontalGroup = this.getCreateHorizontalGroupNode(parentInfo)

    let curIndent = indent + 1

    for (let node of nodes) {
      const container = this.createVerticalGroupNode(horizontalGroup, curIndent, node)
      this.addToNextLine(container)

      curIndent = 0
    }
  }

  public addTokens(tokens: IToken[], indent: number): void {
    const containerInfo = this.getContainerAtIndent(indent)
    const contentNode = this.getCreateContentNode(containerInfo.node)

    if (tokens.length) {
      const typeToken = this.detector.getTypeToken(tokens)
      this.addTokenToContentNode(contentNode, typeToken)

      tokens.forEach((token) => this.addTokenToContentNode(contentNode, token))
    }

    this.addToNextLine(containerInfo.node)
  }

  public next(): void {
    this.currentGroupIndex++
  }

  public endLine(): void {
    this.currentLineContainters.splice(0)
    this.currentLineContainters.push(...this.nextLineContentainers)
    this.nextLineContentainers.splice(0)
    this.currentGroupIndex = 0
  }

  public build(): CstNode {
    return this.buildItem(this.root)
  }

  // #endregion

  // #region content

  private createContentNode(parent: TreeNode): ContentNode {
    return new ContentNode(parent)
  }

  private getCreateContentNode(container: ContainerNode): ContentNode {
    let content = container.children[container.children.length - 1]
    if (content && this.isContentNode(content)) {
      return content as ContentNode
    }

    return this.createContentNode(container)
  }

  private addTokenToContentNode(treeNode: ContentNode, token: IToken): void {
    treeNode.item.children.Items.push(token)
  }

  // #endregion

  // #region form

  private createFormNode(formHeader: CstNode[] | undefined): FormNode {
    return new FormNode(formHeader)
  }

  // #endregion

  // #region page

  private getCreatePagesNode(containerInfo: ContainerInfo): PagesNode {
    if (containerInfo.exact && this.isPageNode(containerInfo.node)) {
      return containerInfo.node.parent as PagesNode
    }

    return new PagesNode(containerInfo.node)
  }

  private createPageNode(parent: PagesNode, indent: number, headerNode: CstNode): PageNode {
    return new PageNode(headerNode, indent, parent)
  }

  // #endregion

  // #region group

  private getCreateHorizontalGroupNode(containerInfo: ContainerInfo): HorizontalGroupNode {
    if (containerInfo.exact && this.isPageNode(containerInfo.node)) {
      return containerInfo.node.parent as HorizontalGroupNode
    }

    return new HorizontalGroupNode(containerInfo.node)
  }

  private createVerticalGroupNode(parent: HorizontalGroupNode, indent: number, headerNode: CstNode): VerticalGroupNode {
    return new VerticalGroupNode(headerNode, indent, parent)
  }

  // #endregion

  private isContainerNode(item: TreeNode): boolean {
    return this.isFormNode(item) || this.isPageNode(item) || this.isVerticalGroupNode(item)
  }

  private isFormNode(item: TreeNode): boolean {
    return item instanceof FormNode
  }

  private isPageNode(item: TreeNode): boolean {
    return item instanceof PageNode
  }
  private isVerticalGroupNode(item: TreeNode): boolean {
    return item instanceof VerticalGroupNode
  }
  private isContentNode(item: TreeNode): boolean {
    return item instanceof ContentNode
  }

  private getCurrentContainer(): ContainerNode {
    if (this.currentGroupIndex < this.currentLineContainters.length) {
      return this.currentLineContainters[this.currentGroupIndex]
    }

    return this.root
  }

  private getBaseContainer(item: ContainerNode): ContainerNode {
    if (this.currentGroupIndex == 0 && this.isGroupLine) {
      return this.getBaseFirstColumnContainer(item)
    }

    return this.root
  }

  private getBaseFirstColumnContainer(item: ContainerNode): VerticalGroupNode | FormNode {
    let currentItem: TreeNode = item

    while (!this.isFormNode(currentItem) && !this.isVerticalGroupNode(currentItem)) {
      currentItem = currentItem.parent
    }

    return currentItem as VerticalGroupNode | FormNode
  }

  private getContainerAtIndent(indent: number): ContainerInfo {
    const currentContainer = this.getCurrentContainer()
    const baseContainer = this.getBaseContainer(currentContainer)
    let result: ContainerInfo = new ContainerInfo(baseContainer)

    result.node = currentContainer
    let resultIndent = result.node.indent

    if (indent > resultIndent) {
      result.exact = false
      return result
    }

    if (currentContainer == baseContainer) {
      return result
    }

    while (resultIndent > indent) {
      let currentParent = result.node.parent

      if (this.isFormNode(currentParent)) {
        break
      }

      if (currentParent == baseContainer) {
        break
      }

      if (!this.isContainerNode(currentParent)) {
        currentParent = currentParent.parent as ContainerNode
      }

      resultIndent = currentParent.indent
      result.node = currentParent as ContainerNode
    }

    return result
  }

  // private getLastContainerAtIndent(indent: number): ContainerNode {

  // }

  private addToNextLine(item: ContainerNode): void {
    this.nextLineContentainers.push(item)
  }

  // #region build

  private buildItem(treeNode: ContainerNode): CstNode {
    const propertiesCache: CstNode[] = []
    const result = treeNode.item
    for (const childItem of treeNode.children) {
      if (this.isContentNode(childItem)) {
        let children = this.parseFields(childItem as ContentNode)
        this.processProperties(children, propertiesCache)
        ;(result.children.Items as CstNode[]).push(...children)
        continue
      }

      this.addProperties(childItem.item, propertiesCache as FieldNode[])

      let childCstElement = this.buildItem(childItem as ContainerNode)
      ;(result.children.Items as CstNode[]).push(childCstElement)
    }
    return result
  }

  private processProperties(items: CstNode[], propertiesCache: CstNode[]): void {
    const processedItems: CstNode[] = []

    for (const item of items) {
      if (item.children.propertyLine) {
        propertiesCache.push(item)
        continue
      }

      this.addProperties(item, propertiesCache as FieldNode[])
      processedItems.push(item)
      propertiesCache.length = 0
    }

    items.length = 0
    items.push(...processedItems)
  }

  private addProperties(item: CstNode, fieldsNodes: FieldNode[]): void {
    const properties: PropertiesNode[] = []
    for (const fieldNode of fieldsNodes) {
      const propertyLine = fieldNode.children.propertyLine[0]
      properties.push(...propertyLine.children.properties)
    }

    if (item.name == "field") {
      const field = item as FieldNode
      const firstChild = this.getFirstChild(field)
      firstChild.children.properties = properties as PropertiesNode[]

      return
    }

    item.children.properties = properties as PropertiesNode[]
  }

  private getFirstChild(item: CstNode): CstNode {
    const firstKey = Object.keys(item.children)[0]
    return item.children[firstKey][0] as CstNode
  }

  private parseFields(inline: ContentNode): CstNode[] {
    return this.parser.parseFields(inline.item.children.Items)
  }

  // #endregion
}

// Для страницы
// Если на этом уровне есть страница - мы берем страницу и ее     родителя
// Если на этом уровне ничего еще нет - создаем страницу

// Элемента
// Если на этом уровне есть страница - мы берем страницу
// Если на этом уровне ничего еще нет - берем нижестоящий

// Если прошлая с группами, а эта с группами
// Добавляем по порядку

// Если были группы и И сейчас группы - корень первого элемента - первая вертикальная группа
// Если были группы А сейчас не группы - корень первого элемента - форма

// /Страница
//   #Группа 1 #Группа2
//   Элемент

// /Страница
//   #Группа 1             #Группа2
//     #Группа 3 #Группа 4 +
//       /Страница  + +
//   Элемент +

// /Страница
//  	#Группа 1 #Группа 2
// Элемент1 + Элемент 2

// /Страница
//  	#Группа 1 #Группа 2
//     Элемент1 + Элемент 2
