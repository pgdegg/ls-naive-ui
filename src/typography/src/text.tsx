import type { CSSProperties, PropType, Ref, SlotsType, VNode } from 'vue'
import type { ThemeProps } from '../../_mixins'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { TypographyTheme, TypographyThemeOverrides } from '../styles'
import { useCompitable } from 'vooks'
import { computed, defineComponent, h, onUpdated, ref, watch } from 'vue'
import { useConfig, useTheme, useThemeClass } from '../../_mixins'
import { createKey, warn } from '../../_utils'
import { typographyLight } from '../styles'
import style from './styles/text.cssr'

export const textProps = {
  ...(useTheme.props as ThemeProps<TypographyTheme, TypographyThemeOverrides>),
  code: Boolean,
  size: String as PropType<'small' | 'medium' | 'large'>,
  truncated: Boolean,
  lineClamp: [String, Number] as PropType<string | number>,
  type: {
    type: String,
    default: 'default'
  },
  delete: Boolean,
  strong: Boolean,
  italic: Boolean,
  underline: Boolean,
  depth: [String, Number] as PropType<1 | 2 | 3 | '1' | '2' | '3'>,
  tag: String,
  // 已废弃
  as: {
    type: String,
    validator: () => {
      if (__DEV__) {
        warn('text', '`as` is deprecated, please use `tag` instead.')
      }
      return true
    },
    default: undefined
  }
} as const

export type TextProps = ExtractPublicPropTypes<typeof textProps>

export interface TextInst {
  readonly isTruncated: boolean
}

export interface TextSlots {
  default?: () => VNode[]
}

export default defineComponent({
  name: 'Text',
  props: textProps,
  slots: Object as SlotsType<TextSlots>,
  setup(props, { expose }) {
    const textRef = ref<HTMLElement | null>(null)
    const isTruncated = ref(false)
    const mergedLineClamp = computed(() => {
      const lines = Number(props.lineClamp)
      return Number.isInteger(lines) && lines > 0 ? lines : undefined
    })
    function measure(): void {
      const element = textRef.value
      isTruncated.value = Boolean(
        element
        && (mergedLineClamp.value
          ? element.scrollHeight > element.clientHeight
          : props.truncated && element.scrollWidth > element.clientWidth)
      )
    }
    watch(
      [textRef, () => props.truncated, mergedLineClamp],
      ([element, truncated, lines], _, onCleanup) => {
        if (!element || (!truncated && !lines)) {
          isTruncated.value = false
          return
        }
        const resize
          = typeof ResizeObserver === 'undefined'
            ? undefined
            : new ResizeObserver(measure)
        const mutation
          = typeof MutationObserver === 'undefined'
            ? undefined
            : new MutationObserver(measure)
        resize?.observe(element)
        mutation?.observe(element, {
          childList: true,
          subtree: true,
          characterData: true
        })
        window.addEventListener('resize', measure)
        document.fonts?.addEventListener('loadingdone', measure)
        measure()
        onCleanup(() => {
          resize?.disconnect()
          mutation?.disconnect()
          window.removeEventListener('resize', measure)
          document.fonts?.removeEventListener('loadingdone', measure)
        })
      },
      { immediate: true, flush: 'post' }
    )
    onUpdated(measure)
    expose({
      get isTruncated() {
        return isTruncated.value
      }
    } satisfies TextInst)
    const { mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props)
    const themeRef = useTheme(
      'Typography',
      '-text',
      style,
      typographyLight,
      props,
      mergedClsPrefixRef
    )
    const cssVarsRef = computed(() => {
      const { depth, type } = props
      const textColorKey
        = type === 'default'
          ? depth === undefined
            ? 'textColor'
            : `textColor${depth}Depth`
          : createKey('textColor', type)
      const {
        common: { fontWeightStrong, fontFamilyMono, cubicBezierEaseInOut },
        self: {
          codeTextColor,
          codeBorderRadius,
          codeColor,
          codeBorder,
          [textColorKey as 'textColor']: textColor
        }
      } = themeRef.value
      const cssVars: Record<string, string> = {
        '--n-bezier': cubicBezierEaseInOut,
        '--n-text-color': textColor,
        '--n-font-weight-strong': fontWeightStrong,
        '--n-font-famliy-mono': fontFamilyMono,
        '--n-code-border-radius': codeBorderRadius,
        '--n-code-text-color': codeTextColor,
        '--n-code-color': codeColor,
        '--n-code-border': codeBorder
      }
      if (props.size) {
        cssVars['--n-text-font-size']
          = themeRef.value.self[createKey('textFontSize', props.size)]
      }
      return cssVars
    })
    const themeClassHandle = inlineThemeDisabled
      ? useThemeClass(
          'text',
          computed(
            () => `${props.type[0]}${props.depth || ''}${props.size || ''}`
          ),
          cssVarsRef,
          props
        )
      : undefined
    return {
      textRef,
      mergedLineClamp,
      isTruncated: computed(() => isTruncated.value),
      mergedClsPrefix: mergedClsPrefixRef,
      compitableTag: useCompitable(props, ['as', 'tag']),
      cssVars: inlineThemeDisabled
        ? undefined
        : (cssVarsRef as Ref<CSSProperties>),
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    }
  },
  render() {
    const { mergedClsPrefix } = this
    this.onRender?.()
    const textClass = [
      `${mergedClsPrefix}-text`,
      this.themeClass,
      {
        [`${mergedClsPrefix}-text--code`]: this.code,
        [`${mergedClsPrefix}-text--delete`]: this.delete,
        [`${mergedClsPrefix}-text--strong`]: this.strong,
        [`${mergedClsPrefix}-text--italic`]: this.italic,
        [`${mergedClsPrefix}-text--underline`]: this.underline,
        [`${mergedClsPrefix}-text--sized`]: !!this.size,
        [`${mergedClsPrefix}-text--truncated`]:
          this.truncated && !this.mergedLineClamp,
        [`${mergedClsPrefix}-text--clamped`]: !!this.mergedLineClamp
      }
    ]
    const children = this.$slots.default?.()
    return this.code ? (
      <code
        ref="textRef"
        class={textClass}
        style={[
          this.cssVars as CSSProperties,
          { '-webkit-line-clamp': this.mergedLineClamp }
        ]}
      >
        {this.delete ? <del>{children}</del> : children}
      </code>
    ) : this.delete ? (
      <del
        ref="textRef"
        class={textClass}
        style={[
          this.cssVars as CSSProperties,
          { '-webkit-line-clamp': this.mergedLineClamp }
        ]}
      >
        {children}
      </del>
    ) : (
      h(
        this.compitableTag || 'span',
        {
          ref: 'textRef',
          class: textClass,
          style: [this.cssVars, { '-webkit-line-clamp': this.mergedLineClamp }]
        },
        children
      )
    )
  }
})
