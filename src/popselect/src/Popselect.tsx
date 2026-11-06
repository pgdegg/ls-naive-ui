import type { ExtractPropTypes, PropType, SlotsType, VNode } from 'vue'
import type { ScrollbarProps } from '../../_internal/scrollbar/src/Scrollbar'
import type { ThemeProps } from '../../_mixins'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { PopoverInst, PopoverTrigger } from '../../popover'
import type { PopoverInternalProps } from '../../popover/src/Popover'
import type { PopselectTheme, PopselectThemeOverrides } from '../styles'
import type { PopselectInst } from './interface'
import { createTreeMate } from 'treemate'
import { cloneVNode, computed, defineComponent, h, provide, ref } from 'vue'
import { useConfig, useTheme } from '../../_mixins'
import {
  createRefSetter,
  getFirstSlotVNode,
  keep,
  mergeEventHandlers,
  omit
} from '../../_utils'
import { getSelectionTitle } from '../../_utils/naive/selection-title'
import { NPopover } from '../../popover'
import { PopoverBaseDefaultValueProps } from '../../popover/src/Popover'
import { createTmOptions } from '../../select/src/utils'
import { popselectLight } from '../styles'
import { popselectInjectionKey } from './interface'
import NPopselectPanel, {
  panelPropKeys,
  PopselectPanelDefaultValueProps
} from './PopselectPanel'

export const PopselectDefaultValueProps = {
  showValueInTitle: Boolean,
  ...(useTheme.props as ThemeProps<PopselectTheme, PopselectThemeOverrides>),
  ...omit(PopoverBaseDefaultValueProps, ['showArrow', 'arrow']),
  placement: {
    ...PopoverBaseDefaultValueProps.placement,
    default: 'bottom'
  },
  trigger: {
    type: String as PropType<PopoverTrigger>,
    default: 'hover'
  },
  ...PopselectPanelDefaultValueProps,
  scrollbarProps: Object as PropType<ScrollbarProps>
}

export type PopselectSetupProps = ExtractPropTypes<
  typeof PopselectDefaultValueProps
>
export type PopselectProps = ExtractPublicPropTypes<
  typeof PopselectDefaultValueProps
>

export interface PopselectSlots {
  default?: () => VNode[]
  header?: () => VNode[]
  action?: () => VNode[]
  empty?: () => VNode[]
}

export default defineComponent({
  name: 'Popselect',
  props: PopselectDefaultValueProps,
  slots: Object as SlotsType<PopselectSlots>,
  inheritAttrs: false,
  __popover__: true,
  setup(props) {
    const { mergedClsPrefixRef } = useConfig(props)
    const themeRef = useTheme(
      'Popselect',
      '-popselect',
      undefined,
      popselectLight,
      props,
      mergedClsPrefixRef
    )
    const popoverInstRef = ref<PopoverInst | null>(null)
    const treeMateRef = computed(() =>
      createTreeMate(props.options, createTmOptions('value', 'children'))
    )
    const selectionTitleRef = computed(() => {
      const values = Array.isArray(props.value)
        ? props.value
        : props.value === null
          ? []
          : [props.value]
      return (
        values
          .map((value) => {
            const option = treeMateRef.value.getNode(value)?.rawNode
            return getSelectionTitle(
              option || { value, label: value },
              'label',
              'value',
              props.showValueInTitle
            )
          })
          .filter(Boolean)
          .join('\n') || undefined
      )
    })
    function syncPosition(): void {
      popoverInstRef.value?.syncPosition()
    }
    function setShow(value: boolean): void {
      popoverInstRef.value?.setShow(value)
    }
    provide(popselectInjectionKey, {
      props,
      mergedThemeRef: themeRef,
      syncPosition,
      setShow
    })
    const exposedMethods: PopselectInst = {
      syncPosition,
      setShow
    }
    return {
      ...exposedMethods,
      selectionTitle: selectionTitleRef,
      // 减小 dts 体积：render 中只用到字符串 ref，类型用不上
      popoverInstRef: popoverInstRef as unknown,
      mergedTheme: themeRef
    }
  },
  render() {
    const { mergedTheme } = this
    const popoverProps: PopoverInternalProps & { ref: string } = {
      theme: mergedTheme.peers.Popover,
      themeOverrides: mergedTheme.peerOverrides.Popover,
      builtinThemeOverrides: {
        padding: '0'
      },
      ref: 'popoverInstRef',
      internalRenderBody: (
        className,
        ref,
        style,
        onMouseenter,
        onMouseleave
      ) => {
        const { $attrs } = this
        return (
          <NPopselectPanel
            {...$attrs}
            class={[$attrs.class, className]}
            style={[$attrs.style, ...style]}
            {...keep(this.$props, panelPropKeys)}
            ref={createRefSetter(ref)}
            onMouseenter={mergeEventHandlers([
              onMouseenter,
              $attrs.onMouseenter as ((e: MouseEvent) => void) | undefined
            ])}
            onMouseleave={mergeEventHandlers([
              onMouseleave,
              $attrs.onMouseleave as ((e: MouseEvent) => void) | undefined
            ])}
          >
            {{
              header: () => this.$slots.header?.(),
              action: () => this.$slots.action?.(),
              empty: () => this.$slots.empty?.()
            }}
          </NPopselectPanel>
        )
      }
    }
    return (
      <NPopover
        {...omit(this.$props, [...panelPropKeys, 'showValueInTitle'])}
        {...popoverProps}
        internalDeactivateImmediately
      >
        {{
          trigger: () => {
            const node = getFirstSlotVNode(this.$slots)
            return node
              ? cloneVNode(node, {
                  title: node.props?.title ?? this.selectionTitle
                })
              : null
          }
        }}
      </NPopover>
    )
  }
})
