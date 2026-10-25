import type { TreeNode } from 'treemate'
import type { PropType } from 'vue'
import type { InternalSelectMenuRef } from '../../_internal'
import type {
  SelectBaseOption,
  SelectGroupOption,
  SelectIgnoredOption
} from '../../select/src/interface'
import type {
  CascaderOption,
  Filter,
  SelectMenuInstance,
  TmNode,
  Value
} from './interface'
import { createTreeMate } from 'treemate'
import { clickoutside } from 'vdirs'
import {
  computed,
  defineComponent,
  h,
  inject,
  ref,
  Transition,
  withDirectives
} from 'vue'
import { NInternalSelectMenu } from '../../_internal'
import { resolveSlot } from '../../_utils'
import { createTmOptions } from '../../select/src/utils'
import { cascaderInjectionKey } from './interface'
import { createSelectOptions } from './utils'

export default defineComponent({
  name: 'NCascaderSelectMenu',
  props: {
    value: {
      type: [String, Number, Array] as PropType<Value | null>,
      default: null
    },
    show: Boolean,
    defaultFirstOption: { type: Boolean, default: true },
    pattern: {
      type: String,
      default: ''
    },
    multiple: Boolean,
    tmNodes: {
      type: Array as PropType<TmNode[]>,
      default: () => []
    },
    filter: Function as PropType<Filter>,
    labelField: {
      type: String,
      required: true
    },
    separator: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const {
      isMountedRef,
      mergedValueRef,
      mergedClsPrefixRef,
      mergedThemeRef,
      mergedCheckStrategyRef,
      slots: cascaderSlots,
      syncSelectMenuPosition,
      closeMenu,
      handleSelectMenuClickOutside,
      doUncheck: cascaderDoUncheck,
      doCheck: cascaderDoCheck,
      scrollbarPropsRef,
      clearPattern
    } = inject(cascaderInjectionKey)!
    const menuInstRef = ref<InternalSelectMenuRef | null>(null)
    const selectOptionsRef = computed(() => {
      return createSelectOptions(
        props.tmNodes,
        mergedCheckStrategyRef.value === 'child',
        props.labelField,
        props.separator
      )
    })
    const mergedFilterRef = computed(() => {
      const { filter } = props
      if (filter)
        return filter
      const { labelField } = props
      return (pattern: string, _: CascaderOption, path: CascaderOption[]) =>
        path.some(
          option =>
            option[labelField]
            && ~(option[labelField] as any)
              .toLowerCase()
              .indexOf(pattern.toLowerCase())
        )
    })
    const filteredSelectOptionsRef = computed(() => {
      const { pattern } = props
      const { value: mergedFilter } = mergedFilterRef
      return (
        pattern
          ? selectOptionsRef.value.filter((option) => {
              return mergedFilter(pattern, option.rawNode, option.path)
            })
          : selectOptionsRef.value
      ).map(option => ({
        value: option.value,
        label: option.label
      }))
    })
    const selectTreeMateRef = computed(() => {
      return createTreeMate<
        SelectBaseOption,
        SelectGroupOption,
        SelectIgnoredOption
      >(filteredSelectOptionsRef.value, createTmOptions('value', 'children'))
    })
    function handleResize(): void {
      syncSelectMenuPosition()
    }
    function handleToggle(tmNode: TreeNode<SelectBaseOption>): void {
      doCheck(tmNode)
    }
    // 我们不关心 tmNode 的类型，只关心它的 key
    function doCheck(tmNode: TreeNode<SelectBaseOption>): void {
      if (props.multiple) {
        const { value: mergedValue } = mergedValueRef
        if (Array.isArray(mergedValue)) {
          if (!mergedValue.includes(tmNode.key)) {
            cascaderDoCheck(tmNode.key)
          }
          else {
            cascaderDoUncheck(tmNode.key)
          }
        }
        else if (mergedValue === null) {
          cascaderDoCheck(tmNode.key)
        }
        clearPattern()
      }
      else {
        cascaderDoCheck(tmNode.key)
        // 当前 select menu 被设置为可聚焦
        // 但暂时先把它留在这里
        closeMenu(true)
      }
    }
    function prev(): void {
      menuInstRef.value?.prev()
    }
    function next(): void {
      menuInstRef.value?.next()
    }
    function enter(): boolean {
      if (menuInstRef) {
        const pendingOptionTmNode = menuInstRef.value?.getPendingTmNode()
        if (pendingOptionTmNode) {
          doCheck(pendingOptionTmNode)
        }
        return true
      }
      return false
    }
    function handleClickOutside(e: MouseEvent): void {
      handleSelectMenuClickOutside(e)
    }
    const exposedRef: SelectMenuInstance = {
      prev,
      next,
      enter
    }
    return {
      isMounted: isMountedRef,
      mergedTheme: mergedThemeRef,
      mergedClsPrefix: mergedClsPrefixRef,
      // 精简 dts：仅字符串 ref，类型在 render 中未使用
      menuInstRef: menuInstRef as unknown,
      selectTreeMate: selectTreeMateRef,
      handleResize,
      handleToggle,
      handleClickOutside,
      cascaderSlots,
      scrollbarProps: scrollbarPropsRef,
      ...exposedRef
    }
  },
  render() {
    const { mergedClsPrefix, isMounted, mergedTheme, cascaderSlots } = this
    return (
      <Transition name="fade-in-scale-up-transition" appear={isMounted}>
        {{
          default: () =>
            this.show
              ? withDirectives(
                  <NInternalSelectMenu
                    ref="menuInstRef"
                    onResize={this.handleResize}
                    clsPrefix={mergedClsPrefix}
                    class={`${mergedClsPrefix}-cascader-menu`}
                    autoPending={this.defaultFirstOption}
                    themeOverrides={
                      mergedTheme.peerOverrides.InternalSelectMenu
                    }
                    theme={mergedTheme.peers.InternalSelectMenu}
                    treeMate={this.selectTreeMate}
                    multiple={this.multiple}
                    value={this.value}
                    onToggle={this.handleToggle}
                    scrollbarProps={this.scrollbarProps}
                  >
                    {{
                      empty: () =>
                        resolveSlot(cascaderSlots['not-found'], () => [])
                    }}
                  </NInternalSelectMenu>,
                  [
                    [
                      clickoutside,
                      this.handleClickOutside,
                      undefined,
                      { capture: true }
                    ]
                  ]
                )
              : null
        }}
      </Transition>
    )
  }
})
