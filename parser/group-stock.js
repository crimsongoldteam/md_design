export class GroupStock {
    constructor(form) {
      this.form = form;
      this.reset();
    }

    next() {
      this.index++;
      this.setCurrentParent(this.getPrevAtIndex());
    }

    getCurrentParent() {
      return this.currentParent;
    }

    setCurrentParent(parent) {
      this.currentParent = parent;
    }

    doneLine() {
      for (
        let index = this.index;
        index <= this.prevGroups.length - 1;
        index++
      ) {
        let item = this.prevGroups[index];
        this.currentGroups.push(item);
      }

      this.prevGroups = this.currentGroups.slice();
      this.currentGroups = [];
      this.index = 0;
      this.setCurrentParent(this.getPrevAtIndex());
    }

    getPrevAtIndex() {
      if (this.index >= this.prevGroups.length) {
        if (this.prevGroups.length > 0) {
          return this.prevGroups[this.prevGroups.length - 1];
        }
        return this.form;
      }
      return this.prevGroups[this.index];
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

    add(item, indent) {
      let prevGroup = this.getCurrentParent();
      let parent = this.getItemAtIndent(prevGroup, indent);
      let curIndent = this.getIndent(parent);

      // Если это страница
      if (item.name == "PageHeader") {
        // Если это первая страница - создаем группу
        if (parent.name != "Pages") {
          const pages = this.getNewPages();
          // parent.children.Items.push(pages);
          this.setParent(pages, parent);
          this.setIndent(pages, curIndent);
          parent = pages;
        }

        const page = this.getNewPage(item);
        page.children.Properties = item.children.Properties;

        this.setParent(page, parent);
        this.setIndent(page, curIndent + 1);
        this.currentGroups.push(page);
        return;
      }

      //Если текущий элемент на этом уровне - страницы, значит они закончились и обращаемся к их родителю
      if (parent.name == "Pages") {
        parent = this.getParent(parent);
      }

      if (item.name == "VGroupHeader") {
        // debugger;
        let vGroupIndent = 0;
        if (parent.name != "HGroup") {
          const hGroup = this.getNewHGroup();
          this.setParent(hGroup, parent);
          this.setIndent(hGroup, curIndent);
          this.setCurrentParent(hGroup);
          vGroupIndent = curIndent;
          parent = hGroup;
        }

        const group = this.getNewVGroup(item);
        group.children.Properties = item.children.Properties;
        this.setParent(group, parent);
        this.setIndent(group, vGroupIndent);
        this.currentGroups.push(group);
        return;
      }

      // const parentInline = this.getInline(parent, item);

      // Обычный элемент
      this.setParent(item, parent);
      this.currentGroups.push(parent);
    }

    // getInline(parent, item) {
    //   if (item.name == "OneLineGroup") {
    //     return parent;
    //   }

    //   // const len = parent.children.Items.length;
    //   // if (len == 0) {
    //   //   let inline = this.createInline();
    //   //   this.setParent(inline, parent);
    //   //   return inline;
    //   // }

    //   // const parentInline = parent.children.Items[len - 1];
    //   // Сейчас каждый раз создаем новый, когда будет полный парсер - будем собирать в один
    //   // if (parentInline.name != "Inline") {
    //   let inline = this.createInline();
    //   this.setParent(inline, parent);
    //   return inline;
    //   // }
    //   // return parentInline;
    // }

    // processEmptyLine() {
    //   let prevGroup = this.getCurrentParent();

    //   while (prevGroup.name != "Page" && prevGroup.name != "Form") {
    //     prevGroup = this.getParent(prevGroup);
    //   }

    //   this.currentGroups.push(prevGroup);
    //   this.prevGroups = [];

    //   let inline = this.createInline();
    //   this.setParent(inline, prevGroup);

    //   this.doneLine();
    // }

    reset() {
      this.prevGroups = [];
      this.currentGroups = [];
      this.index = 0;

      this.parents = new WeakMap();
      this.indents = new WeakMap();
      this.setIndent(this.form, 0);

      this.currentParent = this.form;
    }

    setIndent(item, indent) {
      this.indents.set(item, indent);
    }

    setParent(item, parent) {
      this.parents.set(item, parent);
      parent.children.Items.push(item);
    }

    getNewVGroup(header) {
      const group = {
        name: "VGroup",
        children: { VGroupHeader: [], Items: [], Properties: {} },
      };

      if (header !== undefined) {
        group.children.VGroupHeader.push(header);
      }

      return group;
    }

    getNewHGroup() {
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