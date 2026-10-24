import type { HTMLAttributes } from 'vue'

export function getTitleAttribute(value: unknown): HTMLAttributes['title'] {
  switch (typeof value) {
    case 'string':
      // 空字符串也应重置为 undefined。
      return value || undefined
    case 'number':
      return String(value)
    default:
      return undefined
  }
}
