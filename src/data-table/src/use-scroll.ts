import type { ComputedRef, Ref } from 'vue'
import type {
  ColumnKey,
  DataTableSetupProps,
  MainTableRef,
  TableColumn
} from './interface'
import { beforeNextFrameOnce } from 'seemly'
import { computed, nextTick, ref, watch } from 'vue'
import { formatLength } from '../../_utils'
import { getColKey, getNumberColWidth } from './utils'

type ScrollSyncSource = 'head' | 'body' | 'layout'

export function useScroll(
  props: DataTableSetupProps,
  {
    mainTableInstRef,
    mergedCurrentPageRef,
    bodyWidthRef,
    maxHeightRef,
    mergedTableLayoutRef,
    mergedEmptyRef
  }: {
    maxHeightRef: Ref<string | number | undefined>
    bodyWidthRef: Ref<null | number>
    mainTableInstRef: Ref<MainTableRef | null>
    mergedCurrentPageRef: ComputedRef<number>
    mergedTableLayoutRef: Ref<'auto' | 'fixed'>
    mergedEmptyRef: ComputedRef<boolean>
  }
) {
  const explicitlyScrollableRef = computed(
    () =>
      props.scrollX !== undefined
      || maxHeightRef.value !== undefined
      || props.flexHeight
  )
  const xScrollableRef = computed(() => {
    // 对于内容可能溢出的 auto 布局基础表格，我们会
    // 将其设为可滚动，这与浏览器的原生行为不同。
    // 原生行为参见
    // https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
    const isBasicAutoLayout
      = !explicitlyScrollableRef.value && mergedTableLayoutRef.value === 'auto'
    return props.scrollX !== undefined || isBasicAutoLayout
  })

  let lastScrollLeft = 0
  const scrollPartRef = ref<'head' | 'body' | undefined>()
  const leftActiveFixedColKeyRef = ref<ColumnKey | null>(null)
  const leftActiveFixedChildrenColKeysRef = ref<ColumnKey[]>([])
  const rightActiveFixedColKeyRef = ref<ColumnKey | null>(null)
  const rightActiveFixedChildrenColKeysRef = ref<ColumnKey[]>([])
  const styleScrollXRef = computed(() => {
    return formatLength(props.scrollX)
  })
  const leftFixedColumnsRef = computed(() => {
    return props.columns.filter(column => column.fixed === 'left')
  })
  const rightFixedColumnsRef = computed(() => {
    return props.columns.filter(column => column.fixed === 'right')
  })
  const fixedColumnLeftMapRef = computed(() => {
    const columns: Record<
      ColumnKey,
      { start: number, end: number } | undefined
    > = {}
    let left = 0
    function traverse(cols: TableColumn[]): void {
      cols.forEach((col) => {
        const positionInfo = { start: left, end: 0 }
        columns[getColKey(col)] = positionInfo
        if ('children' in col) {
          traverse(col.children)
          positionInfo.end = left
        }
        else {
          left += getNumberColWidth(col) || 0
          positionInfo.end = left
        }
      })
    }
    traverse(leftFixedColumnsRef.value)
    return columns
  })
  const fixedColumnRightMapRef = computed(() => {
    const columns: Record<
      ColumnKey,
      { start: number, end: number } | undefined
    > = {}
    let right = 0
    function traverse(cols: TableColumn[]): void {
      for (let i = cols.length - 1; i >= 0; --i) {
        const col = cols[i]
        const positionInfo = { start: right, end: 0 }
        columns[getColKey(col)] = positionInfo
        if ('children' in col) {
          traverse(col.children)
          positionInfo.end = right
        }
        else {
          right += getNumberColWidth(col) || 0
          positionInfo.end = right
        }
      }
    }
    traverse(rightFixedColumnsRef.value)
    return columns
  })
  function deriveActiveLeftFixedColumn(): void {
    // 目标是表头元素
    const { value: leftFixedColumns } = leftFixedColumnsRef
    let leftWidth = 0
    const { value: fixedColumnLeftMap } = fixedColumnLeftMapRef
    let leftActiveFixedColKey: string | number | null = null
    for (let i = 0; i < leftFixedColumns.length; ++i) {
      const key = getColKey(leftFixedColumns[i])
      if (lastScrollLeft > (fixedColumnLeftMap[key]?.start || 0) - leftWidth) {
        leftActiveFixedColKey = key
        leftWidth = fixedColumnLeftMap[key]?.end || 0
      }
      else {
        break
      }
    }
    leftActiveFixedColKeyRef.value = leftActiveFixedColKey
  }
  function deriveActiveLeftFixedChildrenColumns(): void {
    leftActiveFixedChildrenColKeysRef.value = []
    let activeLeftFixedColumn = props.columns.find(
      col => getColKey(col) === leftActiveFixedColKeyRef.value
    )
    while (activeLeftFixedColumn && 'children' in activeLeftFixedColumn) {
      const length: number = activeLeftFixedColumn.children.length
      if (length === 0)
        break
      const nextActiveLeftFixedColumn
        = activeLeftFixedColumn.children[length - 1]
      leftActiveFixedChildrenColKeysRef.value.push(
        getColKey(nextActiveLeftFixedColumn)
      )
      activeLeftFixedColumn = nextActiveLeftFixedColumn
    }
  }
  function deriveActiveRightFixedColumn(): void {
    // 目标是表头元素
    const { value: rightFixedColumns } = rightFixedColumnsRef
    const scrollWidth = Number(props.scrollX)
    const { value: tableWidth } = bodyWidthRef
    if (tableWidth === null)
      return
    let rightWidth = 0
    let rightActiveFixedColKey: string | number | null = null
    const { value: fixedColumnRightMap } = fixedColumnRightMapRef
    for (let i = rightFixedColumns.length - 1; i >= 0; --i) {
      const key = getColKey(rightFixedColumns[i])
      if (
        Math.round(
          lastScrollLeft
          + (fixedColumnRightMap[key]?.start || 0)
          + tableWidth
          - rightWidth
        ) < scrollWidth
      ) {
        rightActiveFixedColKey = key
        rightWidth = fixedColumnRightMap[key]?.end || 0
      }
      else {
        break
      }
    }
    rightActiveFixedColKeyRef.value = rightActiveFixedColKey
  }
  function deriveActiveRightFixedChildrenColumns(): void {
    rightActiveFixedChildrenColKeysRef.value = []
    let activeRightFixedColumn = props.columns.find(
      col => getColKey(col) === rightActiveFixedColKeyRef.value
    )
    while (
      activeRightFixedColumn
      && 'children' in activeRightFixedColumn
      && activeRightFixedColumn.children.length
    ) {
      const nextActiveRightFixedColumn = activeRightFixedColumn.children[0]
      rightActiveFixedChildrenColKeysRef.value.push(
        getColKey(nextActiveRightFixedColumn)
      )
      activeRightFixedColumn = nextActiveRightFixedColumn
    }
  }

  function getScrollElements(): {
    header: HTMLElement | null
    body: HTMLElement | null
  } {
    const header = mainTableInstRef.value
      ? mainTableInstRef.value.getHeaderElement()
      : null
    const body = mainTableInstRef.value
      ? mainTableInstRef.value.getBodyElement()
      : null
    return {
      header,
      body
    }
  }
  function scrollMainTableBodyToTop(): void {
    const { body } = getScrollElements()
    if (body) {
      body.scrollTop = 0
    }
  }
  function handleTableHeaderScroll(): void {
    if (scrollPartRef.value !== 'body') {
      beforeNextFrameOnce(syncScrollState, 'head')
    }
    else {
      scrollPartRef.value = undefined
    }
  }
  function handleTableBodyScroll(e: Event): void {
    props.onScroll?.(e)
    if (scrollPartRef.value !== 'head') {
      beforeNextFrameOnce(syncScrollState, 'body')
    }
    else {
      scrollPartRef.value = undefined
    }
  }
  function syncScrollState(source: ScrollSyncSource): void {
    // 我们不能简单地用 props.scrollX 来判断表格是否
    // 需要同步，因为用户可能为每一列设置列宽。
    // 顺其自然即可，基础表格不会触发滚动监听器。
    const { header, body } = getScrollElements()
    if (!body)
      return
    if (source === 'layout') {
      // body 可能重新挂载（例如空数据时虚拟列表被禁用）或收缩。
      // 保留已存储的横向滚动位置，而不是把新 body 的 0 当作用户
      // 输入，否则会重置独立的表头。
      if (header) {
        header.scrollLeft = lastScrollLeft
      }
      body.scrollLeft = lastScrollLeft
    }
    else if (header) {
      if (source === 'head') {
        lastScrollLeft = header.scrollLeft
        body.scrollLeft = lastScrollLeft
        scrollPartRef.value = 'head'
      }
      else if (source === 'body') {
        lastScrollLeft = body.scrollLeft
        header.scrollLeft = lastScrollLeft
        scrollPartRef.value = 'body'
      }
      else {
        // 我们需要处理过度滚动（overscroll）
        const directionHead = lastScrollLeft - header.scrollLeft
        scrollPartRef.value = directionHead !== 0 ? 'head' : 'body'
        if (scrollPartRef.value === 'head') {
          lastScrollLeft = header.scrollLeft
          body.scrollLeft = lastScrollLeft
        }
        else {
          lastScrollLeft = body.scrollLeft
          header.scrollLeft = lastScrollLeft
        }
      }
    }
    else if (source !== 'head') {
      lastScrollLeft = body.scrollLeft
    }
    const { value: tableWidth } = bodyWidthRef
    if (tableWidth === null)
      return
    deriveActiveLeftFixedColumn()
    deriveActiveLeftFixedChildrenColumns()
    deriveActiveRightFixedColumn()
    deriveActiveRightFixedChildrenColumns()
  }
  function setHeaderScrollLeft(left: number): void {
    const { header } = getScrollElements()
    if (!header)
      return
    header.scrollLeft = left
    lastScrollLeft = left
    syncScrollState('head')
  }
  watch(mergedCurrentPageRef, () => {
    scrollMainTableBodyToTop()
  })
  watch([() => props.virtualScroll, mergedEmptyRef], () => {
    void nextTick(() => {
      syncScrollState('layout')
    })
  })
  return {
    styleScrollXRef,
    fixedColumnLeftMapRef,
    fixedColumnRightMapRef,
    leftFixedColumnsRef,
    rightFixedColumnsRef,
    leftActiveFixedColKeyRef,
    leftActiveFixedChildrenColKeysRef,
    rightActiveFixedColKeyRef,
    rightActiveFixedChildrenColKeysRef,
    syncScrollState,
    handleTableBodyScroll,
    handleTableHeaderScroll,
    setHeaderScrollLeft,
    explicitlyScrollableRef,
    xScrollableRef
  }
}
