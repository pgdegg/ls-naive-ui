import type { PropType, SlotsType } from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'
import { defineComponent, h, inject, onBeforeUnmount, ref } from 'vue'
import { keyboardInteractiveInjectionKey } from './context'

export const keyboardInteractiveItemProps = {
  order: Number,
  ignore: Boolean,
  path: String,
  rowId: String,
  value: null,
  validate: Function as PropType<() => boolean | Promise<boolean>>
}

export type KeyboardInteractiveItemProps = ExtractPublicPropTypes<
  typeof keyboardInteractiveItemProps
>

export interface KeyboardInteractiveItemSlots {
  default?: () => import('vue').VNode[]
}

export default defineComponent({
  name: 'KeyboardInteractiveItem',
  props: keyboardInteractiveItemProps,
  slots: Object as SlotsType<KeyboardInteractiveItemSlots>,
  setup(props) {
    const element = ref<HTMLElement | null>(null)
    const interactive = inject(keyboardInteractiveInjectionKey, null)
    const unregister = interactive?.registerItem({
      element,
      getOptions: () => props
    })
    onBeforeUnmount(() => unregister?.())
    return { element }
  },
  render() {
    return <div ref="element">{this.$slots.default?.()}</div>
  }
})
