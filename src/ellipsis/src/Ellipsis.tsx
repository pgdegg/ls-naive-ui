import type { PropType, SlotsType, VNode } from 'vue'
import type { ThemeProps } from '../../_mixins'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { PopoverProps } from '../../popover/src/Popover'
import type { TooltipInst } from '../../tooltip/src/Tooltip'
import type { EllipsisTheme, EllipsisThemeOverrides } from '../styles'
import {
  computed,
  defineComponent,
  h,
  mergeProps,
  onDeactivated,
  ref
} from 'vue'
import { useTheme } from '../../_mixins'
import { useMergedClsPrefix } from '../../_mixins/use-config'
import { NTooltip } from '../../tooltip'
import { ellipsisLight } from '../styles'
import style from './styles/index.cssr'

export function createLineClampClass(clsPrefix: string): string {
  return `${clsPrefix}-ellipsis--line-clamp`
}

export function createCursorClass(clsPrefix: string, cursor: string): string {
  return `${clsPrefix}-ellipsis--cursor-${cursor}`
}

export const ellipsisProps = {
  ...(useTheme.props as ThemeProps<EllipsisTheme, EllipsisThemeOverrides>),
  expandTrigger: String as PropType<'click'>,
  lineClamp: [Number, String] as PropType<string | number>,
  tooltip: {
    type: [Boolean, Object] as PropType<PopoverProps | boolean>,
    default: true
  }
} as const

export type EllipsisProps = ExtractPublicPropTypes<typeof ellipsisProps>

export interface EllipsisSlots {
  default?: () => VNode[]
  tooltip?: () => VNode[]
}

export default defineComponent({
  name: 'Ellipsis',
  inheritAttrs: false,
  props: ellipsisProps,
  slots: Object as SlotsType<EllipsisSlots>,
  setup(props, { slots, attrs }) {
    const mergedClsPrefixRef = useMergedClsPrefix()
    const mergedTheme = useTheme(
      'Ellipsis',
      '-ellipsis',
      style,
      ellipsisLight,
      props,
      mergedClsPrefixRef
    )
    const triggerRef = ref<HTMLElement | null>(null)
    const triggerInnerRef = ref<HTMLElement | null>(null)
    const tooltipRef = ref<TooltipInst | null>(null)
    const expandedRef = ref(false)
    const ellipsisStyleRef = computed(() => {
      const { lineClamp } = props
      const { value: expanded } = expandedRef
      if (lineClamp !== undefined) {
        return {
          textOverflow: '',
          '-webkit-line-clamp': expanded ? '' : lineClamp
        }
      }
      else {
        return {
          textOverflow: expanded ? '' : 'ellipsis',
          '-webkit-line-clamp': ''
        }
      }
    })
    function getTooltipDisabled(): boolean {
      let tooltipDisabled = false
      const { value: expanded } = expandedRef
      if (expanded)
        return true
      const { value: trigger } = triggerRef
      if (trigger) {
        const { lineClamp } = props
        // 需要在这里应用样式，因为 dom 可能在 nextTick 中才被更新，
        // 此时测量 dom 尺寸会得到错误的结果
        syncEllipsisStyle(trigger)
        if (lineClamp !== undefined) {
          tooltipDisabled = trigger.scrollHeight <= trigger.offsetHeight
        }
        else {
          const { value: triggerInner } = triggerInnerRef
          if (triggerInner) {
            tooltipDisabled
              = triggerInner.getBoundingClientRect().width
                <= trigger.getBoundingClientRect().width
          }
        }
        syncCursorStyle(trigger, tooltipDisabled)
      }
      return tooltipDisabled
    }
    // HACK：等 vue-jsx-vapor 能正确处理后再恢复它
    function handleClick(): void {
      if (props.expandTrigger !== 'click')
        return
      const { value: expanded } = expandedRef
      if (expanded) {
        tooltipRef.value?.setShow(false)
      }
      expandedRef.value = !expanded
    }
    onDeactivated(() => {
      if (props.tooltip) {
        tooltipRef.value?.setShow(false)
      }
    })
    const renderTrigger = (): JSX.Element => (
      <span
        {...mergeProps(attrs, {
          class: [
            `${mergedClsPrefixRef.value}-ellipsis`,
            props.lineClamp !== undefined
              ? createLineClampClass(mergedClsPrefixRef.value)
              : undefined,
            props.expandTrigger === 'click'
              ? createCursorClass(mergedClsPrefixRef.value, 'pointer')
              : undefined
          ],
          style: ellipsisStyleRef.value
        })}
        ref="triggerRef"
        onClick={handleClick}
        onMouseenter={
          // 获取 tooltip 是否禁用会推导出 cursor 样式
          props.expandTrigger === 'click' ? getTooltipDisabled : undefined
        }
      >
        {props.lineClamp ? (
          slots.default?.()
        ) : (
          <span ref="triggerInnerRef">{slots.default?.()}</span>
        )}
      </span>
    )
    function syncEllipsisStyle(trigger: HTMLElement): void {
      if (!trigger)
        return
      const latestStyle = ellipsisStyleRef.value
      const lineClampClass = createLineClampClass(mergedClsPrefixRef.value)
      if (props.lineClamp !== undefined) {
        syncTriggerClass(trigger, lineClampClass, 'add')
      }
      else {
        syncTriggerClass(trigger, lineClampClass, 'remove')
      }
      for (const key in latestStyle) {
        // 守卫判断可以让它稍快一些
        if ((trigger.style as any)[key] !== (latestStyle as any)[key]) {
          ;(trigger.style as any)[key] = (latestStyle as any)[key]
        }
      }
    }
    function syncCursorStyle(
      trigger: HTMLElement,
      tooltipDisabled: boolean
    ): void {
      const cursorClass = createCursorClass(mergedClsPrefixRef.value, 'pointer')
      if (props.expandTrigger === 'click' && !tooltipDisabled) {
        syncTriggerClass(trigger, cursorClass, 'add')
      }
      else {
        syncTriggerClass(trigger, cursorClass, 'remove')
      }
    }
    function syncTriggerClass(
      trigger: HTMLElement,
      styleClass: string,
      action: 'add' | 'remove'
    ): void {
      if (action === 'add') {
        if (!trigger.classList.contains(styleClass)) {
          trigger.classList.add(styleClass)
        }
      }
      else {
        if (trigger.classList.contains(styleClass)) {
          trigger.classList.remove(styleClass)
        }
      }
    }
    return {
      mergedTheme,
      triggerRef,
      triggerInnerRef,
      // 精简 dts：仅保留字符串 ref，类型在 render 中未使用
      tooltipRef: tooltipRef as unknown,
      renderTrigger,
      getTooltipDisabled
    }
  },
  render() {
    const { tooltip, renderTrigger, $slots } = this
    if (tooltip) {
      const { mergedTheme } = this
      return (
        <NTooltip
          ref="tooltipRef"
          placement="top"
          {...(tooltip as PopoverProps)}
          getDisabled={this.getTooltipDisabled}
          theme={mergedTheme.peers.Tooltip}
          themeOverrides={mergedTheme.peerOverrides.Tooltip}
        >
          {{
            trigger: renderTrigger,
            default: $slots.tooltip ?? $slots.default
          }}
        </NTooltip>
      )
    }
    else {
      return renderTrigger()
    }
  }
})
