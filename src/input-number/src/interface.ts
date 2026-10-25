import type { InputNumberSize } from './public-types'

export type OnUpdateValue = (value: number | null) => void
export type Size = InputNumberSize

export interface InputNumberInst {
  readonly inputElement: HTMLElement | null
  focus: () => void
  blur: () => void
  select: () => void
}
