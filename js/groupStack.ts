// import { CstNode, IToken } from "chevrotain";
// import { Detector } from "../lib/parser/detector";

// interface IGroupItem {
//   item: CstNode;
//   indent: number;
//   separator: boolean;
// }

// export class GroupStack {
//   form: CstNode = this.createForm();
//   collectedItems: Array<IGroupItem> = [];
//   prevGroups: Array<CstNode> = [];
//   currentGroups: Array<CstNode> = [];
//   indents: WeakMap<CstNode, number> = new WeakMap();
//   parents: WeakMap<CstNode, CstNode> = new WeakMap();
//   detector: Detector = new Detector()

//   constructor() {
//     this.reset();
//   }

//   public consume(token: IToken) {

//   }

//   public doneRow() {

//     if (this.doneSingleItemRow()) {
//       return;
//     }

//     for (let index = 0; index < this.collectedItems.length; index++) {
//       let element = this.collectedItems[index];
//       let item = element.item;
//       let indent = element.indent;

//       let parent = this.getPrevAtIndex(index);

//       let isEmptyInline = (item.name == "Inline" && item.children.Items.length == 0);

//       if (!isEmptyInline) {
//         parent = this.getItemAtIndent(parent, indent);
//       }

//       let itemIndent = this.getIndent(parent);

//       this.add(item, parent, itemIndent);
//     }

//     for (
//       let index = this.collectedItems.length;
//       index < this.prevGroups.length;
//       index++
//     ) {
//       let item = this.prevGroups[index];
//       this.currentGroups.push(item);
//     }

//     this.prevGroups = this.currentGroups.slice();
//     this.currentGroups = [];
//     this.collectedItems = [];
//   }

//   private doneSingleItemRow(): boolean {
//     if (this.collectedItems.length != 1) { return false; }
//     if (this.prevGroups.length <= 1) { return false; }

//     let item = this.collectedItems[0].item;
//     let indent = this.collectedItems[0].indent;

//     let parent = this.getFirstParentPage(this.prevGroups[0]);

//     let isEmptyInline = (item.name == "Inline" && item.children.Items.length == 0);

//     if (!isEmptyInline) {
//       parent = this.getItemAtIndent(parent, indent);
//     }

//     this.add(item, parent, 0);

//     this.prevGroups = this.currentGroups.slice();
//     this.currentGroups = [];
//     this.collectedItems = [];

//     return true;
//   }

//   private getPrevAtIndex(index: number): CstNode {
//     if (index >= this.prevGroups.length) {
//       if (this.prevGroups.length > 0) {
//         return this.prevGroups[this.prevGroups.length - 1];
//       }
//       return this.form;
//     }
//     return this.prevGroups[index];
//   }

//   private getItemAtIndent(current: CstNode, indent: number): CstNode {
//     let resultIndent = this.getIndent(current);

//     if (indent >= resultIndent) {
//       return current;
//     }

//     let result = current;
//     while (resultIndent > indent) {
//       result = this.getParent(result);
//       resultIndent = this.getIndent(result);
//     }

//     return result;
//   }

//   private getIndent(item: CstNode): number {
//     const indent = this.indents.get(item);
//     return indent !== undefined ? indent : 0;
//   }

//   private getParents(item: CstNode): CstNode[] {
//     let result = [];

//     let parent = item;

//     while (parent != this.form) {
//       parent = this.getParent(parent);
//       result.unshift(parent);
//     }

//     return result;
//   }

//   private getFirstParentPage(item: CstNode): CstNode {
//     let result = this.form;
//     let parents = this.getParents(item);
//     for (let index = 1; index < parents.length; index++) {
//       const element = parents[index];
//       if (element.name == "HGroup") {
//         break;
//       }

//       if (element.name == "Pages") {
//         continue;
//       }
//       result = element;
//     }

//     return result;
//   }

//   private getParent(item: CstNode): CstNode {
//     const parent = this.parents.get(item);
//     if (parent === undefined) {
//       return this.form;
//     }
//     return parent;
//   }

//   public collect(item: CstNode, indent: number, separator: boolean) {
//     this.collectedItems.push({
//       item: item,
//       indent: indent,
//       separator: separator,
//     });
//   }

//   private add(item: CstNode, parent: CstNode, indent: number) {
//     // let curIndent = this.getIndent(parent);

//     if (this.addPage(item, parent, indent)) { return }

//     if (this.addGroup(item, parent, indent)) { return }

