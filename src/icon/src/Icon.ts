import type { Component, CSSProperties, PropType, Ref } from 'vue'
import type { ThemeProps } from '../../_mixins'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { IconTheme, IconThemeOverrides } from '../styles'
import type { SpriteIconProps } from './use-sprite-icon'
import { computed, defineComponent, h, mergeProps, ref } from 'vue'
import { useConfig, useTheme, useThemeClass } from '../../_mixins'
import { formatLength, warn } from '../../_utils'
import { iconLight } from '../styles'
import style from './styles/index.cssr'
import { useSpriteIcon } from './use-sprite-icon'

export type Depth = 1 | 2 | 3 | 4 | 5 | '1' | '2' | '3' | '4' | '5' | undefined

export const iconProps = {
  symbol: String,
  prefix: [String, Array] as PropType<string | string[]>,
  symbolVersion: [String, Number] as PropType<string | number>,
  symbolResolver: Function as PropType<SpriteIconProps['symbolResolver']>,
  ...(useTheme.props as ThemeProps<IconTheme, IconThemeOverrides>),
  depth: [String, Number] as PropType<Depth>,
  size: [Number, String] as PropType<number | string>,
  color: String,
  component: [Object, Function] as PropType<Component>
} as const

export type IconProps = ExtractPublicPropTypes<typeof iconProps>

export const NIcon = defineComponent({
  _n_icon__: true,
  name: 'Icon',
  inheritAttrs: false,
  props: iconProps,
  setup(props) {
    const elementRef = ref<HTMLElement | null>(null)
    const sprite = useSpriteIcon(props, elementRef)
    const { mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props)
    const themeRef = useTheme(
      'Icon',
      '-icon',
      style,
      iconLight,
      props,
      mergedClsPrefixRef
    )
    const cssVarsRef = computed(() => {
      const { depth } = props
      const {
        common: { cubicBezierEaseInOut },
        self
      } = themeRef.value
      if (depth !== undefined) {
        const { color, [`opacity${depth}Depth` as const]: opacity } = self
        return {
          '--n-bezier': cubicBezierEaseInOut,
          '--n-color': color,
          '--n-opacity': opacity
        }
      }
      return {
        '--n-bezier': cubicBezierEaseInOut,
        '--n-color': '',
        '--n-opacity': ''
      }
    })
    const themeClassHandle = inlineThemeDisabled
      ? useThemeClass(
          'icon',
          computed(() => `${props.depth || 'd'}`),
          cssVarsRef,
          props
        )
      : undefined
    return {
      elementRef,
      ...sprite,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedStyle: computed(() => {
        const { size, color } = props
        return {
          fontSize: formatLength(size),
          color
        }
      }),
      cssVars: inlineThemeDisabled
        ? undefined
        : (cssVarsRef as Ref<CSSProperties>),
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    }
  },
  render() {
    const { $parent, depth, mergedClsPrefix, component, onRender, themeClass }
      = this
    if ($parent?.$options?._n_icon__) {
      warn('icon', 'don\'t wrap `n-icon` inside `n-icon`')
    }
    onRender?.()
    return h(
      'i',
      mergeProps(this.$attrs, {
        ref: 'elementRef',
        title: this.symbolElement?.getAttribute('name') ?? this.$attrs.title,
        role: 'img',
        class: [
          `${mergedClsPrefix}-icon`,
          themeClass,
          {
            [`${mergedClsPrefix}-icon--depth`]: depth,
            [`${mergedClsPrefix}-icon--color-transition`]: depth !== undefined
          }
        ],
        style: [this.cssVars, this.mergedStyle]
      }),
      this.symbol
        ? this.showPlaceholder
          ? component
            ? h(component)
            : (this.$slots.default?.()
              ?? h(
                'svg',
                {
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 1.5,
                  'aria-hidden': 'true',
                  class: `${mergedClsPrefix}-icon__placeholder`
                },
                [
                  h('rect', { x: 3.5, y: 3.5, width: 17, height: 17, rx: 3 }),
                  h('circle', { cx: 8.5, cy: 8.5, r: 1.5 }),
                  h('path', { d: 'm4 17 4.5-4.5 3 3 3.5-5 5 6.5' })
                ]
              ))
          : h('svg', { 'aria-hidden': 'true' }, [
              h('use', { href: `#${this.symbolElement?.id}` })
            ])
        : component
          ? h(component)
          : this.$slots.default?.()
    )
  }
})
