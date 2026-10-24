import type { SlotsType } from 'vue'
import type { ThemeProps } from '../../_mixins'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { PopoverInst, PopoverSlots } from '../../popover'
import type { TooltipTheme, TooltipThemeOverrides } from '../styles'
// Tooltip：穿着马甲的 popover
import { computed, defineComponent, h, ref } from 'vue'
import { useConfig, useTheme } from '../../_mixins'
import { NPopover } from '../../popover'
import { popoverBaseProps } from '../../popover/src/Popover'
import { tooltipLight } from '../styles'

export type TooltipInst = PopoverInst

export const tooltipProps = {
  ...popoverBaseProps,
  ...(useTheme.props as ThemeProps<TooltipTheme, TooltipThemeOverrides>)
}

export type TooltipProps = ExtractPublicPropTypes<typeof tooltipProps>

export interface TooltipSlots extends PopoverSlots {}

export default defineComponent({
  name: 'Tooltip',
  props: tooltipProps,
  slots: Object as SlotsType<TooltipSlots>,
  __popover__: true,
  setup(props) {
    const { mergedClsPrefixRef } = useConfig(props)
    const themeRef = useTheme(
      'Tooltip',
      '-tooltip',
      undefined,
      tooltipLight,
      props,
      mergedClsPrefixRef
    )
    const popoverRef = ref<PopoverInst | null>(null)
    const tooltipExposedMethod: TooltipInst = {
      syncPosition() {
        popoverRef.value!.syncPosition()
      },
      setShow(show: boolean) {
        popoverRef.value!.setShow(show)
      }
    }
    return {
      ...tooltipExposedMethod,
      // 精简 dts：仅保留字符串 ref，类型在 render 中未被使用
      popoverRef: popoverRef as unknown,
      mergedTheme: themeRef,
      popoverThemeOverrides: computed(() => {
        return themeRef.value.self
      })
    }
  },
  render() {
    const { mergedTheme, internalExtraClass } = this
    return h(
      NPopover,
      {
        ...this.$props,
        theme: mergedTheme.peers.Popover,
        themeOverrides: mergedTheme.peerOverrides.Popover,
        builtinThemeOverrides: this.popoverThemeOverrides,
        internalExtraClass: internalExtraClass.concat('tooltip'),
        ref: 'popoverRef'
      },
      this.$slots
    )
  }
})
