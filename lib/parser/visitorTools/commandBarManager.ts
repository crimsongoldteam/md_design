import { ElementListType } from "@/elements/types"
import { ButtonElement } from "@/elements/buttonElement"
import { ButtonGroupElement } from "@/elements/buttonGroupElement"
import { CommandBarElement } from "@/elements/commandBarElement"
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
      this.defaultGroup.add(ElementListType.Items, groups[0].items)

      return
    }

    this.commandBar.items.push(...groups)
    this.defaultGroup = groups[groups.length - 1]
  }

  public addButton(button: ButtonElement | ButtonGroupElement, level: number) {
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
    let title = button.getProperty("Заголовок") as string | undefined
    let image = button.getProperty("Картинка") as string | undefined

    if (!title && !image) {
      return ""
    }

    title = title?.toLowerCase() ?? ""
    image = image?.toLowerCase() ?? ""
    if (!title && !image) {
      return ""
    }

    if (title) {
      return title
    }

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
    if (parent instanceof ButtonElement) {
      parent.switchToSubmenu()
    }
  }
}
