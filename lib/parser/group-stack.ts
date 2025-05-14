import { CstNode } from "chevrotain";

interface IGroupItem {
  item: CstNode;
  indent: number;
  separator: string;
}


export class GroupStack {
  form: CstNode;
  collectedItems: Array<IGroupItem> = [];
  prevGroups: Array<CstNode> = [];
  currentGroups: Array<CstNode> = [];
  indents: WeakMap<CstNode, number> = new WeakMap();
  parents: WeakMap<CstNode, CstNode> = new WeakMap();

  constructor(form: CstNode) {
    this.form = form;
    this.reset();
  }

  doneRow() {

    if (this.doneSingleItemRow()) {
      return;
    }

    for (let index = 0; index < this.collectedItems.length; index++) {
      let element = this.collectedItems[index];
      let item = element.item;
      let indent = element.indent;

      let parent = this.getPrevAtIndex(index);

      let isEmptyInline = (item.name == "Inline" && item.children.Items.length == 0);

      if (!isEmptyInline) {
        parent = this.getItemAtIndent(parent, indent);
      }

      let itemIndent = this.getIndent(parent);


      this.add(item, parent, itemIndent);
    }

    for (
      let index = this.collectedItems.length;
      index < this.prevGroups.length;
      index++
    ) {
      let item = this.prevGroups[index];
      this.currentGroups.push(item);
    }

    this.prevGroups = this.currentGroups.slice();
    this.currentGroups = [];
    this.collectedItems = [];
  }

  doneSingleItemRow() {
    if (this.collectedItems.length != 1) { return false; }
    if (this.prevGroups.length <= 1) { return false; }

    let item = this.collectedItems[0].item;
    let indent = this.collectedItems[0].indent;

    let parent = this.getFirstParentPage(this.prevGroups[0]);

    let isEmptyInline = (item.name == "Inline" && item.children.Items.length == 0);

    if (!isEmptyInline) {
      parent = this.getItemAtIndent(parent, indent);
    }

    this.add(item, parent, 0);

    this.prevGroups = this.currentGroups.slice();
    this.currentGroups = [];
    this.collectedItems = [];

    return true;
  }

  getPrevAtIndex(index: number) : CstNode {
    if (index >= this.prevGroups.length) {
      if (this.prevGroups.length > 0) {
        return this.prevGroups[this.prevGroups.length - 1];
      }
      return this.form;
    }
    return this.prevGroups[index];
  }

  getItemAtIndent(current: CstNode, indent: number) : CstNode {
    let resultIndent = this.getIndent(current);

    if (indent >= resultIndent) {
      return current;
    }

    let result = current;
    while (resultIndent > indent) {
      result = this.getParent(result);
      resultIndent = this.getIndent(result);
    }

    return result;
  }

  getIndent(item: CstNode) : number {
    const indent = this.indents.get(item);
    return indent !== undefined ? indent : 0;
  }

  getParents(item: any) {
    let result = [];

    let parent = item;

    while (parent != this.form) {
      parent = this.getParent(parent);
      result.unshift(parent);
    }

    return result;
  }

  getFirstParentPage(item: CstNode) {
    let result = this.form;
    let parents = this.getParents(item);
    for (let index = 1; index < parents.length; index++) {
      const element = parents[index];
      if (element.name == "HGroup") {
        break;
      }

      if (element.name == "Pages") {
        continue;
      }
      result = element;
    }

    return result;
  }

  getParent(item: CstNode) {
    const parent = this.parents.get(item);
    if (parent === undefined) {
      return this.form;
    }
    return parent;
  }

  collect(item: CstNode, indent: number, separator: string) {
    this.collectedItems.push({
      item: item,
      indent: indent,
      separator: separator,
    });
  }

  add(item: CstNode, parent: CstNode, indent: number) {
    // let curIndent = this.getIndent(parent);

    if (this.addPage(item, parent, indent)) {
      return;
    }

    if (this.addGroup(item, parent, indent)) {
      return;
    }

    //Если текущий элемент на этом уровне - страницы, значит они закончились и обращаемся к их родителю
    if (parent.name == "Pages") {
      parent = this.getParent(parent);
    }

    // Обычный элемент
    this.setParent(item, parent);
    this.currentGroups.push(parent);
  }

  addPage(page: CstNode, parent: CstNode, indent: number) {
    if (page.name != "Page") {
      return false;
    }

    // Если это первая страница - создаем группу
    if (parent.name != "Pages") {
      const pages = this.getNewPages();
      this.setParent(pages, parent);
      this.setIndent(pages, indent);
      parent = pages;
    }

    // const page = this.createPage(pageHeader);
    // page.children.Properties = pageHeader.children.Properties;

    this.setParent(page, parent);
    this.setIndent(page, indent + 1);
    this.currentGroups.push(page);
    return true;
  }

  addGroup(hGroup: CstNode, parent: CstNode, indent: number) {
    if (hGroup.name != "HGroup") {
      return false;
    }

    this.setIndent(hGroup, indent);
    this.setParent(hGroup, parent);

    const items = hGroup.children.Items as CstNode[];

    // Правила отступов для групп следующие
    // - отступ первой вертикальной группы совпадает с отступом родителя
    // - отступ каждой следующей вертикальной группы - всегда 0

    for (let index = 0; index < items.length; index++) {
      const vGroup = items[index];

      let vGroupIndent = 0;
      if (index == 0) {
        vGroupIndent = indent;
      }
      this.setIndent(vGroup, vGroupIndent);

      this.currentGroups.push(vGroup);
    }

    return true;
  }

  reset() {
    this.prevGroups = [this.form];
    this.currentGroups = [];
    this.collectedItems = [];

    this.parents = new WeakMap();
    this.indents = new WeakMap();
    this.setIndent(this.form, 0);
  }

  setIndent(item: CstNode, indent: number) {
    this.indents.set(item, indent);
  }

  setParent(item: CstNode, parent: CstNode) {
    this.parents.set(item, parent);
    parent.children.Items.push(item);
  }

  createVGroup(parent: CstNode) : CstNode {
    const group = {
      name: "VGroup",
      children: { VGroupHeader: new Array<CstNode>(), Items: new Array<CstNode>(), Properties: [] },
    };

    group.children.VGroupHeader.push(this.createVGroupHeader());

    this.setParent(group, parent);

    return group;
  }

  createVGroupHeader() {
    const group = {
      name: "VGroupHeader",
      children: { Hash: [], Text: [] },
    };

    return group;
  }
  createHGroup() {
    const group = {
      name: "HGroup",
      children: { Items: [], Properties: {} },
    };

    return group;
  }

  createPage() {
    const header = {
      name: "PageHeader",
      children: { Slash: [], Text: [], Properties: {} },
    };

    const page = {
      name: "Page",
      children: { PageHeader: [header], Items: [], Properties: {} },
    };

    return page;
  }

  getNewPages() : CstNode {
    const page = {
      name: "Pages",
      children: { Items: [] },
    };
    return page;
  }

  createOneLineGroup() : CstNode {
    const result = {
      name: "OneLineGroup",
      children: { Items: [] },
    };
    return result;
  }

  createInline() : CstNode {
    const inline = {
      name: "Inline",
      children: { Items: [] },
    };
    return inline;
  }
}
