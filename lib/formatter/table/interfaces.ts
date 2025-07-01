export interface ITableFormatterCell {
  getLength(): number
  getCalulatedLength(): number
  getValue(): string
  getEmptyValue(): string
}
export interface ConvertableTreeNode {
  items: ConvertableTreeNode[]
}
