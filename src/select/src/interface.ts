import type { TreeMate } from 'treemate'
import type { CSSProperties, VNode, VNodeChild } from 'vue'

export type SelectMixedOption
  = SelectBaseOption | SelectGroupOption | SelectIgnoredOption

export interface SelectBaseOption<
  V = string | number,
  L = string | ((option: SelectBaseOption<V>, selected: boolean) => VNodeChild)
> {
  value?: V
  label?: L
  class?: string
  style?: string | CSSProperties
  disabled?: boolean
  render?: (info: {
    node: VNode
    option: SelectBaseOption<V>
    selected: boolean
  }) => VNodeChild
  [k: string]: unknown
}

export interface SelectGroupOptionBase {
  label?: string | ((option: SelectGroupOption) => VNodeChild)
  type: 'group'
  children?: SelectBaseOption[]
  render?: (info: { node: VNode, option: SelectGroupOption }) => VNodeChild
  [k: string]: unknown
}

export interface SelectIgnoredOption {
  type: 'ignored'
  value: string | number
  [k: string]: unknown
}

export type ValueAtom = string | number
export type Value = ValueAtom | string[] | number[] | ValueAtom[]
export type OnUpdateValue = (
  value: string
    & number
    & ValueAtom
    & string[]
    & number[]
    & ValueAtom[]
    & (ValueAtom | null)
    & (string[] | null)
    & (number[] | null)
    & (ValueAtom[] | null),
  option: SelectBaseOption & null & SelectBaseOption[]
) => void
export type OnUpdateValueImpl = (
  value:
    | ValueAtom
    | string[]
    | number[]
    | ValueAtom[]
    | (ValueAtom | null)
    | (string[] | null)
    | (number[] | null)
    | (ValueAtom[] | null),
  option: SelectBaseOption | null | SelectBaseOption[]
) => void
export type SelectTreeMate = TreeMate<
  SelectBaseOption,
  SelectGroupOption,
  SelectIgnoredOption
>

// 公共接口
export type SelectOption = SelectBaseOption<string | number>
export type SelectGroupOption
  = | (SelectGroupOptionBase & {
    /** @deprecated 应改用 key 和 label */
    name?: string
  })
  | (SelectGroupOptionBase & {
    key: string | number
  })

export interface SelectInst {
  readonly inputElement: HTMLElement | null
  focus: () => void
  blur: () => void
  focusInput: () => void
  blurInput: () => void
}

export type SelectFallbackOption = (value: string & number) => SelectOption
export type SelectFallbackOptionImpl = (value: string | number) => SelectOption
export type SelectFilter = (pattern: string, option: SelectOption) => boolean
