import { BaseElement } from "../elements/baseElement"
import { TypeDescription } from "../elements/typeDescription"
import { DateFractions } from "@/elements/types"
import { IFormatter } from "./formFormatter"
import { ITypeDescription } from "@/elements/interfaces"

export class PropertiesFormatter implements IFormatter<BaseElement> {
  public formatSingleLine(element: BaseElement, params?: { excludeProperties: string[] }): string[] {
    const result = this.formatProperties(element, params)
    return result ? [result] : []
  }

  public format(element: BaseElement, params?: { excludeProperties: string[] }): string[] {
    const result = this.formatProperties(element, params)
    return result ? [" " + result] : []
  }

  public formatTypeDescription(typeDescription: ITypeDescription): string {
    const result = new Array()
    if (typeDescription.auto) {
      return ""
    }

    const formatNumber = this.getFormatNumber(typeDescription, "Число", true)
    if (formatNumber) {
      result.push(formatNumber)
    }

    const formatString = this.getFormatString(typeDescription, "Строка", true)
    if (formatString) {
      result.push(formatString)
    }

    const formatDate = this.getFormatData(typeDescription, "Дата", true)
    if (formatDate) {
      result.push(formatDate)
    }

    for (const type of typeDescription.types) {
      if (type === "Число" || type === "Дата" || type === "Строка") {
        continue
      }
      result.push(type)
    }

    if (result.length === 0) {
      return ""
    }

    return [...result].sort((a: string, b: string) => a.localeCompare(b)).join(", ")
  }
  private formatProperties(element: BaseElement, params?: { excludeProperties: string[] }): string | undefined {
    const lowerExcludeProperties: string[] = params?.excludeProperties.map((prop) => prop.toLowerCase()) ?? []

    const template = "%1 = %2"
    const resultArray: string[] = []

    const typeDescription = (element as any).typeDescription
    if (typeDescription) {
      const typeDescStr = this.formatTypeDescription(typeDescription)
      if (typeDescStr) {
        resultArray.push(template.replace("%1", "Тип").replace("%2", typeDescStr))
      }
    }

    for (const [key, value] of element.properties.entries()) {
      if (lowerExcludeProperties.includes(key.toLowerCase())) {
        continue
      }
      let formattedValue = ""
      if (Array.isArray(value)) {
        formattedValue = value.join(", ")
      } else if (typeof value === "string") {
        formattedValue = value.trim()
      } else if (typeof value === "boolean") {
        formattedValue = value ? "Да" : "Нет"
      } else {
        formattedValue = String(value)
      }
      resultArray.push(template.replace("%1", key).replace("%2", formattedValue))
    }

    if (resultArray.length === 0) {
      return undefined
    }
    const sortedArray = [...resultArray].sort((a: string, b: string) => a.localeCompare(b))
    return "{" + sortedArray.join("; ") + "}"
  }

  private getFormatNumber(typeDescription: TypeDescription, type: string, forFormatter: boolean): string | undefined {
    if (typeDescription.types.indexOf(type) === -1) {
      return undefined
    }

    const parameters = new Array()
    if (typeDescription.digits !== 0) {
      parameters.push(typeDescription.digits)
    }

    if (typeDescription.fractionDigits !== 0) {
      parameters.push(typeDescription.fractionDigits)
    }

    if (!forFormatter && parameters.length === 0) {
      return undefined
    }

    return this.getOperationRepresentation(type, parameters)
  }

  private getFormatString(typeDescription: TypeDescription, type: string, forFormatter: boolean): string | undefined {
    if (typeDescription.types.indexOf(type) === -1) {
      return undefined
    }

    const parameters = new Array()
    if (typeDescription.length !== 0) {
      parameters.push(typeDescription.length)
    }

    if (!forFormatter && parameters.length === 0) {
      return ""
    }

    return this.getOperationRepresentation(type, parameters)
  }

  private getFormatData(typeDescription: TypeDescription, type: string, forFormatter: boolean): string | undefined {
    if (typeDescription.types.indexOf(type) === -1) {
      return undefined
    }

    const parameters = new Array()
    if (typeDescription.dateFractions !== DateFractions.Date) {
      const dateFraction = forFormatter ? "" : "ЧастиДаты."
      parameters.push(dateFraction + typeDescription.dateFractions)
    }

    if (!forFormatter && parameters.length === 0) {
      return undefined
    }

    return this.getOperationRepresentation(type, parameters)
  }

  private getOperationRepresentation(type: string, parameters: any[]): string {
    let result = type
    if (parameters.length === 0) {
      return result
    }

    return result + "(" + parameters.join(", ") + ")"
  }
}
