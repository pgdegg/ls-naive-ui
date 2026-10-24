import type {
  CSSProperties,
  DirectiveArguments,
  PropType,
  VNode,
  VNodeChild
} from 'vue'
import type { FollowerInst, FollowerPlacement } from 'vueuc'
import type { ThemeProps } from '../../_mixins'
import type { PopoverTheme, PopoverThemeOverrides } from '../styles'
import type { PopoverTrigger } from './interface'
import type { PopoverInjection } from './Popover'
import { getPreciseEventTarget } from 'seemly'
import { clickoutside, mousemoveoutside } from 'vdirs'
import {
  computed,
  defineComponent,
  Fragment,
  h,
  inject,
  mergeProps,
  onBeforeUnmount,
  provide,
  ref,
  toRef,
  Transition,
  vShow,
  watch,
  watchEffect,
  withDirectives
} from 'vue'
import { VFocusTrap, VFollower } from 'vueuc'
import { NxScrollbar } from '../../_internal/scrollbar'
import { useConfig, useRtl, useTheme, useThemeClass } from '../../_mixins'
import {
  formatLength,
  isJsdom,
  isSlotEmpty,
  resolveWrappedSlot,
  useAdjustedTo
} from '../../_utils'
import { drawerBodyInjectionKey } from '../../drawer/src/interface'
import { modalBodyInjectionKey } from '../../modal/src/interface'
import { popoverLight } from '../styles'
import { popoverBodyInjectionKey } from './interface'
import style from './styles/index.cssr'

export const popoverBodyProps = {
  ...(useTheme.props as ThemeProps<PopoverTheme, PopoverThemeOverrides>),
  to: useAdjustedTo.propTo,
  show: Boolean,
  trigger: String as PropType<PopoverTrigger>,
  showArrow: Boolean,
  delay: Number,
  duration: Number,
  raw: Boolean,
  arrowPointToCenter: Boolean,
  arrowClass: String,
  arrowStyle: [String, Object] as PropType<string | CSSProperties>,
  arrowWrapperClass: String,
  arrowWrapperStyle: [String, Object] as PropType<string | CSSProperties>,
  displayDirective: String as PropType<'if' | 'show'>,
  x: Number,
  y: Number,
  flip: Boolean,
  overlap: Boolean,
  placement: String as PropType<FollowerPlacement>,
  width: [Number, String] as PropType<number | 'trigger'>,
  keepAliveOnHover: Boolean,
  scrollable: Boolean,
  contentClass: String,
  contentStyle: [Object, String] as PropType<CSSProperties | string>,
  headerClass: String,
  headerStyle: [Object, String] as PropType<CSSProperties | string>,
  footerClass: String,
  footerStyle: [Object, String] as PropType<CSSProperties | string>,
  // 私有
  internalDeactivateImmediately: Boolean,
  animated: Boolean,
  onClickoutside: Function as PropType<(e: MouseEvent) => void>,
  internalTrapFocus: Boolean,
  internalOnAfterLeave: Function as PropType<() => void>,
  // 已废弃
  minWidth: Number,
  maxWidth: Number
}

interface RenderArrowProps {
  arrowClass: string | undefined
  arrowStyle: string | CSSProperties | undefined
  arrowWrapperClass: string | undefined
  arrowWrapperStyle: string | CSSProperties | undefined
  clsPrefix: string
}

export function renderArrow({
  arrowClass,
  arrowStyle,
  arrowWrapperClass,
  arrowWrapperStyle,
  clsPrefix
}: RenderArrowProps): VNode | null {
  return (
    <div
      key="__popover-arrow__"
      style={arrowWrapperStyle}
      class={[`${clsPrefix}-popover-arrow-wrapper`, arrowWrapperClass]}
    >
      <div
        class={[`${clsPrefix}-popover-arrow`, arrowClass]}
        style={arrowStyle}
      />
    </div>
  )
}

