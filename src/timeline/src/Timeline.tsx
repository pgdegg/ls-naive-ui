import type { ExtractPropTypes, PropType, Ref } from 'vue'
import type { MergedTheme, ThemeProps } from '../../_mixins'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { TimelineTheme, TimelineThemeOverrides } from '../styles'
import { defineComponent, h, provide } from 'vue'
import { useConfig, useTheme } from '../../_mixins'
import { createInjectionKey } from '../../_utils'
import { timelineLight } from '../styles'
import style from './styles/index.cssr'

export const TimelineDefaultValueProps = {
  ...(useTheme.props as ThemeProps<TimelineTheme, TimelineThemeOverrides>),
  horizontal: Boolean,
  itemPlacement: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  },
  size: {
    type: String as PropType<'medium' | 'large'>,
    default: 'medium'
  },
  iconSize: Number
} as const

export interface TimelineInjection {
  props: ExtractPropTypes<typeof TimelineDefaultValueProps>
  mergedThemeRef: Ref<MergedTheme<TimelineTheme>>
  mergedClsPrefixRef: Ref<string>
}
export const timelineInjectionKey
  = createInjectionKey<TimelineInjection>('n-timeline')

export type TimelineProps = ExtractPublicPropTypes<
  typeof TimelineDefaultValueProps
>

export default defineComponent({
  name: 'Timeline',
  props: TimelineDefaultValueProps,
  setup(props, { slots }) {
    const { mergedClsPrefixRef } = useConfig(props)
    const themeRef = useTheme(
      'Timeline',
      '-timeline',
      style,
      timelineLight,
      props,
      mergedClsPrefixRef
    )
    provide(timelineInjectionKey, {
      props,
      mergedThemeRef: themeRef,
      mergedClsPrefixRef
    })
    return () => {
      const { value: mergedClsPrefix } = mergedClsPrefixRef
      return (
        <div
          class={[
            `${mergedClsPrefix}-timeline`,
            props.horizontal && `${mergedClsPrefix}-timeline--horizontal`,
            `${mergedClsPrefix}-timeline--${props.size}-size`,
            !props.horizontal
            && `${mergedClsPrefix}-timeline--${props.itemPlacement}-placement`
          ]}
        >
          {slots.default?.()}
        </div>
      )
    }
  }
})
