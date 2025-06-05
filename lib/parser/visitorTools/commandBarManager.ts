import { ButtonGroupElement, ButtonElement, CommandBarElement } from "./formElements"
import { HierarchyManager } from "./hierarchyManager"

export class CommandBarManager {
  private readonly hierarchy: HierarchyManager

  private rootButtons: { [key: string]: ButtonElement } = {}
  private defaultGroup: CommandBarElement | ButtonGroupElement
  private readonly commandBar: CommandBarElement

  constructor(commandBar: CommandBarElement) {
    this.defaultGroup = commandBar
    this.commandBar = commandBar

    this.hierarchy = new HierarchyManager(
      "items",
      (item) => this.getDefaultParent(item),
      (parent, item) => this.afterAddCallback(parent, item)
    )
  }

  public addButtonGroups(groups: ButtonGroupElement[]) {
    groups.forEach((group) => {
      this.addRootButtons(false, ...group.items)
    })

    if (groups.length == 0) {
      return
    }

    if (groups.length == 1) {
      this.defaultGroup.add("items", groups[0].items)

      return
    }

    this.commandBar.items.push(...groups)
    this.defaultGroup = groups[groups.length - 1]
  }

  public addButton(button: ButtonElement, level: number) {
    this.hierarchy.set(button, level)
  }

  private getCreateRootButton(button: ButtonElement): ButtonElement {
    const key = this.getKey(button)
    let result = this.getByKey(key)
    if (!result) {
      this.addRootButtons(true, button)
      result = button
    }
    return result
  }

  private addRootButtons(addToDefaultGroup: boolean, ...buttons: ButtonElement[]) {
    buttons.forEach((button) => {
      const key = this.getKey(button)
      this.setKey(button, key)
      if (addToDefaultGroup) {
        this.defaultGroup.items.push(button)
      }
    })
  }

  private getKey(button: ButtonElement): string {
    const title = button.properties["Заголовок"]?.toLowerCase() ?? ""
    const image = button.properties["Картинка"]?.toLowerCase() ?? ""
    return title + "@" + image
  }

  private getByKey(key: string): ButtonElement | undefined {
    return this.rootButtons[key]
  }

  private setKey(button: ButtonElement, key: string) {
    this.rootButtons[key] = button
  }

  private getDefaultParent(item: ButtonElement): ButtonElement {
    return this.getCreateRootButton(item)
  }

  private afterAddCallback(parent: ButtonElement | undefined, _item: ButtonElement): void {
    if (!parent) {
      return
    }
    parent.switchToSubmenu()
  }
}