export default defineComponent({
  name: 'PopoverBody',
  inheritAttrs: false,
  props: popoverBodyProps,
  setup(props, { slots, attrs }) {
    const {
      namespaceRef,
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef
    } = useConfig(props)
    const themeRef = useTheme(
      'Popover',
      '-popover',
      style,
      popoverLight,
      props,
      mergedClsPrefixRef
    )

    const rtlEnabledRef = useRtl('Popover', mergedRtlRef, mergedClsPrefixRef)

    const followerRef = ref<FollowerInst | null>(null)
    const NPopover = inject<PopoverInjection>('NPopover') as PopoverInjection
    const bodyRef = ref<HTMLElement | null>(null)
    const followerEnabledRef = ref(props.show)
    const displayedRef = ref(false)
    watchEffect(() => {
      const { show } = props
      if (show && !isJsdom() && !props.internalDeactivateImmediately) {
        displayedRef.value = true
      }
    })
    const directivesRef = computed<DirectiveArguments>(() => {
      const { trigger, onClickoutside } = props
      const directives: DirectiveArguments = []
      const {
        positionManuallyRef: { value: positionManually }
      } = NPopover
      if (!positionManually) {
        if (trigger === 'click' && !onClickoutside) {
          directives.push([
            clickoutside,
            handleClickOutside,
            undefined,
            { capture: true }
          ])
        }
        if (trigger === 'hover') {
          directives.push([mousemoveoutside, handleMouseMoveOutside])
        }
      }
      if (onClickoutside) {
        directives.push([
          clickoutside,
          handleClickOutside,
          undefined,
          { capture: true }
        ])
      }
      if (
        props.displayDirective === 'show'
        || (props.animated && displayedRef.value)
      ) {
        directives.push([vShow, props.show])
      }
      return directives
    })

    const cssVarsRef = computed(() => {
      const {
        common: { cubicBezierEaseInOut, cubicBezierEaseIn, cubicBezierEaseOut },
        self: {
          space,
          spaceArrow,
          padding,
          fontSize,
          textColor,
          dividerColor,
          color,
          boxShadow,
          borderRadius,
          arrowHeight,
          arrowOffset,
          arrowOffsetVertical
        }
      } = themeRef.value

      return {
        '--n-box-shadow': boxShadow,
        '--n-bezier': cubicBezierEaseInOut,
        '--n-bezier-ease-in': cubicBezierEaseIn,
        '--n-bezier-ease-out': cubicBezierEaseOut,
        '--n-font-size': fontSize,
        '--n-text-color': textColor,
        '--n-color': color,
        '--n-divider-color': dividerColor,
        '--n-border-radius': borderRadius,
        '--n-arrow-height': arrowHeight,
        '--n-arrow-offset': arrowOffset,
        '--n-arrow-offset-vertical': arrowOffsetVertical,
        '--n-padding': padding,
        '--n-space': space,
        '--n-space-arrow': spaceArrow
      }
    })
    const styleRef = computed(() => {
      const width
        = props.width === 'trigger' ? undefined : formatLength(props.width)
      const style: CSSProperties[] = []
      if (width) {
        style.push({ width })
      }
      const { maxWidth, minWidth } = props
      if (maxWidth) {
        style.push({ maxWidth: formatLength(maxWidth) })
      }
      if (minWidth) {
        style.push({ maxWidth: formatLength(minWidth) })
      }
      if (!inlineThemeDisabled) {
        style.push(cssVarsRef.value)
      }
      return style
    })
    const themeClassHandle = inlineThemeDisabled
      ? useThemeClass('popover', undefined, cssVarsRef, props)
      : undefined
    NPopover.setBodyInstance({
      syncPosition
    })
    onBeforeUnmount(() => {
      NPopover.setBodyInstance(null)
    })
    watch(toRef(props, 'show'), (value) => {
      // 如果没有动画，就不会给组件应用 transition 组件。
      // 因此需要手动触发 follower。
      if (props.animated)
        return
      if (value) {
        followerEnabledRef.value = true
      }
      else {
        followerEnabledRef.value = false
      }
    })
    function syncPosition(): void {
      followerRef.value?.syncPosition()
    }
    function handleMouseEnter(e: MouseEvent): void {
      if (props.trigger === 'hover' && props.keepAliveOnHover && props.show) {
        NPopover.handleMouseEnter(e)
      }
    }
    function handleMouseLeave(e: MouseEvent): void {
      if (props.trigger === 'hover' && props.keepAliveOnHover) {
        NPopover.handleMouseLeave(e)
      }
    }
    function handleMouseMoveOutside(e: MouseEvent): void {
      if (
        props.trigger === 'hover'
        && !getTriggerElement().contains(getPreciseEventTarget(e) as Node | null)
      ) {
        NPopover.handleMouseMoveOutside(e)
      }
    }
    function handleClickOutside(e: MouseEvent): void {
      if (
        (props.trigger === 'click'
          && !getTriggerElement().contains(
            getPreciseEventTarget(e) as Node | null
          ))
          || props.onClickoutside
      ) {
        NPopover.handleClickOutside(e)
      }
    }
    function getTriggerElement(): HTMLElement {
      return NPopover.getTriggerElement()
    }
    provide(popoverBodyInjectionKey, bodyRef)
    provide(drawerBodyInjectionKey, null)
    provide(modalBodyInjectionKey, null)

    function renderContentNode(): VNode | null {
      themeClassHandle?.onRender()
      const shouldRenderDom
        = props.displayDirective === 'show'
          || props.show
          || (props.animated && displayedRef.value)
      if (!shouldRenderDom) {
        return null
      }
      let contentNode: VNode
      const renderBody = NPopover.internalRenderBodyRef.value
      const { value: mergedClsPrefix } = mergedClsPrefixRef
      if (!renderBody) {
        const { value: extraClass } = NPopover.extraClassRef
        const { internalTrapFocus } = props
        const hasHeaderOrFooter
          = !isSlotEmpty(slots.header) || !isSlotEmpty(slots.footer)
        const renderContentInnerNode = (): VNodeChild[] => {
          const body = hasHeaderOrFooter ? (
            <>
              {resolveWrappedSlot(slots.header, (children) => {
                return children ? (
                  <div
                    class={[
                      `${mergedClsPrefix}-popover__header`,
                      props.headerClass
                    ]}
                    style={props.headerStyle}
                  >
                    {children}
                  </div>
                ) : null
              })}
              {resolveWrappedSlot(slots.default, (children) => {
                return children ? (
                  <div
                    class={[
                      `${mergedClsPrefix}-popover__content`,
                      props.contentClass
                    ]}
                    style={props.contentStyle}
                  >
                    {slots.default?.()}
                  </div>
                ) : null
              })}
              {resolveWrappedSlot(slots.footer, (children) => {
                return children ? (
                  <div
                    class={[
                      `${mergedClsPrefix}-popover__footer`,
                      props.footerClass
                    ]}
                    style={props.footerStyle}
                  >
                    {children}
                  </div>
                ) : null
              })}
            </>
          ) : props.scrollable ? (
            slots.default?.()
          ) : (
            <div
              class={[
                `${mergedClsPrefix}-popover__content`,
                props.contentClass
              ]}
              style={props.contentStyle}
            >
              {slots.default?.()}
            </div>
          )
          const maybeScrollableBody = props.scrollable ? (
            <NxScrollbar
              themeOverrides={themeRef.value.peerOverrides.Scrollbar}
              theme={themeRef.value.peers.Scrollbar}
              contentClass={
                hasHeaderOrFooter
                  ? undefined
                  : `${mergedClsPrefix}-popover__content ${
                    props.contentClass ?? ''
                  }`
              }
              contentStyle={hasHeaderOrFooter ? undefined : props.contentStyle}
            >
              {{
                default: () => body
              }}
            </NxScrollbar>
          ) : (
            body
          )
          const arrow = props.showArrow
            ? renderArrow({
                arrowClass: props.arrowClass,
                arrowStyle: props.arrowStyle,
                arrowWrapperClass: props.arrowWrapperClass,
                arrowWrapperStyle: props.arrowWrapperStyle,
                clsPrefix: mergedClsPrefix
              })
            : null
          return [maybeScrollableBody, arrow]
        }
        contentNode = h(
          'div',
          mergeProps(
            {
              class: [
                `${mergedClsPrefix}-popover`,
                `${mergedClsPrefix}-popover-shared`,
                rtlEnabledRef?.value && `${mergedClsPrefix}-popover--rtl`,
                themeClassHandle?.themeClass.value,
                extraClass.map(v => `${mergedClsPrefix}-${v}`),
                {
                  [`${mergedClsPrefix}-popover--scrollable`]: props.scrollable,
                  [`${mergedClsPrefix}-popover--show-header-or-footer`]:
                    hasHeaderOrFooter,
                  [`${mergedClsPrefix}-popover--raw`]: props.raw,
                  [`${mergedClsPrefix}-popover-shared--overlap`]: props.overlap,
                  [`${mergedClsPrefix}-popover-shared--show-arrow`]:
                    props.showArrow,
                  [`${mergedClsPrefix}-popover-shared--center-arrow`]:
                    props.arrowPointToCenter
                }
              ],
              ref: bodyRef,
              style: styleRef.value,
              onKeydown: NPopover.handleKeydown,
              onMouseenter: handleMouseEnter,
              onMouseleave: handleMouseLeave
            },
            attrs
          ),
          internalTrapFocus ? (
            <VFocusTrap active={props.show} autoFocus>
              {{ default: renderContentInnerNode }}
            </VFocusTrap>
          ) : (
            renderContentInnerNode()
          )
        )
      }
      else {
        contentNode = renderBody(
          // popover 类和 overlap 类必须存在，它们会被用来
          // 放置主体和过渡动画。
          // Shadow 类存在是为了复用 box-shadow。
          [
            `${mergedClsPrefix}-popover-shared`,
            rtlEnabledRef?.value && `${mergedClsPrefix}-popover--rtl`,
            themeClassHandle?.themeClass.value,
            props.overlap && `${mergedClsPrefix}-popover-shared--overlap`,
            props.showArrow && `${mergedClsPrefix}-popover-shared--show-arrow`,
            props.arrowPointToCenter
            && `${mergedClsPrefix}-popover-shared--center-arrow`
          ],
          bodyRef,
          styleRef.value,
          handleMouseEnter,
          handleMouseLeave
        )
      }
      return withDirectives(contentNode, directivesRef.value)
    }

    return {
      displayed: displayedRef,
      namespace: namespaceRef,
      isMounted: NPopover.isMountedRef,
      zIndex: NPopover.zIndexRef,
      // 减小 dts 体积：render 中只用到字符串 ref，类型用不上
      followerRef: followerRef as unknown,
      adjustedTo: useAdjustedTo(props),
      followerEnabled: followerEnabledRef,
      renderContentNode
    }
  },
  render() {
    return (
      <VFollower
        ref="followerRef"
        zIndex={this.zIndex}
        show={this.show}
        enabled={this.followerEnabled}
        to={this.adjustedTo}
        x={this.x}
        y={this.y}
        flip={this.flip}
        placement={this.placement}
        containerClass={this.namespace}
        overlap={this.overlap}
        width={this.width === 'trigger' ? 'target' : undefined}
        teleportDisabled={this.adjustedTo === useAdjustedTo.tdkey}
      >
        {{
          default: () => {
            return this.animated ? (
              <Transition
                name="popover-transition"
                appear={this.isMounted}
                // 不要用 watch 来启用 follower，因为 transition 可能
                // 让位置同步的时机变得非常微妙且容易出 bug。
                onEnter={() => {
                  this.followerEnabled = true
                }}
                onAfterLeave={() => {
                  this.internalOnAfterLeave?.()
                  this.followerEnabled = false
                  this.displayed = false
                }}
              >
                {{
                  default: this.renderContentNode
                }}
              </Transition>
            ) : (
              this.renderContentNode()
            )
          }
        }}
      </VFollower>
    )
  }
})
