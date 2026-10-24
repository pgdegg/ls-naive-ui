import type { CheckStrategy, TreeMateOptions } from 'treemate'
import type {
  CSSProperties,
  PropType,
  Ref,
  SlotsType,
  VNode,
  VNodeChild
} from 'vue'
import type { VirtualListInst, VirtualListScrollToOptions } from 'vueuc'
import type { ScrollbarInst } from '../../_internal'
import type { ThemeProps } from '../../_mixins'
import type { ExtractPublicPropTypes, MaybeArray } from '../../_utils'
import type { ScrollbarProps } from '../../scrollbar/src/Scrollbar'
import type { TreeTheme, TreeThemeOverrides } from '../styles'
import type {
  AllowDrop,
  CheckOnClick,
  DropPosition,
  GetChildren,
  InternalDragInfo,
  InternalDropInfo,
  InternalTreeInst,
  Key,
  MotionData,
  OnLoad,
  RenderLabel,
  RenderPrefix,
  RenderSuffix,
  RenderSwitcherIcon,
  TmNode,
  TreeDragInfo,
  TreeDropInfo,
  TreeInst,
  TreeNodeProps,
  TreeOption,
  TreeOptions,
  TreeOverrideNodeClickBehavior
} from './interface'
import type { TreeSpinProps } from './public-types'
import { depx, getPadding, pxfy } from 'seemly'
import { createIndexGetter, createTreeMate, flatten } from 'treemate'
import { useMergedState } from 'vooks'
import {
  computed,
  defineComponent,
  h,
  inject,
  nextTick,
  provide,
  ref,
  toRef,
  watch,
  watchEffect
} from 'vue'
import { VVirtualList } from 'vueuc'
import { NxScrollbar } from '../../_internal'
import { useConfig, useRtl, useTheme, useThemeClass } from '../../_mixins'
import { call, createDataKey, resolveSlot, warn, warnOnce } from '../../_utils'
import { NEmpty } from '../../empty'
import { treeSelectInjectionKey } from '../../tree-select/src/interface'
import { treeLight } from '../styles'
import { defaultAllowDrop } from './dnd'
import { treeInjectionKey } from './interface'
import { useKeyboard } from './keyboard'
import MotionWrapper from './MotionWrapper'
import style from './styles/index.cssr'
import NTreeNode from './TreeNode'
import {
  emptyImage,
  filterTree,
  isNodeDisabled,
  keysWithFilter,
  useMergedCheckStrategy
} from './utils'

export function createTreeMateOptions<T>(
  keyField: string,
  childrenField: string,
  disabledField: string,
  getChildren: GetChildren | undefined
): TreeMateOptions<T, T, T> {
  const settledGetChildren: GetChildren
    = getChildren
      || ((node: T) => {
        return (node as any)[childrenField]
      })
  return {
    getIsGroup() {
      return false
    },
    getKey(node: T) {
      return (node as any)[keyField]
    },
    getChildren: settledGetChildren,
    getDisabled(node: T) {
      return !!((node as any)[disabledField] || (node as any).checkboxDisabled)
    }
  }
}

export type OnUpdateCheckedKeys = (
  value: Array<string & number>,
  option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'check' | 'uncheck'
  }
) => void
export type OnUpdateCheckedKeysImpl = (
  value: Key[],
  option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'check' | 'uncheck'
  }
) => void
export type OnUpdateIndeterminateKeys = (
  value: Array<string & number>,
  option: Array<TreeOption | null>
) => void
export type OnUpdateIndeterminateKeysImpl = (
  value: Key[],
  option: Array<TreeOption | null>
) => void
export type OnUpdateSelectedKeys = (
  value: Array<string & number>,
  option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'select' | 'unselect'
  }
) => void
export type OnUpdateSelectedKeysImpl = (
  value: Key[],
  option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'select' | 'unselect'
  }
) => void
export type onUpdateExpandedKeys = (
  value: Array<string & number>,
  option: Array<TreeOption | null>,
  meta:
    | {
      node: TreeOption
      action: 'expand' | 'collapse'
    }
    | {
      node: null
      action: 'filter'
    }
) => void
export type OnUpdateExpandedKeysImpl = (
  value: Key[],
  option: Array<TreeOption | null>,
  meta:
    | {
      node: TreeOption
      action: 'expand' | 'collapse'
    }
    | {
      node: null
      action: 'filter'
    }
) => void

export const treeSharedProps = {
  allowCheckingNotLoaded: Boolean,
  filter: Function as PropType<(pattern: string, node: TreeOption) => boolean>,
  defaultExpandAll: Boolean,
  expandedKeys: Array as PropType<Key[]>,
  keyField: {
    type: String,
    default: 'key'
  },
  labelField: {
    type: String,
    default: 'label'
  },
  childrenField: {
    type: String,
    default: 'children'
  },
  disabledField: {
    type: String,
    default: 'disabled'
  },
  defaultExpandedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  indent: {
    type: Number,
    default: 24
  },
  indeterminateKeys: Array as PropType<Key[]>,
  renderSwitcherIcon: Function as PropType<RenderSwitcherIcon>,
  onUpdateIndeterminateKeys: [Function, Array] as PropType<
    MaybeArray<OnUpdateIndeterminateKeys>
  >,
  'onUpdate:indeterminateKeys': [Function, Array] as PropType<
    MaybeArray<OnUpdateIndeterminateKeys>
  >,
  onUpdateExpandedKeys: [Function, Array] as PropType<
    MaybeArray<onUpdateExpandedKeys>
  >,
  'onUpdate:expandedKeys': [Function, Array] as PropType<
    MaybeArray<onUpdateExpandedKeys>
  >,
  overrideDefaultNodeClickBehavior:
    Function as PropType<TreeOverrideNodeClickBehavior>
} as const

