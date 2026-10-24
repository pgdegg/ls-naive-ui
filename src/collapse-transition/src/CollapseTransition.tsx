import type { CSSProperties, PropType, Ref } from 'vue'
import type { ThemeProps } from '../../_mixins'
import type { ExtractPublicPropTypes } from '../../_utils'
import type {
  CollapseTransitionTheme,
  CollapseTransitionThemeOverrides
} from '../styles'
import { useFalseUntilTruthy } from 'vooks'
import {
  computed,
  defineComponent,
  h,
  mergeProps,
  vShow,
  watchEffect,
  withDirectives
} from 'vue'
import { NFadeInExpandTransition } from '../../_internal'
import { useConfig, useTheme, useThemeClass } from '../../_mixins'
import { useRtl } from '../../_mixins/use-rtl'
import { warnOnce } from '../../_utils'
import { collapseTransitionLight } from '../styles'
import style from './styles/index.cssr'

export const collapseTransitionProps = {
  ...(useTheme.props as ThemeProps<
    CollapseTransitionTheme,
    CollapseTransitionThemeOverrides
  >),
  show: {
    type: Boolean,
    default: true
  },
  appear: Boolean,
  displayDirective: {
    type: String as PropType<'if' | 'show'>,
    default: 'if'
  },
  // collapsed 的实现有错误，collapsed=true 反而会让它显示
  // 但现在不可能修改了，所以我将它废弃，改为使用
  // `show` prop。
  /** @deprecated */
  collapsed: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  }
} as const

export type CollapseTransitionProps = ExtractPublicPropTypes<
  typeof collapseTransitionProps
>

export default defineComponent({
  name: 'CollapseTransition',
  props: collapseTransitionProps,
  inheritAttrs: false,
  setup(props) {
    if (__DEV__) {
      watchEffect(() => {
        if (props.collapsed !== undefined) {
          warnOnce(
            'collapse-transition',
            '`collapsed` is deprecated, please use `show` instead'
          )
        }
      })
    }
    const { mergedClsPrefixRef, inlineThemeDisabled, mergedRtlRef }
      = useConfig(props)
    const mergedThemeRef = useTheme(
      'CollapseTransition',
      '-collapse-transition',
      style,
      collapseTransitionLight,
      props,
      mergedClsPrefixRef
    )
    const rtlEnabledRef = useRtl(
      'CollapseTransition',
      mergedRtlRef,
      mergedClsPrefixRef
    )
    const mergedShowRef = computed(() => {
      if (props.collapsed !== undefined) {
        // 没写错，它一开始就是以错误的方式实现的，先保留在这里
        return props.collapsed
      }
      return props.show
    })
    const onceTrueRef = useFalseUntilTruthy(mergedShowRef)

    const cssVarsRef = computed(() => {
      const {
        self: { bezier }
      } = mergedThemeRef.value
      return {
        '--n-bezier': bezier
      }
    })
    const themeClassHandle = inlineThemeDisabled
      ? useThemeClass('collapse-transition', undefined, cssVarsRef, props)
      : undefined

    return {
      rtlEnabled: rtlEnabledRef,
      mergedShow: mergedShowRef,
      onceTrue: onceTrueRef,
      mergedClsPrefix: mergedClsPrefixRef,
      cssVars: inlineThemeDisabled
        ? undefined
        : (cssVarsRef as Ref<CSSProperties>),
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    }
  },
  render() {
    return (
      <NFadeInExpandTransition appear={this.appear}>
        {{
          default: () => {
            const { mergedShow, displayDirective, onceTrue } = this
            const useVShow = displayDirective === 'show' && onceTrue
            if (!useVShow && !mergedShow)
              return
            this.onRender?.()
            const contentNode = h(
              'div', // 不要使用 JSX，因为它会在每次渲染时产生无用的 spread
              mergeProps(
                {
                  class: [
                    `${this.mergedClsPrefix}-collapse-transition`,
                    this.rtlEnabled
                    && `${this.mergedClsPrefix}-collapse-transition--rtl`,
                    this.themeClass
                  ],
                  style: this.cssVars
                },
                this.$attrs
              ),
              this.$slots
            )
            return useVShow
              ? withDirectives(contentNode, [[vShow, mergedShow]])
              : contentNode
          }
        }}
      </NFadeInExpandTransition>
    )
  }
})
