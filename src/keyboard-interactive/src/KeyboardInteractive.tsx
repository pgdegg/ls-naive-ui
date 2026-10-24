import type { PropType, SlotsType } from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'
import type {
  KeyboardInteractiveEnterContext,
  KeyboardInteractiveFormRegistration,
  KeyboardInteractiveInst,
  KeyboardInteractiveItemRegistration
} from './interface'
import {
  defineComponent,
  h,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef
} from 'vue'
import { useConfig } from '../../_mixins'
import { eventEffectNotPerformed } from '../../_utils/event'
import { keyboardInteractiveInjectionKey } from './context'

export const keyboardInteractiveProps = {
  disabled: Boolean,
  defaultFocusFirst: { type: Boolean, default: true },
  loopFocus: Boolean,
  skipWhenHasValue: { type: Boolean, default: true },
  stopWhenInvalid: { type: Boolean, default: true },
  enterProvider: Function as PropType<
    (
      context: KeyboardInteractiveEnterContext
    ) => void | boolean | Promise<void | boolean>
  >,
  onEnter: Function as PropType<
    (context: KeyboardInteractiveEnterContext) => void
  >,
  onLastBlur: Function as PropType<() => void>
}

export type KeyboardInteractiveProps = ExtractPublicPropTypes<
  typeof keyboardInteractiveProps
>

export interface KeyboardInteractiveSlots {
  default?: () => import('vue').VNode[]
}

const controlSelector
  = 'input, textarea, select, button, [tabindex], [contenteditable="true"]'

