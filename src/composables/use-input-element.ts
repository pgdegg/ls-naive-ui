import type { InjectionKey, ShallowRef } from 'vue'
import {
  getCurrentInstance,
  inject,
  onActivated,
  onDeactivated,
  onMounted,
  onScopeDispose,
  onUpdated,
  provide,
  ref,
  shallowRef,
  watch
} from 'vue'

export type InputElement = HTMLElement
export type InputElementRegistrar = (
  element: InputElement
) => void | (() => void)
export const inputElementRegistrationKey: InjectionKey<
  InputElementRegistrar | undefined
> = Symbol('n-input-element-registration')

export function useInputElement<T extends HTMLElement = HTMLElement>(
  source?: () => T | null | undefined
): ShallowRef<T | null> {
  const instance = getCurrentInstance()
  const element = shallowRef(null) as ShallowRef<T | null>
  const active = ref(true)
  const refresh = (): void => {
    const root: unknown = instance?.proxy?.$el
    const selector
      = 'input:not(:disabled):not([type="hidden"]),textarea:not(:disabled),[tabindex]:not([aria-disabled="true"])'
    element.value = source
      ? (source() ?? null)
      : typeof HTMLElement !== 'undefined' && root instanceof HTMLElement
        ? root.matches(selector)
          ? (root as T)
          : root.querySelector<T>(selector)
        : null
  }
  onMounted(refresh)
  onUpdated(refresh)
  onActivated(() => {
    active.value = true
    refresh()
  })
  onDeactivated(() => {
    active.value = false
  })
  const register = inject(inputElementRegistrationKey, undefined)
  if (register) {
    provide(inputElementRegistrationKey, undefined)
    const stop = watch(
      () => (active.value ? element.value : null),
      (value, _, onCleanup) => {
        if (!value)
          return
        const cleanup = register(value)
        if (cleanup)
          onCleanup(cleanup)
      },
      { immediate: true, flush: 'post' }
    )
    onScopeDispose(stop)
  }
  return element
}
