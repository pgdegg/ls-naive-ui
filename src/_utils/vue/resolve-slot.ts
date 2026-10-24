import type { Slot, VNodeArrayChildren, VNodeChild } from 'vue'
import { Comment, Fragment, isVNode } from 'vue'

export function ensureValidVNode(
  vnodes: VNodeArrayChildren
): VNodeArrayChildren | null {
  return vnodes.some((child) => {
    if (!isVNode(child)) {
      return true
    }
    if (child.type === Comment) {
      return false
    }
    if (
      child.type === Fragment
      && !ensureValidVNode(child.children as VNodeArrayChildren)
    ) {
      return false
    }
    return true
  })
    ? vnodes
    : null
}

/**
 * 当 slot flags 为 `_: 1, 2, 3` 时不应使用以下函数
 */
export function resolveSlot(
  slot: Slot | undefined,
  fallback: () => VNodeArrayChildren
): VNodeArrayChildren {
  return (slot && ensureValidVNode(slot())) || fallback()
}

export function resolveSlotWithTypedProps<T>(
  slot: Slot<T> | undefined,
  props: T,
  fallback: (props: T) => VNodeArrayChildren
): VNodeArrayChildren {
  return (slot && ensureValidVNode(slot(props))) || fallback(props)
}

/**
 * 内容存在时用 wrapper 解析 slot，无 fallback
 */
export function resolveWrappedSlot(
  slot: Slot | undefined,
  wrapper: (children: VNodeArrayChildren | null) => VNodeChild
): VNodeChild {
  const children = slot && ensureValidVNode(slot())
  return wrapper(children || null)
}

/*
 * 内容存在时用 wrapper 解析 slot，无 fallback
 */
export function resolveWrappedSlotWithProps(
  slot: Slot | undefined,
  props: any,
  wrapper: (children: VNodeArrayChildren | null) => VNodeChild
): VNodeChild {
  const children = slot && ensureValidVNode(slot(props))
  return wrapper(children || null)
}

export function isSlotEmpty(slot: Slot | undefined): boolean {
  return !(slot && ensureValidVNode(slot()))
}
