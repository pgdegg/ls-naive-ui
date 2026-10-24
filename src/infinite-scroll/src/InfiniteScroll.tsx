import type { PropType } from 'vue'
import type { ScrollbarInst } from '../../_internal'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { ScrollbarProps } from '../../scrollbar/src/Scrollbar'
import { defineComponent, h, ref } from 'vue'
import { NxScrollbar } from '../../_internal'
import { resolveSlot } from '../../_utils'

export const infiniteScrollProps = {
  distance: {
    type: Number,
    default: 0
  },
  onLoad: Function as PropType<() => Promise<void> | void>,
  scrollbarProps: Object as PropType<ScrollbarProps>
} as const

export type InfiniteScrollProps = ExtractPublicPropTypes<
  typeof infiniteScrollProps
>

export default defineComponent({
  name: 'InfiniteScroll',
  props: infiniteScrollProps,
  setup(props) {
    const scrollbarInstRef = ref<ScrollbarInst | null>(null)

    let loading = false

    const handleCheckBottom = async (): Promise<void> => {
      const { value: scrollbarInst } = scrollbarInstRef
      if (scrollbarInst) {
        const { containerRef } = scrollbarInst
        const scrollHeight = containerRef?.scrollHeight
        const clientHeight = containerRef?.clientHeight
        const scrollTop = containerRef?.scrollTop

        if (
          containerRef
          && scrollHeight !== undefined
          && clientHeight !== undefined
          && scrollTop !== undefined
        ) {
          if (scrollTop + clientHeight >= scrollHeight - props.distance) {
            loading = true
            try {
              await props.onLoad?.()
            }
            catch {}
            loading = false
          }
        }
      }
    }

    const handleScroll = (): void => {
      if (loading)
        return
      void handleCheckBottom()
    }

    const handleWheel = (e: WheelEvent): void => {
      if (e.deltaY <= 0)
        return
      if (loading)
        return
      void handleCheckBottom()
    }

    return {
      // 减少 dts：仅字符串 ref，类型在 render 中未使用
      scrollbarInstRef: scrollbarInstRef as unknown,
      handleScroll,
      handleWheel
    }
  },
  render() {
    return (
      <NxScrollbar
        {...this.scrollbarProps}
        ref="scrollbarInstRef"
        onWheel={this.handleWheel}
        onScroll={this.handleScroll}
      >
        {{
          default: () => {
            return resolveSlot(this.$slots.default, () => [])
          }
        }}
      </NxScrollbar>
    )
  }
})
