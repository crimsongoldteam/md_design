import { PropertyAlignment } from "@/elements/types"

export class CellTextAligner {
  /**
   * Aligns text according to the specified alignment
   * @param value - source text
   * @param targetLength - target string length
   * @param alignment - alignment type
   * @returns aligned text
   */
  public static alignText(value: string, targetLength: number, alignment: PropertyAlignment): string {
    const padding = targetLength - value.length

    if (alignment === PropertyAlignment.Left) {
      return value + " ".repeat(padding)
    }

    if (alignment === PropertyAlignment.Right) {
      return " ".repeat(padding) + value
    }

    const leftPad = Math.floor(padding / 2)
    const rightPad = padding - leftPad
    return " ".repeat(leftPad) + value + " ".repeat(rightPad)
  }
}
