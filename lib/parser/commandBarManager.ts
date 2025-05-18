import { ButtonGroupItem, ButtonItem, CommandBarItem } from "./formExport"

export class CommandBarManager {
  private hierarchy: ButtonItem[] = []
  private rootButtons: { [key: string]: ButtonItem } = {}
  private defaultGroup: CommandBarItem | ButtonGroupItem
  private commandBar: CommandBarItem

  constructor(commandBar: CommandBarItem) {
    this.defaultGroup = commandBar
    this.commandBar = commandBar
  }

  public addButtonGroups(groups: ButtonGroupItem[]) {
    groups.forEach((group) => {
      this.addRootButtons(false, ...group.items)
    })

    if (groups.length == 0) {
      return
    }

    if (groups.length == 1) {
      this.defaultGroup.items.push(...groups[0].items)
      return
    }

    this.commandBar.items.push(...groups)
    this.defaultGroup = groups.at(-1) as ButtonGroupItem
  }

  public addButton(button: ButtonItem, level: number) {
    let index = level - 1

    if (index >= this.hierarchy.length) {
      index = this.hierarchy.length - 1
    }

    if (index == -1) {
      let parent = this.getCreateRootButton(button)
      this.hierarchy = [parent]
      return
    }

    let parent = this.hierarchy[index]
    parent.items.push(button)
    this.hierarchy = this.hierarchy.slice(0, index + 1)
    this.hierarchy.push(button)
  }

  private getCreateRootButton(button: ButtonItem): ButtonItem {
    const key = this.getKey(button)
    let result = this.getByKey(key)
    if (!result) {
      this.addRootButtons(true, button)
      result = button
    }
    return result
  }

  private addRootButtons(addToDefaultGroup: boolean, ...buttons: ButtonItem[]) {
    buttons.forEach((button) => {
      const key = this.getKey(button)
      this.setKey(button, key)
      if (addToDefaultGroup) {
        this.defaultGroup.items.push(button)
      }
    })
  }

  private getKey(button: ButtonItem): string {
    const title = button.properties["Заголовок"]?.toLowerCase() || ""
    const image = button.properties["Картинка"]?.toLowerCase() || ""
    return title + "@" + image
  }

  private getByKey(key: string): ButtonItem | undefined {
    return this.rootButtons[key]
  }

  private setKey(button: ButtonItem, key: string) {
    this.rootButtons[key] = button
  }
}
