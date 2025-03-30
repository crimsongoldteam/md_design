import { pathToFileURL } from "url";

export class GroupStack {
  constructor(form) {
    this.form = form;
    this.reset();
  }

  doneRow() {
    // Это разрыв группы
    if (this.collectedItems.length == 1 && this.prevGroups.length > 1) {
      let item = this.collectedItems[0];
      parent = this.form;
      this.add(item, parent, 0);

      this.prevGroups = this.currentGroups.slice();
      this.currentGroups = [];
      this.collectedItems = [];

      return;
    }

    for (
      let index = this.index;
      index <= this.collectedItems.length - 1;
      index++
    ) {
      let element = this.collectedItems[index];
      let item = element.item;
      let indent = element.indent;

      let parent = this.getPrevAtIndex(index);
      parent = this.getItemAtIndent(parent, indent);

      let itemIndent = this.getIndent(parent);

      this.add(item, parent, itemIndent);
    }

    for (
      let index = this.collectedItems.length;
      index <= this.prevGroups.length - 1;
      index++
    ) {
      let item = this.prevGroups[index];
      this.currentGroups.push(item);
    }

    this.prevGroups = this.currentGroups.slice();
    this.currentGroups = [];
    this.collectedItems = [];
  }

  getPrevAtIndex(index) {
    if (index >= this.prevGroups.length) {
      if (this.prevGroups.length > 0) {
        return this.prevGroups[this.prevGroups.length - 1];
      }
      return this.form;
    }
    return this.prevGroups[index];
  }

  getItemAtIndent(current, indent) {
    let resultIndent = this.getIndent(current);

    if (indent >= resultIndent) {
      return current;
    }

    let result = current;
    while (resultIndent > indent) {
      result = this.getParent(result);
      resultIndent = this.getIndent(parent);
    }

    return result;
  }

  getIndent(item) {
    return this.indents.get(item);
  }

  getParent(item) {
    const parent = this.parents.get(item);
    if (parent === undefined) {
      return this.form;
    }
    return parent;
  }

  collect(item, indent, separator) {
    this.collectedItems.push({
      item: item,
      indent: indent,
      separator: separator,
    });
  }

  add(item, indent) {
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

  addPage(pageHeader, parent, indent) {
    if (pageHeader.name != "PageHeader") {
      return false;
    }

    // Если это первая страница - создаем группу
    if (parent.name != "Pages") {
      const pages = this.getNewPages();
      this.setParent(pages, parent);
      this.setIndent(pages, indent);
      parent = pages;
    }

    const page = this.getNewPage(pageHeader);
    page.children.Properties = pageHeader.children.Properties;

    this.setParent(page, parent);
    this.setIndent(page, indent + 1);
    this.currentGroups.push(page);
    return true;
  }

  addGroup(hGroup, parent, indent) {
    if (hGroup.name != "HGroup") {
      return false;
    }

    this.setIndent(hGroup, indent);
    this.setParent(hGroup, parent);

    const items = hGroup.children.Items;

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
    this.prevGroups = [];
    this.currentGroups = [];

    this.parents = new WeakMap();
    this.indents = new WeakMap();
    this.setIndent(this.form, 0);
  }

  setIndent(item, indent) {
    this.indents.set(item, indent);
  }

  setParent(item, parent) {
    this.parents.set(item, parent);
    parent.children.Items.push(item);
  }

  createVGroup(header, parent) {
    const group = {
      name: "VGroup",
      children: { VGroupHeader: [], Items: [], Properties: {} },
    };

    if (header !== undefined) {
      group.children.VGroupHeader.push(header);
    }

    this.setParent(group, parent);

    return group;
  }

  createHGroup() {
    const group = {
      name: "HGroup",
      children: { Items: [], Properties: {} },
    };

    return group;
  }

  getNewPage(header) {
    const page = {
      name: "Page",
      children: { PageHeader: [header], Items: [], Properties: {} },
    };
    return page;
  }

  getNewPages() {
    const page = {
      name: "Pages",
      children: { Items: [] },
    };
    return page;
  }

  createOneLineGroup() {
    const result = {
      name: "OneLineGroup",
      children: { Items: [] },
    };
    return result;
  }

  createInline() {
    const inline = {
      name: "Inline",
      children: { Items: [] },
    };
    return inline;
  }
}
