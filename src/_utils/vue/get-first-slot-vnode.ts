import type { Slots, VNode } from 'vue'
import { warn } from '../naive'
import { flatten } from './flatten'

export function getFirstSlotVNode(
  slots: Slots,
  slotName = 'default',
  props: unknown = undefined
): VNode | null {
  const slot = slots[slotName]
  if (!slot) {
    warn('getFirstSlotVNode', `slot[${slotName}] is empty`)
    return null
  }
  const slotContent = flatten(slot(props))
  // vue 会对 slot 做规范化处理，所以 slot 一定是一个数组
  if (slotContent.length === 1) {
    return slotContent[0]
  }
  else {
    warn('getFirstSlotVNode', `slot[${slotName}] should have exactly one child`)
    return null
  }
}

export function getFirstSlotVNodeWithTypedProps<T>(
  slotName: string,
  slot: ((props: T) => VNode[]) | undefined,
  props: T
): VNode | null {
  if (!slot) {
    return null
  }
  const slotContent = flatten(slot(props))
  // vue 会对 slot 做规范化处理，所以 slot 一定是一个数组
  if (slotContent.length === 1) {
    return slotContent[0]
  }
  else {
    warn('getFirstSlotVNode', `slot[${slotName}] should have exactly one child`)
    return null
  }
}
