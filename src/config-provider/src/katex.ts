/**
 * Naive UI 使用的最小化 katex 兼容类型。
 * katex 本身是可选的，必须由用户提供。
 */
export type KatexOptions = Record<string, unknown>

export interface Katex {
  renderToString: (equation: string, options?: KatexOptions) => string
}
