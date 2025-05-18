interface IFormITem {
  type: string
  elementType: string
  elementKind: string
  properties: { [key: string]: any }
  // items: IFormITem[];
  location: {}
}

export class FormItem implements IFormITem {
  public type: string
  public elementType: string
  public elementKind: string
  public properties: { [key: string]: any } = {}
  public items: FormItem[] = []
  public location: {} = {}

  constructor(type: string, elementType: string, elementKind: string) {
    this.type = type
    this.elementType = elementType
    this.elementKind = elementKind
  }
}

export class InputItem implements IFormITem {
  public type: string = "ПолеВвода"
  public elementType: string = "ПолеФормы"
  public elementKind: string = "ПолеВвода"
  public properties: { [key: string]: any } = {}
  public items: FormItem[] = []
  public location: {} = {}

  public value: string = ""
}
export class CheckboxItem implements IFormITem {
  public type: string = "ПолеФлажка"
  public elementType: string = "ПолеФормы"
  public elementKind: string = "ПолеФлажка"
  public properties: { [key: string]: any } = {}
  public items: FormItem[] = []
  public location: {} = {}

  public value: boolean = false
}

export class CommandBarItem implements IFormITem {
  public type: string = "КоманднаяПанель"
  public elementType: string = "ГруппаФормы"
  public elementKind: string = "КоманднаяПанель"
  public properties: { [key: string]: any } = {}
  public items: FormItem[] = []
  public location: {} = {}
}

export class ButtonItem implements IFormITem {
  public type: string = "КнопкаФормы"
  public elementType: string = "КнопкаФормы"
  public elementKind: string = "БезВида"
  public properties: { [key: string]: any } = {}
  public items: FormItem[] = []
  public location: {} = {}
}

export class ButtonGroupItem implements IFormITem {
  public type: string = "ГруппаКнопок"
  public elementType: string = "ГруппаФормы"
  public elementKind: string = "ГруппаКнопок"
  public properties: { [key: string]: any } = {}
  public items: FormItem[] = []
  public location: {} = {}
}

export class TableItem implements IFormITem {
  public type: string = "Таблица"
  public elementType: string = "ТаблицаФормы"
  public elementKind: string = "БезВида"
  public properties: { [key: string]: any } = {}
  public location: {} = {}

  public columns: FormItem[] = []
  public rows: FormItem[] = []
}

export class TableColumnItem implements IFormITem {
  public type: string = "КолонкаТаблицы"
  public elementType: string = "ПолеФормы"
  public elementKind: string = "ПолеВвода"
  public properties: { [key: string]: any } = {}
  public location: {} = {}

  public items: FormItem[] = []
}
