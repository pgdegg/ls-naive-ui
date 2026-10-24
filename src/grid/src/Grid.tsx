import type { CSSProperties, PropType, Ref, VNode } from 'vue'
import type { VResizeObserverOnResize } from 'vueuc'
import type { ExtractPublicPropTypes } from '../../_utils'
import { beforeNextFrameOnce, parseResponsivePropValue, pxfy } from 'seemly'
import { useBreakpoints, useMemo } from 'vooks'
import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  mergeProps,
  onMounted,
  provide,
  ref,
  toRef,
  vShow
} from 'vue'
import { VResizeObserver } from 'vueuc'
import { useConfig } from '../../_mixins'
import { flatten, getSlot, isBrowser, isNodeVShowFalse } from '../../_utils'
import { defaultBreakpoints } from '../../config-provider/src/config'
import { defaultSpan, gridInjectionKey } from './config'

const defaultCols = 24

const SSR_ATTR_NAME = '__ssr__'

export const gridProps = {
  layoutShiftDisabled: Boolean,
  responsive: {
    type: [String, Boolean] as PropType<'self' | 'screen'>,
    default: 'self'
  },
  cols: {
    type: [Number, String] as PropType<number | string>,
    default: defaultCols
  },
  itemResponsive: Boolean,
  collapsed: Boolean,
  // 可能会创建比 collapsedRows 更多的 grid 行，因为某个 item 可能占满整行
  collapsedRows: {
    type: Number,
    default: 1
  },
  itemStyle: [Object, String] as PropType<CSSProperties | string>,
  xGap: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  yGap: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  }
} as const

export interface NGridInjection {
  isSsrRef: Ref<boolean>
  itemStyleRef: Ref<CSSProperties | string | undefined>
  xGapRef: Ref<string | undefined>
  overflowRef: Ref<boolean>
  layoutShiftDisabledRef: Ref<boolean>
}

export type GridProps = ExtractPublicPropTypes<typeof gridProps>

