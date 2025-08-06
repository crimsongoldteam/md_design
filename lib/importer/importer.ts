import { ClassTransformOptions, plainToInstance } from "class-transformer"
import { TableColumnElement, TypeDescription } from "@/elements/index"
import { ElementPathData } from "../elementPathData"
import { ITypeDescription } from "@/elements/interfaces"
import { IMetadata, ITypeDescriptionDetectorRequest } from "@/ai/interfaces"
import { Metadata } from "@/ai/metadata"
import { TypeDescriptionDetectorRequest } from "@/ai/typeDescriptionDetectorRequest"

export interface TableClassTransformOptions extends ClassTransformOptions {
  columns: TableColumnElement[]
}

export class Importer {
  public static readonly importElements = (text: string): ElementPathData => {
    const plainObject = JSON.parse(text)
    const options: ClassTransformOptions = {
      strategy: "excludeAll",
    }

    const data = plainToInstance(ElementPathData, plainObject, options) as unknown as ElementPathData

    const result = new ElementPathData(data.item, data.path, data.isNew)

    data.item.updateParents()

    return result
  }

  public static readonly importTypeDescription = (text: string): ITypeDescription => {
    const plainObject = JSON.parse(text)
    const options: ClassTransformOptions = {
      strategy: "excludeAll",
    }

    const data = plainToInstance(TypeDescription, plainObject, options) as unknown as ITypeDescription

    return data
  }

  public static readonly importMetadata = (text: string): IMetadata[] => {
    const plainObject = JSON.parse(text)
    const options: ClassTransformOptions = {
      strategy: "excludeAll",
    }

    const data = plainToInstance(Metadata, plainObject, options) as unknown as IMetadata[]

    return data
  }

  public static readonly importTypeDescriptionDetectorRequests = (text: string): ITypeDescriptionDetectorRequest[] => {
    const plainObject = JSON.parse(text)
    const options: ClassTransformOptions = {
      strategy: "excludeAll",
    }

    const data = plainToInstance(
      TypeDescriptionDetectorRequest,
      plainObject,
      options
    ) as unknown as ITypeDescriptionDetectorRequest[]

    return data
  }
}
