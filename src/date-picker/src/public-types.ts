import type { ExtractPublicPropTypes } from '../../_utils'
import type { DatePickerDefaultValueProps } from './props'

export type DatePickerSize = 'small' | 'medium' | 'large'

export interface DatePickerInst {
  readonly inputElement: HTMLElement | null
  focus: () => void
  blur: () => void
}

export type DatePickerProps = ExtractPublicPropTypes<
  typeof DatePickerDefaultValueProps
>

export type DatePickerClearSlotOnClear = () => void
export interface DatePickerClearSlotProps {
  onClear: DatePickerClearSlotOnClear
  text: string
}

export type DatePickerNowSlotOnNow = () => void
export interface DatePickerNowSlotProps {
  onNow: DatePickerNowSlotOnNow
  text: string
}

export type DatePickerConfirmSlotOnConfirm = () => void
export interface DatePickerConfirmSlotProps {
  onConfirm: DatePickerConfirmSlotOnConfirm
  disabled: boolean
  text: string
}