export default defineComponent({
  name: 'Grid',
  inheritAttrs: false,
  props: gridProps,
  setup(props) {
    const { mergedClsPrefixRef, mergedBreakpointsRef } = useConfig(props)
    const numRegex = /^\d+$/
    const widthRef = ref<number | undefined>(undefined)
    const breakpointsRef = useBreakpoints(
      mergedBreakpointsRef?.value || defaultBreakpoints
    )
    const isResponsiveRef = useMemo(() => {
      if (props.itemResponsive)
        return true
      if (!numRegex.test(props.cols.toString()))
        return true
      if (!numRegex.test(props.xGap.toString()))
        return true
      if (!numRegex.test(props.yGap.toString()))
        return true
      return false
    })
    const responsiveQueryRef = computed(() => {
      if (!isResponsiveRef.value)
        return undefined
      return props.responsive === 'self' ? widthRef.value : breakpointsRef.value
    })
    const responsiveColsRef = useMemo(() => {
      return (
        Number(
          parseResponsivePropValue(
            props.cols.toString(),
            responsiveQueryRef.value
          )
        ) ?? defaultCols
      )
    })
    const responsiveXGapRef = useMemo(() =>
      parseResponsivePropValue(props.xGap.toString(), responsiveQueryRef.value)
    )
    const responsiveYGapRef = useMemo(() =>
      parseResponsivePropValue(props.yGap.toString(), responsiveQueryRef.value)
    )
    const handleResize: VResizeObserverOnResize = (entry) => {
      widthRef.value = entry.contentRect.width
    }
    const handleResizeRaf: VResizeObserverOnResize = (entry) => {
      beforeNextFrameOnce(handleResize, entry)
    }
    const overflowRef = ref(false)
    const handleResizeRef = computed<VResizeObserverOnResize | undefined>(
      () => {
        if (props.responsive === 'self') {
          return handleResizeRaf
        }
        return undefined
      }
    )

    // 为 SSR 修复 bug https://github.com/tusen-ai/naive-ui/issues/2462
    const isSsrRef = ref(false)
    const contentElRef = ref<HTMLElement>()
    onMounted(() => {
      const { value: contentEl } = contentElRef
      if (contentEl) {
        if (contentEl.hasAttribute(SSR_ATTR_NAME)) {
          contentEl.removeAttribute(SSR_ATTR_NAME)
          isSsrRef.value = true
        }
      }
    })

    provide(gridInjectionKey, {
      layoutShiftDisabledRef: toRef(props, 'layoutShiftDisabled'),
      isSsrRef,
      itemStyleRef: toRef(props, 'itemStyle'),
      xGapRef: responsiveXGapRef,
      overflowRef
    })

    return {
      isSsr: !isBrowser,
      contentEl: contentElRef,
      mergedClsPrefix: mergedClsPrefixRef,
      style: computed<CSSProperties>(() => {
        if (props.layoutShiftDisabled) {
          return {
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))`,
            columnGap: pxfy(props.xGap),
            rowGap: pxfy(props.yGap)
          }
        }
        return {
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${responsiveColsRef.value}, minmax(0, 1fr))`,
          columnGap: pxfy(responsiveXGapRef.value),
          rowGap: pxfy(responsiveYGapRef.value)
        }
      }),
      isResponsive: isResponsiveRef,
      responsiveQuery: responsiveQueryRef,
      responsiveCols: responsiveColsRef,
      handleResize: handleResizeRef,
      overflow: overflowRef
    }
  },
  render() {
    if (this.layoutShiftDisabled) {
      return h(
        'div',
        mergeProps(
          {
            ref: 'contentEl',
            class: `${this.mergedClsPrefix}-grid`,
            style: this.style
          },
          this.$attrs
        ),
        this.$slots
      )
    }

    const renderContent = (): VNode => {
      this.overflow = false

      // 挂载时 render 会被调用两次，我不清楚原因
      // 两个具有相同 id 的 job 会被推入任务队列，然后被一起刷新
      const rawChildren = flatten(getSlot(this))

      const childrenAndRawSpan: Array<{
        child: VNode
        rawChildSpan: number
      }> = []

      const { collapsed, collapsedRows, responsiveCols, responsiveQuery } = this

      rawChildren.forEach((child) => {
        if ((child?.type as any)?.__GRID_ITEM__ !== true)
          return

        if (isNodeVShowFalse(child)) {
          const clonedNode = cloneVNode(child)
          if (clonedNode.props) {
            clonedNode.props.privateShow = false
          }
          else {
            clonedNode.props = { privateShow: false }
          }
          childrenAndRawSpan.push({
            child: clonedNode,
            rawChildSpan: 0
          })
          return
        }

        // 我们不希望 v-show 来控制 display，所以需要在这里将其移除，
        // 否则它可能会扰乱子节点的样式
        child.dirs = child.dirs?.filter(({ dir }) => dir !== vShow) || null

        if (child.dirs?.length === 0) {
          child.dirs = null
        }
        const clonedChild = cloneVNode(child)

        const rawChildSpan = Number(
          parseResponsivePropValue(
            clonedChild.props?.span as string | number | undefined,
            responsiveQuery
          ) ?? defaultSpan
        )

        if (rawChildSpan === 0)
          return
        childrenAndRawSpan.push({
          child: clonedChild,
          rawChildSpan
        })
      })

      let suffixSpan = 0
      const maybeSuffixNode
        = childrenAndRawSpan[childrenAndRawSpan.length - 1]?.child
      if (maybeSuffixNode?.props) {
        const suffixPropValue = maybeSuffixNode.props?.suffix
        if (suffixPropValue !== undefined && suffixPropValue !== false) {
          suffixSpan = Number(
            parseResponsivePropValue(
              maybeSuffixNode.props?.span as string | number | null | undefined,
              responsiveQuery
            ) ?? defaultSpan
          )
          maybeSuffixNode.props.privateSpan = suffixSpan
          maybeSuffixNode.props.privateColStart
            = responsiveCols + 1 - suffixSpan
          maybeSuffixNode.props.privateShow
            = maybeSuffixNode.props.privateShow ?? true
        }
      }

      let spanCounter = 0
      let done = false
      for (const { child, rawChildSpan } of childrenAndRawSpan) {
        if (done) {
          this.overflow = true
        }

        if (!done) {
          const childOffset = Number(
            parseResponsivePropValue(
              child.props?.offset as string | number | undefined,
              responsiveQuery
            ) ?? 0
          )
          // 它有时可能为 0（v-show = false）
          const childSpan = Math.min(rawChildSpan + childOffset, responsiveCols)
          if (!child.props) {
            child.props = {
              privateSpan: childSpan,
              privateOffset: childOffset
            }
          }
          else {
            child.props.privateSpan = childSpan
            child.props.privateOffset = childOffset
          }
          if (collapsed) {
            const remainder = spanCounter % responsiveCols
            if (childSpan + remainder > responsiveCols) {
              spanCounter += responsiveCols - remainder
            }
            if (
              childSpan + spanCounter + suffixSpan
              > collapsedRows * responsiveCols
            ) {
              done = true
            }
            else {
              spanCounter += childSpan
            }
          }
        }
        if (done) {
          if (child.props) {
            // suffix 节点的 privateShow 可能为 true
            if (child.props.privateShow !== true) {
              child.props.privateShow = false
            }
          }
          else {
            child.props = {
              privateShow: false
            }
          }
        }
      }
      return h(
        'div',
        mergeProps(
          {
            ref: 'contentEl',
            class: `${this.mergedClsPrefix}-grid`,
            style: this.style,
            [SSR_ATTR_NAME]: this.isSsr || undefined
          },
          this.$attrs
        ),
        childrenAndRawSpan.map(({ child }) => child)
      )
    }
    return this.isResponsive && this.responsive === 'self' ? (
      <VResizeObserver onResize={this.handleResize}>
        {{
          default: renderContent
        }}
      </VResizeObserver>
    ) : (
      renderContent()
    )
  }
})
