import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { resizeObserverManager } from 'vueuc'

export function useOnResize(
  elRef: Ref<HTMLElement | null>,
  onResize: (() => void) | undefined
): void {
  // 它不需要是响应式的，因为仅供内部使用
  if (onResize) {
    onMounted(() => {
      const { value: el } = elRef
      if (el) {
        resizeObserverManager.registerHandler(el, onResize)
      }
    })

    // 避免内存泄漏
    watch(
      elRef,
      (_, oldEl) => {
        if (oldEl) {
          resizeObserverManager.unregisterHandler(oldEl)
        }
      },
      {
        deep: false
      }
    )

    onBeforeUnmount(() => {
      const { value: el } = elRef
      if (el) {
        resizeObserverManager.unregisterHandler(el)
      }
    })
  }
}
