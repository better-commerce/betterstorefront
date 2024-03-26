import { tryParseJson } from '@framework/utils/parse-util'

export const setItem = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export const getItem = (key: string) => {
  let item: string | null = null
  if (typeof window !== 'undefined') {
    item = localStorage.getItem(key)
  }
  return tryParseJson(item)
}

export const removeItem = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}
