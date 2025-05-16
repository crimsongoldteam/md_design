import { CstNode, IToken } from "chevrotain";
import { Detector } from "./detector";
import { InlineParser } from "./parser";

interface TreeNode {
  item: CstNode;
  parent: TreeNode | undefined,
  indent: number,
  children: TreeNode[]
}

export class IndentsMap {
  private root: TreeNode;
  private currentLineParents: TreeNode[] = [];
  private nextLineParents: TreeNode[] = [];
  private currentGroupIndex = 0;
  private parser: InlineParser

  private detector: Detector = new Detector()

  constructor(parser: InlineParser) {
    this.root = this.createForm();
    this.parser = parser
    this.currentLineParents = [this.root]
  }

  /**
   * Adds a new node to the indents map.
   *
   * @param {CstNode} node The node to add.
   * @param {number} indent The indentation level of the node.
   */
  public add(node: CstNode, indent: number): void {
    let parent = this.getParent(indent);

    if (this.isPageHeader(node)) {
      this.createPage(parent, indent, node)
      return
    }

    if (this.isVerticalGroupHeader(node)) {
      this.createVerticalGroup(parent, indent, node)
      return
    }
  }
 
  public addTokens(tokens: IToken[], indent: number): void {
    let parent = this.getParent(indent);
    const inlineItem = this.getCreateInline(parent)
    
    const typeToken = this.detector.getTypeToken(tokens)
    this.insertToInline(inlineItem, typeToken)
    
    tokens.forEach(token => this.insertToInline(inlineItem, token));
  }

  public next(): void {
    this.currentGroupIndex++;
  }

  public endLine(): void {
    this.currentLineParents = [...this.nextLineParents];
    this.nextLineParents = [];
    this.currentGroupIndex = 0;
  }

  public build(): CstNode {
    return this.buildItem(this.root);
  }


  // #region inline

  private createInline(parent: TreeNode): TreeNode {
    const item = {
      name: "inline",
      children: { Items: [], Properties: [] },
    };

    const treeItem = this.addItem(item, -1, parent);
    this.addToNextLine(treeItem)
    return treeItem
  }

  private getCreateInline(parent: TreeNode): TreeNode {
    if (this.isInline(parent.item)) { return parent }

    return this.createInline(parent)
  }

  private insertToInline(parent: TreeNode, token: IToken): void {
    parent.item.children.Items.push(token)
  }

  // #endregion

  // #region form

  private createForm(): TreeNode {
    const item = {
      name: "form",
      children: { Items: [], Properties: [] },
    };

    const treeItem = this.addItem(item, 0, undefined);
    return treeItem
  }

  // #endregion

  // #region page

  private getCreatePages(parent: TreeNode, indent: number): TreeNode {
    if (this.isPage(parent.item)) { return parent.parent as TreeNode }

    const item = {
      name: "pages",
      children: { Items: [] },
    };

    const treeItem = this.addItem(item, indent, parent);
    return treeItem
  }

  private createPage(parent: TreeNode, indent: number, headerNode: CstNode): TreeNode {
    const currentParent = this.getCreatePages(parent, indent)

    const item = {
      name: "page",
      children: { PageHeader: [headerNode], Items: [], Properties: [] },
    };

    const treeItem = this.addItem(item, indent, currentParent);

    const inlineItem = this.createInline(treeItem)
    this.addToNextLine(inlineItem)
    return inlineItem
  }

  // #endregion

  // #region group

  private getCreateHorizontalGroup(parent: TreeNode, indent: number): TreeNode {
    if (this.isVerticalGroup(parent.item)) { return parent.parent as TreeNode}

    const item = {
      name: "horizontalGroup",
      children: { Items: [], Properties: [] },
    };

    return this.addItem(item, indent, parent);
  }

  private createVerticalGroup(parent: TreeNode, indent: number, headerNode: CstNode): TreeNode {
    const currentParent = this.getCreateHorizontalGroup(parent, indent)

    const item = {
      name: "verticalGroup",
      children: { GroupHeader: [headerNode], Items: [], Properties: [] },
    };

    const treeItem = this.addItem(item, indent, currentParent);

    const inlineItem = this.createInline(treeItem)
    this.addToNextLine(inlineItem)
    return inlineItem
  }

  // #endregion


  private addItem(item: CstNode, indent: number, parent: TreeNode | undefined): TreeNode {
    let result = {
      item: item,
      parent: parent,
      indent: indent,
      children: [] as TreeNode[]
    }
    parent?.children.push(result)
    return result
  }

  // private isForm(item: CstNode): boolean { return item.name == "form" }
  private isPage(item: CstNode): boolean { return item.name == "page" }
  private isVerticalGroup(item: CstNode): boolean { return item.name == "verticalGroup" }
  private isInline(item: CstNode): boolean { return item.name == "inline" }

  private isPageHeader(item: CstNode): boolean { return item.name == "pageHeader" }
  private isVerticalGroupHeader(item: CstNode): boolean { return item.name == "verticalGroupHeader" }

  private getCurrent(): TreeNode {
    if (this.currentGroupIndex < this.currentLineParents.length) {
      return this.currentLineParents[this.currentGroupIndex]
    }

    return this.root
  }

  private getParent(indent: number): TreeNode {
    let current = this.getCurrent()
    let resultIndent = current.indent;

    if (indent >= resultIndent) {
      return current;
    }

    while (resultIndent > indent) {
      current = current.parent as TreeNode;
      resultIndent = current.indent;
    }

    return current;
  }

  private addToNextLine(item: TreeNode): void {
    this.nextLineParents.push(item)
  }

  private buildItem(treeNode: TreeNode) : CstNode {
    const result = treeNode.item
    for (const childItem of treeNode.children) {
      if (this.isInline(childItem.item)) {
        let children = this.parseFields(childItem)
        result.children.Items.push(...children)
        continue;
      }

      let childCstElement = this.buildItem(childItem)
      result.children.Items.push(childCstElement)
    }
    return result;
  }

  private parseFields(inline: TreeNode): CstNode[] {
    return this.parser.parseFields(inline.item.children.Items as IToken[])
  }
}