export const treeProps = {
  ...(useTheme.props as ThemeProps<TreeTheme, TreeThemeOverrides>),
  accordion: Boolean,
  showIrrelevantNodes: { type: Boolean, default: true },
  data: {
    type: Array as PropType<TreeOptions>,
    default: () => []
  },
  expandOnDragenter: {
    type: Boolean,
    default: true
  },
  expandOnClick: Boolean,
  checkOnClick: {
    type: [Boolean, Function] as PropType<boolean | CheckOnClick>,
    default: false
  },
  cancelable: {
    type: Boolean,
    default: true
  },
  checkable: Boolean,
  draggable: Boolean,
  blockNode: Boolean,
  blockLine: Boolean,
  showLine: Boolean,
  disabled: Boolean,
  checkedKeys: Array as PropType<Key[]>,
  defaultCheckedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  selectedKeys: Array as PropType<Key[]>,
  defaultSelectedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  multiple: Boolean,
  pattern: {
    type: String,
    default: ''
  },
  onLoad: Function as PropType<OnLoad>,
  cascade: Boolean,
  selectable: {
    type: Boolean,
    default: true
  },
  scrollbarProps: Object as PropType<ScrollbarProps>,
  allowDrop: {
    type: Function as PropType<AllowDrop>,
    default: defaultAllowDrop
  },
  animated: {
    type: Boolean,
    default: true
  },
  ellipsis: Boolean,
  checkboxPlacement: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  },
  virtualScroll: Boolean,
  watchProps: Array as PropType<
    Array<'defaultCheckedKeys' | 'defaultSelectedKeys' | 'defaultExpandedKeys'>
  >,
  renderLabel: Function as PropType<RenderLabel>,
  renderPrefix: Function as PropType<RenderPrefix>,
  renderSuffix: Function as PropType<RenderSuffix>,
  nodeProps: Function as PropType<TreeNodeProps>,
  keyboard: {
    type: Boolean,
    default: true
  },
  getChildren: Function as PropType<GetChildren>,
  onDragenter: [Function, Array] as PropType<
    MaybeArray<(e: TreeDragInfo) => void>
  >,
  onDragleave: [Function, Array] as PropType<
    MaybeArray<(e: TreeDragInfo) => void>
  >,
  onDragend: [Function, Array] as PropType<
    MaybeArray<(e: TreeDragInfo) => void>
  >,
  onDragstart: [Function, Array] as PropType<
    MaybeArray<(e: TreeDragInfo) => void>
  >,
  onDragover: [Function, Array] as PropType<
    MaybeArray<(e: TreeDragInfo) => void>
  >,
  onDrop: [Function, Array] as PropType<MaybeArray<(e: TreeDropInfo) => void>>,
  onUpdateCheckedKeys: [Function, Array] as PropType<
    MaybeArray<OnUpdateCheckedKeys>
  >,
  'onUpdate:checkedKeys': [Function, Array] as PropType<
    MaybeArray<OnUpdateCheckedKeys>
  >,
  onUpdateSelectedKeys: [Function, Array] as PropType<
    MaybeArray<OnUpdateSelectedKeys>
  >,
  'onUpdate:selectedKeys': [Function, Array] as PropType<
    MaybeArray<OnUpdateSelectedKeys>
  >,
  ...treeSharedProps,
  // 供 tree-select 使用的内部 props
  internalTreeSelect: Boolean,
  internalScrollable: Boolean,
  internalScrollablePadding: String,
  // 用于渲染展示
  internalRenderEmpty: Function as PropType<() => VNodeChild>,
  internalHighlightKeySet: Object as PropType<Set<Key> | null>,
  internalUnifySelectCheck: Boolean,
  internalCheckboxFocusable: {
    type: Boolean,
    default: true
  },
  internalFocusable: {
    // 让 tree-select 接管键盘操作
    type: Boolean,
    default: true
  },
  checkStrategy: {
    type: String as PropType<CheckStrategy>,
    default: 'all'
  },
  spinProps: Object as PropType<TreeSpinProps>,
  /**
   * @deprecated
   */
  leafOnly: Boolean
} as const

export type TreeProps = ExtractPublicPropTypes<typeof treeProps>

export interface TreeSlots {
  default?: () => VNode[]
  empty?: () => VNode[]
}