//     //Если текущий элемент на этом уровне - страницы, значит они закончились и обращаемся к их родителю
//     if (parent.name == "Pages") {
//       parent = this.getParent(parent);
//     }

//     // Обычный элемент
//     this.setParent(item, parent);
//     this.currentGroups.push(parent);
//   }

//   private addPage(page: CstNode, parent: CstNode, indent: number): boolean {
//     if (page.name != "Page") {
//       return false;
//     }

//     // Если это первая страница - создаем группу
//     if (parent.name != "Pages") {
//       const pages = this.getNewPages();
//       this.setParent(pages, parent);
//       this.setIndent(pages, indent);
//       parent = pages;
//     }

//     this.setParent(page, parent);
//     this.setIndent(page, indent + 1);
//     this.currentGroups.push(page);
//     return true;
//   }

//   private addGroup(hGroup: CstNode, parent: CstNode, indent: number): boolean {
//     if (hGroup.name != "HGroup") {
//       return false;
//     }

//     this.setIndent(hGroup, indent);
//     this.setParent(hGroup, parent);

//     const items = hGroup.children.Items as CstNode[];

//     // Правила отступов для групп следующие
//     // - отступ первой вертикальной группы совпадает с отступом родителя
//     // - отступ каждой следующей вертикальной группы - всегда 0

//     for (let index = 0; index < items.length; index++) {
//       const vGroup = items[index];

//       let vGroupIndent = 0;
//       if (index == 0) {
//         vGroupIndent = indent;
//       }
//       this.setIndent(vGroup, vGroupIndent);

//       this.currentGroups.push(vGroup);
//     }

//     return true;
//   }

//   private reset() {
//     this.form = this.createForm();
//     this.prevGroups = [this.form];
//     this.currentGroups = [];
//     this.collectedItems = [];

//     this.parents = new WeakMap();
//     this.indents = new WeakMap();
//     this.setIndent(this.form, 0);
//   }

//   private setIndent(item: CstNode, indent: number) {
//     this.indents.set(item, indent);
//   }

//   public setParent(item: CstNode, parent: CstNode) {
//     this.parents.set(item, parent);
//     parent.children.Items.push(item);
//   }

//   public createVGroup(parent: CstNode): CstNode {
//     const group = {
//       name: "VGroup",
//       children: { VGroupHeader: new Array<CstNode>(), Items: new Array<CstNode>(), Properties: [] },
//     };

//     group.children.VGroupHeader.push(this.createVGroupHeader());

//     this.setParent(group, parent);

//     return group;
//   }

//   public createVGroupHeader(): CstNode {
//     const group = {
//       name: "VGroupHeader",
//       children: { Hash: [], Text: [] },
//     };

//     return group;
//   }
//   public createHGroup(): CstNode {
//     const group = {
//       name: "HGroup",
//       children: { Items: [], Properties: [] },
//     };

//     return group;
//   }

//   public createPage(): CstNode {
//     const header = {
//       name: "PageHeader",
//       children: { Slash: [], Text: [], Properties: [] },
//     };

//     const page = {
//       name: "Page",
//       children: { PageHeader: [header], Items: [], Properties: [] },
//     };

//     return page;
//   }

//   private getNewPages(): CstNode {
//     const page = {
//       name: "Pages",
//       children: { Items: [] },
//     };
//     return page;
//   }

//   public createOneLineGroup(): CstNode {
//     const result = {
//       name: "OneLineGroup",
//       children: { Items: [] },
//     };
//     return result;
//   }

//   public createInline(): CstNode {
//     const inline = {
//       name: "Inline",
//       children: { CurrentRow: [], Items: [] },
//     };
//     return inline;
//   }

//   public addToInline(item: CstNode, tokens: Array<IToken>) {
//     item.children.CurrentRow.push(token)
//   }

//   // public doneInline(item: CstNode) {
//   //   const typeToken = this.detector.detect(item.children.CurrentRow)

//   //   item.children.Items.push(typeToken)
//   //   item.children.Items.push(item.children.CurrentRow)
//   // }

//   public createForm(): CstNode {
//     return {
//       name: "Form",
//       children: { Items: Array<CstNode>(), FormHeader: Array<CstNode>() }
//     }
//   }

//   public createFormHeader(): CstNode {
//     let result = {
//       name: "FormHeader",
//       children: { Dash: Array<IToken>(), Text: Array<IToken>() },
//     };
//     return result;
//   }

//   public getForm(): CstNode {
//     return this.form;
//   }
// }

// //
// // #Группа
// //   /Страница
// //     #Группа #Группа
// // От чего зависит
// // next
// // new line
