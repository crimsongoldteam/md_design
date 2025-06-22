import { ClassConstructor, TypeOptions } from "class-transformer"
import { BaseElement } from "../elements/baseElement"

export class PlainToClassDiscriminator {
  public static readonly _discriminatorOptions: TypeOptions = {
    discriminator: {
      property: "Тип",
      subTypes: [],
    },
    keepDiscriminatorProperty: true,
  }

  public static get discriminatorOptions(): TypeOptions {
    return PlainToClassDiscriminator._discriminatorOptions
  }

  public static addClass(elementClass: ClassConstructor<BaseElement>, name: string) {
    PlainToClassDiscriminator._discriminatorOptions.discriminator!.subTypes.push({
      value: elementClass,
      name: name,
    })
  }
}
