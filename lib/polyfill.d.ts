declare module "./polyfill.js" {
  export function makeLogProxy<T>(obj: T): T
}
export default {}
