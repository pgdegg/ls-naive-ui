import type { TabsType } from './interface'

export function isCardType(
  type: TabsType
): type is 'card' | 'border-card' | 'card-group' {
  return type === 'card' || type === 'border-card' || type === 'card-group'
}
