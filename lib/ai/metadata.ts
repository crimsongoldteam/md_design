import { Expose } from "class-transformer"
import { IMetadata } from "./interfaces"

export class Metadata implements IMetadata {
  @Expose({ name: "Синоним" })
  description: string = ""

  @Expose({ name: "Имя" })
  type: string = ""

  @Expose({ name: "Раздел" })
  section: string = ""
}
