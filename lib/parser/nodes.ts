import { CstChildrenDictionary, CstNode, IToken } from "chevrotain"

export interface PagesNode extends CstNode {
  children: PagesDictionary
}

export interface PagesDictionary extends CstChildrenDictionary {
  Items: PageNode[]
  properties: PropertiesNode[]
}

export interface PageNode extends CstNode {
  children: {
    pageHeader: CstNode[]
    pageContent: CstNode[]
  }
}

export interface HorizontalGroupNode extends CstNode {
  children: HorizontalGroupDictionary
}

export interface HorizontalGroupDictionary extends CstChildrenDictionary {
  Items: CstNode[]
  properties: PropertiesNode[]
}

export interface FieldNode extends CstNode {
  children: {
    propertyLine: PropertyLineNode[]
    labelField: LabelFieldNode[]
    inputField: InputFieldNode[]
    checkboxLeftField: CheckboxLeftFieldNode[]
    checkboxRightField: CheckboxRightFieldNode[]
    table: TableNode[]
    commandBar: CommandBarNode[]
    buttonGroup: ButtonGroupNode[]
  }
}

export interface PropertyLineNode extends CstNode {
  children: {
    PropertyLineType: IToken[]
    properties: PropertiesNode[]
  }
}

export interface LabelFieldNode extends CstNode {
  children: {
    LabelFieldType: IToken[]
    LabelContent: IToken[]
    properties: PropertiesNode[]
  }
}

export interface InputFieldNode extends CstNode {
  children: {
    InputFieldType: IToken[]
    InputHeader: IToken[]
    InputValue: IToken[]
    InputModifiers: IToken[]
    properties: PropertiesNode[]
    inputFieldMultiline: CstNode[]
  }
}

export interface CheckboxLeftFieldNode extends CstNode {
  children: {
    CheckboxLeftFieldType: IToken[]
    CheckboxContent: IToken[]
    properties: PropertiesNode[]
  }
}

export interface CheckboxRightFieldNode extends CstNode {
  children: {
    CheckboxRightFieldType: IToken[]
    CheckboxContent: IToken[]
    properties: PropertiesNode[]
  }
}

export interface TableNode extends CstNode {
  children: {
    TableType: IToken[]
    tableHeader: CstNode[]
    tableSeparator: CstNode[]
    tableData: CstNode[]
    properties: PropertiesNode[]
  }
}

export interface CommandBarNode extends CstNode {
  children: {
    CommandBarType: IToken[]
    buttonGroup: ButtonGroupNode[]
    commandBarLine: CstNode[]
    properties: PropertiesNode[]
  }
}

export interface ButtonGroupNode extends CstNode {
  children: {
    button: CstNode[]
  }
}

export interface PropertiesNode extends CstNode {
  children: {
    property: CstNode[]
  }
}