export default defineComponent({
  name: 'Tree',
  props: treeProps,
  slots: Object as SlotsType<TreeSlots>,
  setup(props) {
    if (__DEV__) {
      watchEffect(() => {
        if (props.leafOnly) {
          warnOnce(
            'tree',
            '`leaf-only` is deprecated, please use `check-strategy="child"` instead'
          )
        }
      })
    }
    const {
      mergedClsPrefixRef,
      inlineThemeDisabled,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props)
    const rtlEnabledRef = useRtl('Tree', mergedRtlRef, mergedClsPrefixRef)
    const themeRef = useTheme(
      'Tree',
      '-tree',
      style,
      treeLight,
      props,
      mergedClsPrefixRef
    )
    const mergedRenderEmptyRef = computed(() => {
      return mergedComponentPropsRef?.value?.Tree?.renderEmpty
    })
    const selfElRef = ref<HTMLDivElement | null>(null)
    const scrollbarInstRef = ref<ScrollbarInst | null>(null)
    const virtualListInstRef = ref<VirtualListInst | null>(null)
    function getScrollContainer(): HTMLElement | null | undefined {
      return virtualListInstRef.value?.listElRef
    }
    function getScrollContent(): HTMLElement | null | undefined {
      return virtualListInstRef.value?.itemsElRef
    }

    const mergedFilterRef = computed(() => {
      const { filter } = props
      if (filter)
        return filter
      const { labelField } = props
      return (pattern: string, node: TreeOption): boolean => {
        if (!pattern.length)
          return true
        const label = node[labelField]
        if (typeof label === 'string') {
          return label.toLowerCase().includes(pattern.toLowerCase())
        }
        return false
      }
    })

    const filteredTreeInfoRef = computed<{
      filteredTree: TreeOption[]
      highlightKeySet: Set<Key> | null
      expandedKeys: Key[] | undefined
    }>(() => {
      const { pattern } = props
      if (!pattern) {
        return {
          filteredTree: props.data,
          highlightKeySet: null,
          expandedKeys: undefined
        }
      }
      if (!pattern.length || !mergedFilterRef.value) {
        return {
          filteredTree: props.data,
          highlightKeySet: null,
          expandedKeys: undefined
        }
      }
      return filterTree(
        props.data,
        mergedFilterRef.value,
        pattern,
        props.keyField,
        props.childrenField
      )
    })

    // 我们不期望数据源发生变化，因此只计算一次
    const displayTreeMateRef = computed(() =>
      createTreeMate<TreeOption>(
        props.showIrrelevantNodes
          ? props.data
          : filteredTreeInfoRef.value.filteredTree,
        createTreeMateOptions(
          props.keyField,
          props.childrenField,
          props.disabledField,
          props.getChildren
        )
      )
    )
    const treeSelectInjection = inject(treeSelectInjectionKey, null)
    const dataTreeMateRef = props.internalTreeSelect
      ? treeSelectInjection!.dataTreeMate
      : computed(() =>
          props.showIrrelevantNodes
            ? displayTreeMateRef.value
            : createTreeMate(
                props.data,
                createTreeMateOptions(
                  props.keyField,
                  props.childrenField,
                  props.disabledField,
                  props.getChildren
                )
              )
        )
    const { watchProps } = props
    const uncontrolledCheckedKeysRef = ref<Key[]>([])
    if (watchProps?.includes('defaultCheckedKeys')) {
      watchEffect(() => {
        uncontrolledCheckedKeysRef.value = props.defaultCheckedKeys
      })
    }
    else {
      uncontrolledCheckedKeysRef.value = props.defaultCheckedKeys
    }
    const controlledCheckedKeysRef = toRef(props, 'checkedKeys')
    const mergedCheckedKeysRef = useMergedState(
      controlledCheckedKeysRef,
      uncontrolledCheckedKeysRef
    )
    const checkedStatusRef = computed(() => {
      const value = dataTreeMateRef.value.getCheckedKeys(
        mergedCheckedKeysRef.value,
        {
          cascade: props.cascade,
          allowNotLoaded: props.allowCheckingNotLoaded
        }
      )
      return value
    })
    const mergedCheckStrategyRef = useMergedCheckStrategy(props)
    const displayedCheckedKeysRef = computed(() => {
      return checkedStatusRef.value.checkedKeys
    })
    const displayedIndeterminateKeysRef = computed(() => {
      const { indeterminateKeys } = props
      if (indeterminateKeys !== undefined)
        return indeterminateKeys
      return checkedStatusRef.value.indeterminateKeys
    })
    const uncontrolledSelectedKeysRef = ref<Key[]>([])
    if (watchProps?.includes('defaultSelectedKeys')) {
      watchEffect(() => {
        uncontrolledSelectedKeysRef.value = props.defaultSelectedKeys
      })
    }
    else {
      uncontrolledSelectedKeysRef.value = props.defaultSelectedKeys
    }
    const controlledSelectedKeysRef = toRef(props, 'selectedKeys')
    const mergedSelectedKeysRef = useMergedState(
      controlledSelectedKeysRef,
      uncontrolledSelectedKeysRef
    )
    const uncontrolledExpandedKeysRef = ref<Key[]>([])

    const initUncontrolledExpandedKeys = (keys: undefined | Key[]): void => {
      uncontrolledExpandedKeysRef.value = props.defaultExpandAll
        ? dataTreeMateRef.value.getNonLeafKeys()
        : keys === undefined
          ? props.defaultExpandedKeys
          : keys
    }
    if (watchProps?.includes('defaultExpandedKeys')) {
      // 若监听 defaultExpandedKeys，则在初始化逻辑内部访问 props.defaultExpandedKeys
      watchEffect(() => {
        initUncontrolledExpandedKeys(undefined)
      })
    }
    else {
      // 默认使用 watchEffect，因为当 defaultExpandAll 为 true 时，数据变化后仍应保持树展开
      watchEffect(() => {
        initUncontrolledExpandedKeys(props.defaultExpandedKeys)
      })
    }

    const controlledExpandedKeysRef = toRef(props, 'expandedKeys')
    const mergedExpandedKeysRef = useMergedState(
      controlledExpandedKeysRef,
      uncontrolledExpandedKeysRef
    )

    const fNodesRef = computed(() =>
      displayTreeMateRef.value.getFlattenedNodes(mergedExpandedKeysRef.value)
    )

    const { pendingNodeKeyRef, handleKeydown } = useKeyboard({
      props,
      mergedCheckedKeysRef,
      mergedSelectedKeysRef,
      fNodesRef,
      mergedExpandedKeysRef,
      handleCheck,
      handleSelect,
      handleSwitcherClick
    })

    let expandTimerId: number | null = null
    let nodeKeyToBeExpanded: Key | null = null
    const uncontrolledHighlightKeySetRef = ref(new Set<Key>())
    const controlledHighlightKeySetRef = computed(() => {
      return (
        props.internalHighlightKeySet
        || filteredTreeInfoRef.value.highlightKeySet
      )
    })
    const mergedHighlightKeySetRef = useMergedState(
      controlledHighlightKeySetRef,
      uncontrolledHighlightKeySetRef
    )
    const loadingKeysRef = ref(new Set<Key>())
    const expandedNonLoadingKeysRef = computed(() => {
      return mergedExpandedKeysRef.value.filter(
        key => !loadingKeysRef.value.has(key)
      )
    })

    let dragStartX: number = 0
    const draggingNodeRef = ref<TmNode | null>(null)
    const droppingNodeRef = ref<TmNode | null>(null)
    const droppingMouseNodeRef = ref<TmNode | null>(null)
    const droppingPositionRef = ref<'before' | 'inside' | 'after' | null>(null)
    const droppingOffsetLevelRef = ref<number>(0)
    const droppingNodeParentRef = computed(() => {
      const { value: droppingNode } = droppingNodeRef
      if (!droppingNode)
        return null
      // 可避免首个子节点的线条标记与父节点的矩形标记重叠
      // if (droppingNode.isFirstChild && droppingPositionRef.value === 'before') {
      //   return null
      // }
      return droppingNode.parent
    })

    // 浅监听 data
    let isDataReset = false
    watch(
      toRef(props, 'data'),
      () => {
        isDataReset = true
        void nextTick(() => {
          isDataReset = false
        })
        loadingKeysRef.value.clear()
        pendingNodeKeyRef.value = null
        resetDndState()
      },
      {
        deep: false
      }
    )
    let expandAnimationDisabled = false
    const disableExpandAnimationForOneTick = (): void => {
      expandAnimationDisabled = true
      void nextTick(() => {
        expandAnimationDisabled = false
      })
    }
    let memoizedExpandedKeys: Key[] | undefined
    watch(toRef(props, 'pattern'), (value, oldValue) => {
      if (props.showIrrelevantNodes) {
        memoizedExpandedKeys = undefined
        if (value) {
          const { expandedKeys: expandedKeysAfterChange, highlightKeySet }
            = keysWithFilter(
              props.data,
              props.pattern,
              props.keyField,
              props.childrenField,
              mergedFilterRef.value
            )
          uncontrolledHighlightKeySetRef.value = highlightKeySet
          disableExpandAnimationForOneTick()
          doUpdateExpandedKeys(
            expandedKeysAfterChange,
            getOptionsByKeys(expandedKeysAfterChange),
            { node: null, action: 'filter' }
          )
        }
        else {
          uncontrolledHighlightKeySetRef.value = new Set()
        }
      }
      else {
        if (!value.length) {
          if (memoizedExpandedKeys !== undefined) {
            disableExpandAnimationForOneTick()
            doUpdateExpandedKeys(
              memoizedExpandedKeys,
              getOptionsByKeys(memoizedExpandedKeys),
              { node: null, action: 'filter' }
            )
          }
        }
        else {
          if (!oldValue.length) {
            memoizedExpandedKeys = mergedExpandedKeysRef.value
          }
          const { expandedKeys } = filteredTreeInfoRef.value
          if (expandedKeys !== undefined) {
            disableExpandAnimationForOneTick()
            doUpdateExpandedKeys(expandedKeys, getOptionsByKeys(expandedKeys), {
              node: null,
              action: 'filter'
            })
          }
        }
      }
    })
    async function triggerLoading(node: TmNode): Promise<void> {
      const { onLoad } = props
      if (!onLoad) {
        if (__DEV__) {
          warn(
            'tree',
            'There is unloaded node in data but props.onLoad is not specified.'
          )
        }
        await Promise.resolve()
        return
      }
      const { value: loadingKeys } = loadingKeysRef
      if (!loadingKeys.has(node.key)) {
        loadingKeys.add(node.key)
        try {
          const loadResult = await onLoad(node.rawNode)
          if (loadResult === false) {
            resetDragExpandState()
          }
        }
        catch (loadError) {
          console.error(loadError)
          resetDragExpandState()
        }
        loadingKeys.delete(node.key)
      }
    }
    watchEffect(() => {
      const { value: displayTreeMate } = displayTreeMateRef
      if (!displayTreeMate)
        return
      const { getNode } = displayTreeMate
      mergedExpandedKeysRef.value?.forEach((key) => {
        const node = getNode(key)
        if (node && !node.shallowLoaded) {
          void triggerLoading(node)
        }
      })
    })
    // 动画进行中
    const aipRef = ref(false)
    // 动画期间的扁平化节点
    const afNodesRef = ref<Array<TmNode | MotionData>>([])
    // 注意：由于虚拟列表依赖最小高度，如果存在某个节点
    // 其高度从 0 开始，动画期间虚拟列表的高度就会计算错误
    // 这很少会导致滚动条状态异常。该问题
    // 可以修复，但需要改动 vueuc，我没时间，就先把它
    // 搁置在这里。也许这个 bug 在项目生命周期内都不会被修复。
    watch(expandedNonLoadingKeysRef, (value, prevValue) => {
      if (!props.animated || expandAnimationDisabled) {
        void nextTick(syncScrollbar)
        return
      }
      if (isDataReset) {
        return
      }
      const nodeHeight = depx(themeRef.value.self.nodeHeight)
      const prevVSet = new Set(prevValue)
      let addedKey: Key | null = null
      let removedKey: Key | null = null
      for (const expandedKey of value) {
        if (!prevVSet.has(expandedKey)) {
          if (addedKey !== null)
            return // 多处展开，并非由点击触发
          addedKey = expandedKey
        }
      }
      const currentVSet = new Set(value)
      for (const expandedKey of prevValue) {
        if (!currentVSet.has(expandedKey)) {
          if (removedKey !== null)
            return // 多处收起，并非由点击触发
          removedKey = expandedKey
        }
      }
      if (addedKey === null && removedKey === null) {
        // 1. 多处操作，并非由点击触发
        // 2. 没有操作，不清楚发生了什么
        return
      }
      const { virtualScroll } = props
      const viewportHeight = (
        virtualScroll ? virtualListInstRef.value!.listElRef : selfElRef.value!
      ).offsetHeight
      const viewportItemCount = Math.ceil(viewportHeight / nodeHeight) + 1
      // 播放添加动画
      let baseExpandedKeys: Key[] | undefined
      if (addedKey !== null) {
        baseExpandedKeys = prevValue
      }
      if (removedKey !== null) {
        if (baseExpandedKeys === undefined) {
          baseExpandedKeys = value
        }
        else {
          baseExpandedKeys = baseExpandedKeys.filter(
            key => key !== removedKey
          )
        }
      }
      aipRef.value = true
      afNodesRef.value
        = displayTreeMateRef.value.getFlattenedNodes(baseExpandedKeys)
      if (addedKey !== null) {
        const expandedNodeIndex = afNodesRef.value.findIndex(
          node => (node as any).key === addedKey
        )
        if (~expandedNodeIndex) {
          const children = (afNodesRef.value[expandedNodeIndex] as TmNode)
            .children
          // 有时用户会传入叶子节点的 key
          if (children) {
            const expandedChildren = flatten(children, value)
            afNodesRef.value.splice(expandedNodeIndex + 1, 0, {
              __motion: true,
              mode: 'expand',
              height: virtualScroll
                ? expandedChildren.length * nodeHeight
                : undefined,
              nodes: virtualScroll
                ? expandedChildren.slice(0, viewportItemCount)
                : expandedChildren
            })
          }
        }
      }
      if (removedKey !== null) {
        const collapsedNodeIndex = afNodesRef.value.findIndex(
          node => (node as any).key === removedKey
        )
        if (~collapsedNodeIndex) {
          const collapsedNodeChildren = (
            afNodesRef.value[collapsedNodeIndex] as TmNode
          ).children
          // 有时整棵树都发生了变化，移除一个 key 并不意味着它被收起，
          // 而可能是其子节点被移除了
          if (!collapsedNodeChildren)
            return
          // 播放移除动画
          aipRef.value = true
          const collapsedChildren = flatten(collapsedNodeChildren, value)
          afNodesRef.value.splice(collapsedNodeIndex + 1, 0, {
            __motion: true,
            mode: 'collapse',
            height: virtualScroll
              ? collapsedChildren.length * nodeHeight
              : undefined,
            nodes: virtualScroll
              ? collapsedChildren.slice(0, viewportItemCount)
              : collapsedChildren
          })
        }
      }
    })

    const getFIndexRef = computed(() => {
      return createIndexGetter(fNodesRef.value)
    })

    const mergedFNodesRef = computed(() => {
      if (aipRef.value)
        return afNodesRef.value
      else return fNodesRef.value
    })

    function syncScrollbar(): void {
      const { value: scrollbarInst } = scrollbarInstRef
      if (scrollbarInst)
        scrollbarInst.sync()
    }

    function handleAfterEnter(): void {
      aipRef.value = false
      if (props.virtualScroll) {
        // 若开启虚拟滚动，动画期间我们不会监听 resize，因此
        // 虚拟列表的 resize 回调不会被调用，结果
        // 滚动条不同步，我们需要手动同步滚动条。
        void nextTick(syncScrollbar)
      }
    }

    function getOptionsByKeys(keys: Key[]): Array<TreeOption | null> {
      const { getNode } = dataTreeMateRef.value
      return keys.map(key => getNode(key)?.rawNode || null)
    }

    function doUpdateExpandedKeys(
      value: Key[],
      option: Array<TreeOption | null>,
      meta:
        | {
          node: TreeOption
          action: 'expand' | 'collapse'
        }
        | {
          node: null
          action: 'filter'
        }
    ): void {
      const {
        'onUpdate:expandedKeys': _onUpdateExpandedKeys,
        onUpdateExpandedKeys
      } = props
      uncontrolledExpandedKeysRef.value = value
      if (_onUpdateExpandedKeys) {
        call(
          _onUpdateExpandedKeys as OnUpdateExpandedKeysImpl,
          value,
          option,
          meta
        )
      }
      if (onUpdateExpandedKeys) {
        call(
          onUpdateExpandedKeys as OnUpdateExpandedKeysImpl,
          value,
          option,
          meta
        )
      }
    }
    function doUpdateCheckedKeys(
      value: Key[],
      option: Array<TreeOption | null>,
      meta: {
        node: TreeOption | null
        action: 'check' | 'uncheck'
      }
    ): void {
      const {
        'onUpdate:checkedKeys': _onUpdateCheckedKeys,
        onUpdateCheckedKeys
      } = props
      uncontrolledCheckedKeysRef.value = value
      if (onUpdateCheckedKeys) {
        call(
          onUpdateCheckedKeys as OnUpdateCheckedKeysImpl,
          value,
          option,
          meta
        )
      }
      if (_onUpdateCheckedKeys) {
        call(
          _onUpdateCheckedKeys as OnUpdateCheckedKeysImpl,
          value,
          option,
          meta
        )
      }
    }
    function doUpdateIndeterminateKeys(
      value: Key[],
      option: Array<TreeOption | null>
    ): void {
      const {
        'onUpdate:indeterminateKeys': _onUpdateIndeterminateKeys,
        onUpdateIndeterminateKeys
      } = props
      if (_onUpdateIndeterminateKeys) {
        call(
          _onUpdateIndeterminateKeys as OnUpdateIndeterminateKeysImpl,
          value,
          option
        )
      }
      if (onUpdateIndeterminateKeys) {
        call(
          onUpdateIndeterminateKeys as OnUpdateIndeterminateKeysImpl,
          value,
          option
        )
      }
    }
    function doUpdateSelectedKeys(
      value: Key[],
      option: Array<TreeOption | null>,
      meta: {
        node: TreeOption
        action: 'select' | 'unselect'
      }
    ): void {
      const {
        'onUpdate:selectedKeys': _onUpdateSelectedKeys,
        onUpdateSelectedKeys
      } = props
      uncontrolledSelectedKeysRef.value = value
      if (onUpdateSelectedKeys) {
        call(
          onUpdateSelectedKeys as OnUpdateSelectedKeysImpl,
          value,
          option,
          meta
        )
      }
      if (_onUpdateSelectedKeys) {
        call(
          _onUpdateSelectedKeys as OnUpdateSelectedKeysImpl,
          value,
          option,
          meta
        )
      }
    }
    // 拖拽（Drag & Drop）
    function doDragEnter(info: TreeDragInfo): void {
      const { onDragenter } = props
      if (onDragenter)
        call(onDragenter, info)
    }
    function doDragLeave(info: TreeDragInfo): void {
      const { onDragleave } = props
      if (onDragleave)
        call(onDragleave, info)
    }
    function doDragEnd(info: TreeDragInfo): void {
      const { onDragend } = props
      if (onDragend)
        call(onDragend, info)
    }
    function doDragStart(info: TreeDragInfo): void {
      const { onDragstart } = props
      if (onDragstart)
        call(onDragstart, info)
    }
    function doDragOver(info: TreeDragInfo): void {
      const { onDragover } = props
      if (onDragover)
        call(onDragover, info)
    }
    function doDrop(info: TreeDropInfo): void {
      const { onDrop } = props
      if (onDrop)
        call(onDrop, info)
    }
    function resetDndState(): void {
      resetDragState()
      resetDropState()
    }
    function resetDragState(): void {
      draggingNodeRef.value = null
    }
    function resetDropState(): void {
      droppingOffsetLevelRef.value = 0
      droppingNodeRef.value = null
      droppingMouseNodeRef.value = null
      droppingPositionRef.value = null
      resetDragExpandState()
    }
    function resetDragExpandState(): void {
      if (expandTimerId) {
        window.clearTimeout(expandTimerId)
        expandTimerId = null
      }
      nodeKeyToBeExpanded = null
    }
    function handleCheck(node: TmNode, checked: boolean): void {
      // 我们不再单独对叶子节点做拦截，因为视图层已经处理过了
      if (props.disabled || isNodeDisabled(node, props.disabledField)) {
        return
      }
      if (props.internalUnifySelectCheck && !props.multiple) {
        handleSelect(node)
        return
      }
      const checkedAction = checked ? 'check' : 'uncheck'
      const { checkedKeys, indeterminateKeys } = dataTreeMateRef.value[
        checkedAction
      ](node.key, displayedCheckedKeysRef.value, {
        cascade: props.cascade,
        checkStrategy: mergedCheckStrategyRef.value,
        allowNotLoaded: props.allowCheckingNotLoaded
      })
      doUpdateCheckedKeys(checkedKeys, getOptionsByKeys(checkedKeys), {
        node: node.rawNode,
        action: checkedAction
      })
      doUpdateIndeterminateKeys(
        indeterminateKeys,
        getOptionsByKeys(indeterminateKeys)
      )
    }
    function toggleExpand(node: TmNode): void {
      if (props.disabled)
        return
      const { key } = node
      const { value: mergedExpandedKeys } = mergedExpandedKeysRef
      const index = mergedExpandedKeys.findIndex(
        expandNodeId => expandNodeId === key
      )
      if (~index) {
        const expandedKeysAfterChange = Array.from(mergedExpandedKeys)
        expandedKeysAfterChange.splice(index, 1)
        doUpdateExpandedKeys(
          expandedKeysAfterChange,
          getOptionsByKeys(expandedKeysAfterChange),
          {
            node: node.rawNode,
            action: 'collapse'
          }
        )
      }
      else {
        const nodeToBeExpanded = displayTreeMateRef.value.getNode(key)
        if (!nodeToBeExpanded || nodeToBeExpanded.isLeaf) {
          return
        }
        let nextKeys: Key[]
        if (props.accordion) {
          const siblingKeySet = new Set<Key>(
            node.siblings.map(({ key }) => key)
          )
          nextKeys = mergedExpandedKeys.filter((expandedKey) => {
            return !siblingKeySet.has(expandedKey)
          })
          nextKeys.push(key)
        }
        else {
          nextKeys = mergedExpandedKeys.concat(key)
        }
        doUpdateExpandedKeys(nextKeys, getOptionsByKeys(nextKeys), {
          node: node.rawNode,
          action: 'expand'
        })
      }
    }
    function handleSwitcherClick(node: TmNode): void {
      if (props.disabled || aipRef.value)
        return
      toggleExpand(node)
    }
    function handleSelect(node: TmNode): void {
      if (props.disabled || !props.selectable) {
        return
      }
      pendingNodeKeyRef.value = node.key
      if (props.internalUnifySelectCheck) {
        const {
          value: { checkedKeys, indeterminateKeys }
        } = checkedStatusRef
        if (props.multiple) {
          handleCheck(
            node,
            !(
              checkedKeys.includes(node.key)
              || indeterminateKeys.includes(node.key)
            )
          )
        }
        else {
          doUpdateCheckedKeys([node.key], getOptionsByKeys([node.key]), {
            node: node.rawNode,
            action: 'check'
          })
        }
      }
      if (props.multiple) {
        const selectedKeys = Array.from(mergedSelectedKeysRef.value)
        const index = selectedKeys.findIndex(key => key === node.key)
        if (~index) {
          if (props.cancelable) {
            selectedKeys.splice(index, 1)
          }
        }
        else if (!~index) {
          selectedKeys.push(node.key)
        }
        doUpdateSelectedKeys(selectedKeys, getOptionsByKeys(selectedKeys), {
          node: node.rawNode,
          action: ~index ? 'unselect' : 'select'
        })
      }
      else {
        const selectedKeys = mergedSelectedKeysRef.value
        if (selectedKeys.includes(node.key)) {
          if (props.cancelable) {
            doUpdateSelectedKeys([], [], {
              node: node.rawNode,
              action: 'unselect'
            })
          }
        }
        else {
          doUpdateSelectedKeys([node.key], getOptionsByKeys([node.key]), {
            node: node.rawNode,
            action: 'select'
          })
        }
      }
    }

    function expandDragEnterNode(node: TmNode): void {
      if (expandTimerId) {
        window.clearTimeout(expandTimerId)
        expandTimerId = null
      }
      // 不要展开叶子节点。
      if (node.isLeaf)
        return
      nodeKeyToBeExpanded = node.key
      const expand = (): void => {
        if (nodeKeyToBeExpanded !== node.key)
          return
        const { value: droppingMouseNode } = droppingMouseNodeRef
        if (
          droppingMouseNode
          && droppingMouseNode.key === node.key
          && !mergedExpandedKeysRef.value.includes(node.key)
        ) {
          const nextKeys = mergedExpandedKeysRef.value.concat(node.key)
          doUpdateExpandedKeys(nextKeys, getOptionsByKeys(nextKeys), {
            node: node.rawNode,
            action: 'expand'
          })
        }
        expandTimerId = null
        nodeKeyToBeExpanded = null
      }
      if (!node.shallowLoaded) {
        expandTimerId = window.setTimeout(() => {
          void triggerLoading(node).then(() => {
            expand()
          })
        }, 1000)
      }
      else {
        expandTimerId = window.setTimeout(() => {
          expand()
        }, 1000)
      }
    }

    // 拖拽（DnD）
    function handleDragEnter({ event, node }: InternalDragInfo): void {
      // node 应当是一个 tmNode
      if (
        !props.draggable
        || props.disabled
        || isNodeDisabled(node, props.disabledField)
      ) {
        return
      }
      handleDragOver({ event, node }, false)
      doDragEnter({ event, node: node.rawNode })
    }
    function handleDragLeave({ event, node }: InternalDragInfo): void {
      if (
        !props.draggable
        || props.disabled
        || isNodeDisabled(node, props.disabledField)
      ) {
        return
      }
      doDragLeave({ event, node: node.rawNode })
    }
    function handleDragLeaveTree(e: DragEvent): void {
      if (e.target !== e.currentTarget)
        return
      resetDropState()
    }
    // dragend 即可，无需添加全局监听器来重置拖拽状态
    function handleDragEnd({ event, node }: InternalDragInfo): void {
      resetDndState()
      if (
        !props.draggable
        || props.disabled
        || isNodeDisabled(node, props.disabledField)
      ) {
        return
      }
      doDragEnd({ event, node: node.rawNode })
    }
    function handleDragStart({ event, node }: InternalDragInfo): void {
      if (
        !props.draggable
        || props.disabled
        || isNodeDisabled(node, props.disabledField)
      ) {
        return
      }
      // 多数情况下，拖拽镜像图片会遮挡用户视野
      if (emptyImage) {
        event.dataTransfer?.setDragImage(emptyImage, 0, 0)
      }
      dragStartX = event.clientX
      draggingNodeRef.value = node
      doDragStart({ event, node: node.rawNode })
    }
    function handleDragOver(
      { event, node }: InternalDragInfo,
      emit: boolean = true
    ): void {
      if (
        !props.draggable
        || props.disabled
        || isNodeDisabled(node, props.disabledField)
      ) {
        return
      }
      const { value: draggingNode } = draggingNodeRef
      if (!draggingNode)
        return
      const { allowDrop, indent } = props
      if (emit)
        doDragOver({ event, node: node.rawNode })
      // 更新放置目标节点
      const el = event.currentTarget as HTMLElement
      const { height: elOffsetHeight, top: elClientTop }
        = el.getBoundingClientRect()
      const eventOffsetY = event.clientY - elClientTop
      let mousePosition: DropPosition

      const allowDropInside = allowDrop({
        node: node.rawNode,
        dropPosition: 'inside',
        phase: 'drag'
      })

      if (allowDropInside) {
        if (eventOffsetY <= 8) {
          mousePosition = 'before'
        }
        else if (eventOffsetY >= elOffsetHeight - 8) {
          mousePosition = 'after'
        }
        else {
          mousePosition = 'inside'
        }
      }
      else {
        if (eventOffsetY <= elOffsetHeight / 2) {
          mousePosition = 'before'
        }
        else {
          mousePosition = 'after'
        }
      }

      const { value: getFindex } = getFIndexRef

      /** 确定放置位置与放置目标节点 */
      /** 放置目标节点不必是鼠标悬停的节点！ */
      /**
       * 实现复杂拖拽功能让我明白一件事：在真正想清楚
       * 需要什么行为之前，绝不要先写单元测试。
       * 自己到底想要什么行为。
       */
      let finalDropNode: TmNode
      let finalDropPosition: DropPosition
      const hoverNodeFIndex = getFindex(node.key)
      if (hoverNodeFIndex === null) {
        resetDropState()
        return
      }

      let mouseAtExpandedNonLeafNode = false
      if (mousePosition === 'inside') {
        finalDropNode = node
        finalDropPosition = 'inside'
      }
      else {
        if (mousePosition === 'before') {
          if (node.isFirstChild) {
            finalDropNode = node
            finalDropPosition = 'before'
          }
          else {
            finalDropNode = fNodesRef.value[hoverNodeFIndex - 1]
            finalDropPosition = 'after'
          }
        }
        else {
          finalDropNode = node
          finalDropPosition = 'after'
        }
      }

      // 如果节点是非叶子节点且处于展开状态，我们不允许把它放到自身之后，
      // 而是改为放到其下一个可视兄弟节点之前
      if (
        !finalDropNode.isLeaf
        && mergedExpandedKeysRef.value.includes(finalDropNode.key)
      ) {
        mouseAtExpandedNonLeafNode = true
        if (finalDropPosition === 'after') {
          finalDropNode = fNodesRef.value[hoverNodeFIndex + 1]
          if (!finalDropNode) {
            // 当非叶子节点没有子节点且是树中最后一个节点时，
            // 可能不存在下一个可视兄弟节点
            finalDropNode = node
            finalDropPosition = 'inside'
          }
          else {
            finalDropPosition = 'before'
          }
        }
      }

      const droppingMouseNode = finalDropNode

      droppingMouseNodeRef.value = droppingMouseNode

      // 这是一个特殊情况：用户拖拽的就是最后一个子节点本身，因此
      // 只将其视为试图放到该节点之后。
      // 相关代码见 Bailout 1 的子分支。
      // 另外，展开拦截应具有更高优先级：若为非叶子
      // 节点且已展开，则保持其原始放置位置。
      if (
        !mouseAtExpandedNonLeafNode
        && draggingNode.isLastChild
        && draggingNode.key === finalDropNode.key
      ) {
        finalDropPosition = 'after'
      }

      if (finalDropPosition === 'after') {
        let offset = dragStartX - event.clientX // 向左拖拽 => > 0
        let offsetLevel = 0
        while (
          offset >= indent / 2 // 除以 2 以降低触发门槛
          && finalDropNode.parent !== null
          && finalDropNode.isLastChild
          && offsetLevel < 1
        ) {
          offset -= indent
          offsetLevel += 1
          finalDropNode = finalDropNode.parent
        }
        droppingOffsetLevelRef.value = offsetLevel
      }
      else {
        droppingOffsetLevelRef.value = 0
      }

      // Bailout 1
      // 把自身拖入自身
      // 拖入其直接父节点
      if (
        draggingNode.contains(finalDropNode)
        || (finalDropPosition === 'inside'
          && draggingNode.parent?.key === finalDropNode.key)
      ) {
        if (
          draggingNode.key === droppingMouseNode.key
          && draggingNode.key === finalDropNode.key
        ) {
          // 这是一个特殊情况：我们希望界面显示标记来引导用户开始拖拽，
          // 否则用户会觉得毫无反应。但这是一次无效放置，
          // 需要在 handleDrop 内部对其进行拦截。
          // handleDrop
        }
        else {
          resetDropState()
          return
        }
      }

      // Bailout 3
      if (
        !allowDrop({
          node: finalDropNode.rawNode,
          dropPosition: finalDropPosition,
          phase: 'drag'
        })
      ) {
        resetDropState()
        return
      }

      if (draggingNode.key === finalDropNode.key) {
        // 拖拽自身时不要展开
        resetDragExpandState()
      }
      else {
        if (nodeKeyToBeExpanded !== finalDropNode.key) {
          if (finalDropPosition === 'inside') {
            if (props.expandOnDragenter) {
              expandDragEnterNode(finalDropNode)
              // Bailout 4
              // 不尝试加载
              if (
                !finalDropNode.shallowLoaded
                && nodeKeyToBeExpanded !== finalDropNode.key
              ) {
                resetDndState()
                return
              }
            }
            else {
              // Bailout 5
              // 拖拽时绝不展开
              if (!finalDropNode.shallowLoaded) {
                resetDndState()
                return
              }
            }
          }
          else {
            resetDragExpandState()
          }
        }
        else {
          if (finalDropPosition !== 'inside') {
            resetDragExpandState()
          }
        }
      }
      droppingPositionRef.value = finalDropPosition
      droppingNodeRef.value = finalDropNode
    }
    function handleDrop({ event, node, dropPosition }: InternalDropInfo): void {
      if (
        !props.draggable
        || props.disabled
        || isNodeDisabled(node, props.disabledField)
      ) {
        return
      }
      const { value: draggingNode } = draggingNodeRef
      const { value: droppingNode } = droppingNodeRef
      const { value: droppingPosition } = droppingPositionRef
      if (!draggingNode || !droppingNode || !droppingPosition) {
        return
      }
      // Bailout 1
      if (
        !props.allowDrop({
          node: droppingNode.rawNode,
          dropPosition: droppingPosition,
          phase: 'drag'
        })
      ) {
        return
      }
      // Bailout 2
      // 这是一个需要拦截的特殊情况：我们希望界面显示该状态，
      // 但不触发事件
      if (draggingNode.key === droppingNode.key) {
        return
      }
      // Bailout 3
      // 插入到下一个节点之前
      // 插入到上一个节点之后
      if (droppingPosition === 'before') {
        const nextNode = draggingNode.getNext({ includeDisabled: true })
        if (nextNode) {
          if (nextNode.key === droppingNode.key) {
            resetDropState()
            return
          }
        }
      }
      if (droppingPosition === 'after') {
        const prevNode = draggingNode.getPrev({ includeDisabled: true })
        if (prevNode) {
          if (prevNode.key === droppingNode.key) {
            resetDropState()
            return
          }
        }
      }

      doDrop({
        event,
        node: droppingNode.rawNode,
        dragNode: draggingNode.rawNode,
        dropPosition
      })
      resetDndState()
    }
    function handleScroll(): void {
      syncScrollbar()
    }
    function handleResize(): void {
      syncScrollbar()
    }
    function handleFocusout(e: FocusEvent): void {
      if (props.virtualScroll || props.internalScrollable) {
        const { value: scrollbarInst } = scrollbarInstRef
        if (scrollbarInst?.containerRef?.contains(e.relatedTarget as Element)) {
          return
        }
        pendingNodeKeyRef.value = null
      }
      else {
        const { value: selfEl } = selfElRef
        if (selfEl?.contains(e.relatedTarget as Element))
          return
        pendingNodeKeyRef.value = null
      }
    }
    watch(pendingNodeKeyRef, (value) => {
      if (value === null)
        return
      if (props.virtualScroll) {
        virtualListInstRef.value?.scrollTo({ key: value })
      }
      else if (props.internalScrollable) {
        const { value: scrollbarInst } = scrollbarInstRef
        if (scrollbarInst === null)
          return
        const targetEl = scrollbarInst.contentRef?.querySelector(
          `[data-key="${createDataKey(value)}"]`
        )
        if (!targetEl)
          return
        scrollbarInst.scrollTo({
          el: targetEl as any
        })
      }
    })
    provide(treeInjectionKey, {
      loadingKeysRef,
      highlightKeySetRef: mergedHighlightKeySetRef,
      displayedCheckedKeysRef,
      displayedIndeterminateKeysRef,
      mergedSelectedKeysRef,
      mergedExpandedKeysRef,
      mergedThemeRef: themeRef,
      mergedCheckStrategyRef,
      nodePropsRef: toRef(props, 'nodeProps'),
      disabledRef: toRef(props, 'disabled'),
      checkableRef: toRef(props, 'checkable'),
      selectableRef: toRef(props, 'selectable'),
      expandOnClickRef: toRef(props, 'expandOnClick'),
      onLoadRef: toRef(props, 'onLoad'),
      draggableRef: toRef(props, 'draggable'),
      blockLineRef: toRef(props, 'blockLine'),
      indentRef: toRef(props, 'indent'),
      cascadeRef: toRef(props, 'cascade'),
      checkOnClickRef: toRef(props, 'checkOnClick'),
      checkboxPlacementRef: props.checkboxPlacement,
      droppingMouseNodeRef,
      droppingNodeParentRef,
      draggingNodeRef,
      droppingPositionRef,
      droppingOffsetLevelRef,
      fNodesRef,
      pendingNodeKeyRef,
      showLineRef: toRef(props, 'showLine'),
      disabledFieldRef: toRef(props, 'disabledField'),
      internalScrollableRef: toRef(props, 'internalScrollable'),
      internalCheckboxFocusableRef: toRef(props, 'internalCheckboxFocusable'),
      internalTreeSelect: props.internalTreeSelect,
      renderLabelRef: toRef(props, 'renderLabel'),
      renderPrefixRef: toRef(props, 'renderPrefix'),
      renderSuffixRef: toRef(props, 'renderSuffix'),
      renderSwitcherIconRef: toRef(props, 'renderSwitcherIcon'),
      labelFieldRef: toRef(props, 'labelField'),
      multipleRef: toRef(props, 'multiple'),
      overrideDefaultNodeClickBehaviorRef: toRef(
        props,
        'overrideDefaultNodeClickBehavior'
      ),
      spinPropsRef: toRef(props, 'spinProps'),
      handleSwitcherClick,
      handleDragEnd,
      handleDragEnter,
      handleDragLeave,
      handleDragStart,
      handleDrop,
      handleDragOver,
      handleSelect,
      handleCheck
    })
    function scrollTo(
      options: VirtualListScrollToOptions | number,
      y?: number
    ): void {
      if (typeof options === 'number') {
        virtualListInstRef.value?.scrollTo(options, y || 0)
      }
      else {
        virtualListInstRef.value?.scrollTo(options)
      }
    }
    const exposedMethods: InternalTreeInst & TreeInst = {
      handleKeydown,
      scrollTo,
      getCheckedData: () => {
        if (!props.checkable)
          return { keys: [], options: [] }
        const { checkedKeys } = checkedStatusRef.value
        return {
          keys: checkedKeys,
          options: getOptionsByKeys(checkedKeys)
        }
      },
      getIndeterminateData: () => {
        if (!props.checkable)
          return { keys: [], options: [] }
        const { indeterminateKeys } = checkedStatusRef.value
        return {
          keys: indeterminateKeys,
          options: getOptionsByKeys(indeterminateKeys)
        }
      }
    }
    const cssVarsRef = computed(() => {
      const {
        common: { cubicBezierEaseInOut },
        self: {
          fontSize,
          nodeBorderRadius,
          nodeColorHover,
          nodeColorPressed,
          nodeColorActive,
          arrowColor,
          loadingColor,
          nodeTextColor,
          nodeTextColorDisabled,
          dropMarkColor,
          nodeWrapperPadding,
          nodeHeight,
          lineHeight,
          lineColor
        }
      } = themeRef.value
      const lineOffsetTop = getPadding(nodeWrapperPadding, 'top')
      const lineOffsetBottom = getPadding(nodeWrapperPadding, 'bottom')
      const nodeContentHeight = pxfy(
        depx(nodeHeight) - depx(lineOffsetTop) - depx(lineOffsetBottom)
      )
      return {
        '--n-arrow-color': arrowColor,
        '--n-loading-color': loadingColor,
        '--n-bezier': cubicBezierEaseInOut,
        '--n-font-size': fontSize,
        '--n-node-border-radius': nodeBorderRadius,
        '--n-node-color-active': nodeColorActive,
        '--n-node-color-hover': nodeColorHover,
        '--n-node-color-pressed': nodeColorPressed,
        '--n-node-text-color': nodeTextColor,
        '--n-node-text-color-disabled': nodeTextColorDisabled,
        '--n-drop-mark-color': dropMarkColor,
        '--n-node-wrapper-padding': nodeWrapperPadding,
        '--n-line-offset-top': `-${lineOffsetTop}`,
        '--n-line-offset-bottom': `-${lineOffsetBottom}`,
        '--n-node-content-height': nodeContentHeight,
        '--n-line-height': lineHeight,
        '--n-line-color': lineColor
      }
    })
    const themeClassHandle = inlineThemeDisabled
      ? useThemeClass('tree', undefined, cssVarsRef, props)
      : undefined
    return {
      ...exposedMethods,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedTheme: themeRef,
      mergedRenderEmpty: mergedRenderEmptyRef,
      rtlEnabled: rtlEnabledRef,
      fNodes: mergedFNodesRef,
      aip: aipRef,
      selfElRef,
      // 精简 dts：仅字符串 ref，类型在 render 中未使用
      virtualListInstRef: virtualListInstRef as unknown,
      scrollbarInstRef: scrollbarInstRef as unknown,
      handleFocusout,
      handleDragLeaveTree,
      handleScroll,
      getScrollContainer,
      getScrollContent,
      handleAfterEnter,
      handleResize,
      cssVars: inlineThemeDisabled
        ? undefined
        : (cssVarsRef as Ref<CSSProperties>),
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender
    }
  },
  render() {
    const { fNodes, internalRenderEmpty } = this
    if (!fNodes.length && internalRenderEmpty) {
      return internalRenderEmpty()
    }
    const {
      mergedClsPrefix,
      blockNode,
      blockLine,
      draggable,
      disabled,
      ellipsis,
      internalFocusable,
      checkable,
      handleKeydown,
      rtlEnabled,
      handleFocusout,
      scrollbarProps
    } = this
    const mergedFocusable = internalFocusable && !disabled
    const tabindex = mergedFocusable ? '0' : undefined
    const treeClass: Array<string | boolean | undefined> = [
      `${mergedClsPrefix}-tree`,
      rtlEnabled && `${mergedClsPrefix}-tree--rtl`,
      checkable && `${mergedClsPrefix}-tree--checkable`,
      (blockLine || blockNode) && `${mergedClsPrefix}-tree--block-node`,
      blockLine && `${mergedClsPrefix}-tree--block-line`,
      ellipsis && `${mergedClsPrefix}-tree--ellipsis`
    ]
    const createNode = (tmNode: TmNode | MotionData): VNode => {
      return '__motion' in tmNode ? (
        <MotionWrapper
          height={tmNode.height}
          nodes={tmNode.nodes}
          clsPrefix={mergedClsPrefix}
          mode={tmNode.mode}
          onAfterEnter={this.handleAfterEnter}
        />
      ) : (
        <NTreeNode
          key={tmNode.key}
          tmNode={tmNode}
          clsPrefix={mergedClsPrefix}
        />
      )
    }
    if (this.virtualScroll) {
      const { mergedTheme, internalScrollablePadding } = this
      const padding = getPadding(internalScrollablePadding || '0')
      return (
        <NxScrollbar
          {...scrollbarProps}
          ref="scrollbarInstRef"
          onDragleave={draggable ? this.handleDragLeaveTree : undefined}
          container={this.getScrollContainer}
          content={this.getScrollContent}
          class={treeClass}
          theme={mergedTheme.peers.Scrollbar}
          themeOverrides={mergedTheme.peerOverrides.Scrollbar}
          tabindex={tabindex}
          onKeydown={mergedFocusable ? handleKeydown : undefined}
          onFocusout={mergedFocusable ? handleFocusout : undefined}
        >
          {{
            default: () => {
              this.onRender?.()
              return !fNodes.length ? (
                resolveSlot(this.$slots.empty, () => {
                  return [
                    this.mergedRenderEmpty?.() || (
                      <NEmpty
                        class={`${mergedClsPrefix}-tree__empty`}
                        theme={this.mergedTheme.peers.Empty}
                        themeOverrides={this.mergedTheme.peerOverrides.Empty}
                      />
                    )
                  ]
                })
              ) : (
                <VVirtualList
                  ref="virtualListInstRef"
                  items={this.fNodes}
                  itemSize={depx(mergedTheme.self.nodeHeight)}
                  ignoreItemResize={this.aip}
                  paddingTop={padding.top}
                  paddingBottom={padding.bottom}
                  class={this.themeClass}
                  style={[
                    this.cssVars as CSSProperties,
                    {
                      paddingLeft: padding.left,
                      paddingRight: padding.right
                    }
                  ]}
                  onScroll={this.handleScroll}
                  onResize={this.handleResize}
                  showScrollbar={false}
                  itemResizable
                >
                  {{
                    default: ({ item }: { item: TmNode | MotionData }) =>
                      createNode(item)
                  }}
                </VVirtualList>
              )
            }
          }}
        </NxScrollbar>
      )
    }
    const { internalScrollable } = this
    treeClass.push(this.themeClass)
    this.onRender?.()
    if (internalScrollable) {
      return (
        <NxScrollbar
          {...scrollbarProps}
          class={treeClass}
          tabindex={tabindex}
          onKeydown={mergedFocusable ? handleKeydown : undefined}
          onFocusout={mergedFocusable ? handleFocusout : undefined}
          style={this.cssVars as CSSProperties}
          contentStyle={{ padding: this.internalScrollablePadding }}
        >
          {{
            default: () => (
              <div
                onDragleave={draggable ? this.handleDragLeaveTree : undefined}
                ref="selfElRef"
              >
                {this.fNodes.map(createNode)}
              </div>
            )
          }}
        </NxScrollbar>
      )
    }
    else {
      return (
        <div
          class={treeClass}
          tabindex={tabindex}
          ref="selfElRef"
          style={this.cssVars as CSSProperties}
          onKeydown={mergedFocusable ? handleKeydown : undefined}
          onFocusout={mergedFocusable ? handleFocusout : undefined}
          onDragleave={draggable ? this.handleDragLeaveTree : undefined}
        >
          {!fNodes.length
            ? resolveSlot(this.$slots.empty, () => {
                return [
                  this.mergedRenderEmpty?.() || (
                    <NEmpty
                      class={`${mergedClsPrefix}-tree__empty`}
                      theme={this.mergedTheme.peers.Empty}
                      themeOverrides={this.mergedTheme.peerOverrides.Empty}
                    />
                  )
                ]
              })
            : fNodes.map(createNode)}
        </div>
      )
    }
  }
})
