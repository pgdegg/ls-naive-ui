import type {
  HTMLAttributes,
  PropType,
  SlotsType,
  VNode,
  VNodeChild
} from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { TabsCloseButtonDisplay } from './interface'
import { computed, defineComponent, h, inject, provide, watchEffect } from 'vue'
import { throwError, warnOnce } from '../../_utils'
import { tabPaneActiveContextKey } from './active-context'
import { tabsInjectionKey } from './interface'

export const tabPaneProps = {
  icon: [String, Object, Function] as PropType<
    string | VNode | (() => VNodeChild)
  >,
  tab: [String, Number, Object, Function] as PropType<
    string | number | VNode | (() => VNodeChild)
  >,
  name: {
    type: [String, Number] as PropType<string | number>,
    required: true
  },
  disabled: Boolean,
  fixed: String as PropType<'left' | 'right'>,
  closeButtonDisplay: String as PropType<TabsCloseButtonDisplay>,
  displayDirective: {
    type: String as PropType<'if' | 'show' | 'show:lazy'>,
    default: 'if'
  },
  closable: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  tabProps: Object as PropType<HTMLAttributes>,
  /** @deprecated */
  label: [String, Number, Object, Function] as PropType<
    string | number | VNode | (() => VNodeChild)
  >
} as const

export type TabPaneProps = ExtractPublicPropTypes<typeof tabPaneProps>

export interface TabPaneSlots {
  icon?: () => VNode[]
  default?: () => VNode[]
  tab?: () => VNode[]
  prefix?: () => VNode[]
  suffix?: () => VNode[]
}

export default defineComponent({
  __TAB_PANE__: true,
  name: 'TabPane',
  alias: ['TabPanel'],
  props: tabPaneProps,
  slots: Object as SlotsType<TabPaneSlots>,
  setup(props) {
    if (__DEV__) {
      watchEffect(() => {
        if (props.label !== undefined) {
          warnOnce(
            'tab-pane',
            '`label` is deprecated, please use `tab` instead.'
          )
        }
      })
    }
    const NTab = inject(tabsInjectionKey, null)
    if (!NTab) {
      throwError('tab-pane', '`n-tab-pane` must be placed inside `n-tabs`.')
    }
    const parentActiveContext = inject(tabPaneActiveContextKey, null)
    const selfActive = computed(() => NTab.valueRef.value === props.name)
    const active = computed(
      () => selfActive.value && (parentActiveContext?.active.value ?? true)
    )
    const path = computed(() =>
      parentActiveContext
        ? `${parentActiveContext.path.value}/${props.name}`
        : String(props.name)
    )
    provide(tabPaneActiveContextKey, { selfActive, active, path })
    return {
      style: NTab.paneStyleRef,
      class: NTab.paneClassRef,
      mergedClsPrefix: NTab.mergedClsPrefixRef
    }
  },
  render() {
    return (
      <div
        class={[`${this.mergedClsPrefix}-tab-pane`, this.class]}
        style={this.style}
      >
        {this.$slots.default?.()}
      </div>
    )
  }
})
