import { Comment, isVNode } from 'vue'

export function getTitleText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number')
    return String(value)
  if (Array.isArray(value))
    return value.map(getTitleText).join('')
  if (isVNode(value) && value.type !== Comment)
    return getTitleText(value.children)
  return ''
}

export function getSelectionTitle(
  option: Record<string, unknown>,
  labelField: string,
  valueField: string,
  showValue: boolean
): string | undefined {
  const rawLabel = option[labelField]
  const label = getTitleText(
    typeof rawLabel === 'function' ? rawLabel(option, true) : rawLabel
  )
  const value = getTitleText(option[valueField])
  return (showValue ? `${value}「${label}」` : label) || undefined
}
