export function useDebounce(callback: Function, delay: number) {
  let timeoutId: NodeJS.Timeout
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback.apply(this, args), delay)
  }
}