export default defineComponent({
  name: 'KeyboardInteractive',
  props: keyboardInteractiveProps,
  slots: Object as SlotsType<KeyboardInteractiveSlots>,
  setup(props, { expose }) {
    const { mergedClsPrefixRef } = useConfig(props)
    const element = ref<HTMLElement | null>(null)
    const parent = inject(keyboardInteractiveInjectionKey, null)
    const items = new Set<KeyboardInteractiveItemRegistration>()
    const formItems = new Set<KeyboardInteractiveFormRegistration>()
    const currentFocused = shallowRef<HTMLElement | null>(null)
    const previousFocused = shallowRef<HTMLElement | null>(null)
    let busy = false
    let mounted = true
    let blockedEnter = false
    provide(keyboardInteractiveInjectionKey, {
      handleKeyup,
      registerItem(item) {
        items.add(item)
        const unregisterParent = parent?.registerItem(item)
        return () => {
          items.delete(item)
          unregisterParent?.()
        }
      },
      registerFormItem(item) {
        formItems.add(item)
        const unregisterParent = parent?.registerFormItem(item)
        return () => {
          formItems.delete(item)
          unregisterParent?.()
        }
      }
    })

    function itemFor(
      control: HTMLElement
    ): KeyboardInteractiveItemRegistration | undefined {
      return Array.from(items)
        .filter(item => item.element.value?.contains(control))
        .sort((a, b) =>
          a.element.value?.contains(b.element.value) ? 1 : -1
        )[0]
    }

    function formFor(
      control: HTMLElement
    ): KeyboardInteractiveFormRegistration | undefined {
      return Array.from(formItems)
        .filter(item => item.element.value?.contains(control))
        .sort((a, b) =>
          a.element.value?.contains(b.element.value) ? 1 : -1
        )[0]
    }

    function queue(): HTMLElement[] {
      if (!element.value || props.disabled)
        return []
      return Array.from(
        element.value.querySelectorAll<HTMLElement>(controlSelector)
      )
        .filter((control) => {
          if (control.matches(':disabled, [readonly], input[type="hidden"]'))
            return false
          if (
            control.tabIndex < 0
            || control.closest(
              '[hidden], [inert], [aria-disabled="true"], [data-keyboard-interactive-disabled="true"]'
            )
          ) {
            return false
          }
          if (
            Array.from(items).some(
              item =>
                item.getOptions().ignore
                && item.element.value?.contains(control)
            )
          ) {
            return false
          }
          let ancestor: HTMLElement | null = control
          while (ancestor) {
            const style = getComputedStyle(ancestor)
            if (style.display === 'none' || style.visibility === 'hidden')
              return false
            ancestor = ancestor.parentElement
          }
          return true
        })
        .sort((a, b) => {
          const aOrder = itemFor(a)?.getOptions().order
          const bOrder = itemFor(b)?.getOptions().order
          if (aOrder !== undefined && bOrder !== undefined)
            return aOrder - bOrder
          if (aOrder !== undefined)
            return -1
          if (bOrder !== undefined)
            return 1
          return 0
        })
    }

    function hasValue(control: HTMLElement): boolean {
      const options = itemFor(control)?.getOptions()
      const value
        = options?.value !== undefined
          ? options.value
          : control instanceof HTMLInputElement
            && ['checkbox', 'radio'].includes(control.type)
            ? control.checked || null
            : control instanceof HTMLInputElement
              || control instanceof HTMLTextAreaElement
              || control instanceof HTMLSelectElement
              ? control.value
              : undefined
      return (
        value !== undefined
        && value !== null
        && value !== ''
        && !(Array.isArray(value) && value.length === 0)
      )
    }

    function focusElement(control: HTMLElement | undefined): void {
      if (!control)
        return
      control.focus()
      control.scrollIntoView?.({ block: 'nearest' })
    }

    function resolveControl(
      target: EventTarget | null,
      controls = queue()
    ): HTMLElement | undefined {
      if (!(target instanceof HTMLElement))
        return undefined
      return (
        controls.find(control => control === target)
        ?? controls.find(control => control.contains(target))
      )
    }

    function handleKeydownCapture(event: KeyboardEvent): void {
      if (!parent && event.key === 'Enter') {
        blockedEnter = event.isComposing || event.keyCode === 229
      }
    }

    function handleKeydown(event: KeyboardEvent): void {
      if (parent || props.disabled || event.key !== 'Enter')
        return
      blockedEnter ||= event.defaultPrevented || !eventEffectNotPerformed(event)
      const current = resolveControl(event.target)
      if (
        !blockedEnter
        && current
        && !(current instanceof HTMLTextAreaElement)
        && !current.isContentEditable
        && !event.shiftKey
        && !event.ctrlKey
        && !event.altKey
        && !event.metaKey
      ) {
        event.preventDefault()
      }
    }

    const focus: KeyboardInteractiveInst['focus'] = async (
      target,
      direction,
      rowId
    ) => {
      await nextTick()
      if (!mounted)
        return
      const controls = queue()
      let control: HTMLElement | undefined
      if (target === 'first') {
        control = controls[0]
      }
      else if (target === 'last') {
        control = controls[controls.length - 1]
      }
      else if (target === 'next' || target === 'prev') {
        const index = controls.indexOf(currentFocused.value!)
        if (index !== -1)
          control = controls[index + (target === 'next' ? 1 : -1)]
      }
      else if (
        typeof target === 'string'
        || !(target instanceof HTMLElement)
      ) {
        const path = typeof target === 'string' ? target : target.field
        control = controls.find((candidate) => {
          const options = itemFor(candidate)?.getOptions()
          return (
            (options?.path
              ?? formFor(candidate)?.getPath()
              ?? candidate.getAttribute('name')) === path
              && (rowId === undefined || options?.rowId === rowId)
          )
        })
      }
      else {
        control = controls.includes(target) ? target : undefined
      }
      if (direction && control) {
        control
          = controls[controls.indexOf(control) + (direction === 'next' ? 1 : -1)]
      }
      focusElement(control)
    }

    async function handleKeyup(event: KeyboardEvent): Promise<void> {
      if (props.disabled)
        return
      if (parent)
        return parent.handleKeyup(event)
      if (blockedEnter)
        return
      if (
        props.disabled
        || event.key !== 'Enter'
        || event.isComposing
        || event.keyCode === 229
        || event.shiftKey
        || event.ctrlKey
        || event.altKey
        || event.metaKey
        || event.defaultPrevented
      ) {
        return
      }
      const controls = queue()
      const current = resolveControl(event.target, controls)
      if (!current)
        return
      const index = controls.indexOf(current)
      if (
        index === -1
        || current instanceof HTMLTextAreaElement
        || current.isContentEditable
      ) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      if (busy)
        return
      busy = true
      try {
        if (props.stopWhenInvalid) {
          const validate
            = itemFor(current)?.getOptions().validate
              ?? formFor(current)?.validate
          if (validate && !(await validate()))
            return
        }
        if (
          !mounted
          || props.disabled
          || !current.contains(document.activeElement)
        ) {
          return
        }
        const liveControls = queue()
        const liveIndex = liveControls.indexOf(current)
        if (liveIndex === -1)
          return
        const next
          = liveControls
            .slice(liveIndex + 1)
            .find(
              candidate => !props.skipWhenHasValue || !hasValue(candidate)
            ) ?? null
        const context = { event, current, next }
        props.onEnter?.(context)
        if ((await props.enterProvider?.(context)) === false)
          return
        if (
          !mounted
          || props.disabled
          || !current.contains(document.activeElement)
        ) {
          return
        }
        if (next) {
          if (queue().includes(next))
            focusElement(next)
        }
        else {
          props.onLastBlur?.()
          if (props.loopFocus)
            focusElement(queue()[0])
        }
      }
      catch {
        // Rejected validation or providers keep focus on the current control.
      }
      finally {
        busy = false
      }
    }

    function handleFocusin(event: FocusEvent): void {
      const target = resolveControl(event.target)
      if (!target)
        return
      if (currentFocused.value !== target) {
        previousFocused.value = currentFocused.value
        currentFocused.value = target
      }
    }

    function handleFocusout(): void {
      void nextTick(() => {
        if (!element.value?.contains(document.activeElement))
          currentFocused.value = null
      })
    }

    expose({
      focus,
      get currentFocused() {
        return currentFocused.value
      },
      get previousFocused() {
        return previousFocused.value
      },
      get nextFocused() {
        const controls = queue()
        const index = controls.indexOf(currentFocused.value!)
        return index === -1 ? null : (controls[index + 1] ?? null)
      }
    } satisfies KeyboardInteractiveInst)
    onMounted(() => {
      element.value?.addEventListener('keydown', handleKeydownCapture, true)
      if (!parent && props.defaultFocusFirst)
        void focus('first')
    })
    onBeforeUnmount(() => {
      mounted = false
      element.value?.removeEventListener('keydown', handleKeydownCapture, true)
    })
    return {
      element,
      mergedClsPrefix: mergedClsPrefixRef,
      handleKeyup,
      handleKeydown,
      handleKeydownCapture,
      handleFocusin,
      handleFocusout
    }
  },
  render() {
    return (
      <section
        ref="element"
        class={`${this.mergedClsPrefix}-keyboard-interactive`}
        data-keyboard-interactive-disabled={this.disabled ? 'true' : undefined}
        onKeyup={this.handleKeyup}
        onKeydown={this.handleKeydown}
        onFocusin={this.handleFocusin}
        onFocusout={this.handleFocusout}
      >
        {this.$slots.default?.()}
      </section>
    )
  }
})
