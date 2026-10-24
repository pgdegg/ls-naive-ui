import type { ComputedRef } from 'vue'
import type {
  ColumnKey,
  CompareFn,
  DataTableSetupProps,
  InternalRowData,
  OnUpdateSorterImpl,
  SortOrder,
  SortState,
  TableBaseColumn,
  TableExpandColumn,
  TableSelectionColumn,
  TmNode
} from './interface'
import { computed, ref } from 'vue'
import { call } from '../../_utils'
import { getFlagOfOrder } from './utils'

function getMultiplePriority(
  sorter: TableBaseColumn['sorter']
): number | false {
  if (typeof sorter === 'object' && typeof sorter.multiple === 'number') {
    return sorter.multiple
  }
  return false
}

function getSortFunction(
  sorter: TableBaseColumn['sorter'],
  columnKey: ColumnKey
): CompareFn | false {
  if (
    columnKey
    && (sorter === undefined
      || sorter === 'default'
      || (typeof sorter === 'object' && sorter.compare === 'default'))
  ) {
    return getDefaultSorterFn(columnKey)
  }
  if (typeof sorter === 'function') {
    return sorter
  }
  if (
    sorter
    && typeof sorter === 'object'
    && sorter.compare
    && sorter.compare !== 'default'
  ) {
    return sorter.compare
  }
  return false
}

function getDefaultSorterFn(
  columnKey: ColumnKey
): (row1: InternalRowData, row2: InternalRowData) => number {
  return (row1: InternalRowData, row2: InternalRowData) => {
    const value1 = row1[columnKey]
    const value2 = row2[columnKey]

    if (value1 === null || value1 === undefined) {
      if (value2 === null || value2 === undefined)
        return 0
      return -1
    }
    else if (value2 === null || value2 === undefined) {
      return 1
    }
    else if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value1 - value2
    }
    else if (typeof value1 === 'string' && typeof value2 === 'string') {
      return value1.localeCompare(value2)
    }
    return 0
  }
}

export function useSorter(
  props: DataTableSetupProps,
  {
    dataRelatedColsRef,
    filteredDataRef
  }: {
    dataRelatedColsRef: ComputedRef<
      Array<TableSelectionColumn | TableBaseColumn | TableExpandColumn>
    >
    filteredDataRef: ComputedRef<TmNode[]>
  }
) {
  const defaultSortState: SortState[] = []

  // 初始化
  dataRelatedColsRef.value.forEach((column) => {
    if (column.sorter !== undefined) {
      updateSortStatesByNewSortState(defaultSortState, {
        columnKey: column.key,
        sorter: column.sorter,
        order: column.defaultSortOrder ?? false
      })
    }
  })

  const uncontrolledSortStateRef = ref<SortState | SortState[] | null>(
    defaultSortState
  )
  const mergedSortStateRef = computed(() => {
    // 如果某一列的 sortOrder 为 false、'ascend' 或 'descend'，
    // 表格的排序功能将以受控方式工作。
    const columnsWithControlledSortOrder = dataRelatedColsRef.value.filter(
      column =>
        column.type !== 'selection'
        && column.sorter !== undefined
        && (column.sortOrder === 'ascend'
          || column.sortOrder === 'descend'
          || column.sortOrder === false)
    )
    // 如果有多列处于受控排序状态，我们需要找出 sortOrder 处于激活状态的列
    const columnToSort: TableBaseColumn[] | undefined = (
      columnsWithControlledSortOrder as TableBaseColumn[]
    ).filter((col: TableBaseColumn) => col.sortOrder !== false)
    if (columnToSort.length) {
      return columnToSort.map((column) => {
        return {
          columnKey: column.key,
          // 待排序列使用受控排序器
          // sorter 和 sort order 不会为 undefined
          order: column.sortOrder!,
          sorter: column.sorter!
        }
      })
    }
    // 如果有任何一列处于受控模式，表格的排序状态就处于
    // 受控模式
    if (columnsWithControlledSortOrder.length)
      return []
    const { value: uncontrolledSortState } = uncontrolledSortStateRef
    if (Array.isArray(uncontrolledSortState)) {
      return uncontrolledSortState
    }
    else if (uncontrolledSortState) {
      return [uncontrolledSortState]
    }
    else {
      return []
    }
  })
  const sortedDataRef = computed<TmNode[]>(() => {
    const activeSorters = mergedSortStateRef.value.slice().sort((a, b) => {
      const item1Priority = getMultiplePriority(a.sorter) || 0
      const item2Priority = getMultiplePriority(b.sorter) || 0
      return item2Priority - item1Priority
    })
    if (activeSorters.length) {
      const filteredData = filteredDataRef.value.slice()
      return filteredData.sort((tmNode1, tmNode2) => {
        let compareResult = 0
        activeSorters.some((sorterState) => {
          const { columnKey, sorter, order } = sorterState

          const compareFn = getSortFunction(sorter, columnKey)
          if (compareFn && order) {
            compareResult = compareFn(tmNode1.rawNode, tmNode2.rawNode)

            if (compareResult !== 0) {
              compareResult = compareResult * getFlagOfOrder(order)
              return true
            }
          }
          return false
        })
        return compareResult
      })
    }
    return filteredDataRef.value
  })

  function getUpdatedSorterState(
    sortState: SortState | null
  ): SortState | SortState[] | null {
    let currentSortState = mergedSortStateRef.value.slice()
    // 多列排序（当你点击了一个支持多列排序的列时）
    if (sortState && getMultiplePriority(sortState.sorter) !== false) {
      // 清除非多列排序的列
      currentSortState = currentSortState.filter(
        sortState => getMultiplePriority(sortState.sorter) !== false
      )
      updateSortStatesByNewSortState(currentSortState, sortState)
      return currentSortState
    }
    else if (sortState) {
      // 单列排序
      return sortState
    }
    // 无排序
    return null
  }

  function deriveNextSorter(sortState: SortState | null): void {
    const nextSorterState: SortState | SortState[] | null
      = getUpdatedSorterState(sortState)
    doUpdateSorter(nextSorterState)
  }

  function doUpdateSorter(sortState: SortState | SortState[] | null): void {
    const {
      'onUpdate:sorter': _onUpdateSorter,
      onUpdateSorter,
      onSorterChange
    } = props

    if (_onUpdateSorter) {
      call(_onUpdateSorter as OnUpdateSorterImpl, sortState)
    }
    if (onUpdateSorter) {
      call(onUpdateSorter as OnUpdateSorterImpl, sortState)
    }
    if (onSorterChange) {
      call(onSorterChange as OnUpdateSorterImpl, sortState)
    }
    uncontrolledSortStateRef.value = sortState
  }

  function sort(columnKey: ColumnKey, order: SortOrder = 'ascend'): void {
    if (!columnKey) {
      clearSorter()
    }
    else {
      const columnToSort = dataRelatedColsRef.value.find(
        column =>
          column.type !== 'selection'
          && column.type !== 'expand'
          && column.key === columnKey
      )
      if (!columnToSort?.sorter)
        return
      const sorter = columnToSort.sorter
      deriveNextSorter({
        columnKey,
        sorter,
        order
      })
    }
  }

  function clearSorter(): void {
    doUpdateSorter(null)
  }

  function updateSortStatesByNewSortState(
    sortStates: SortState[],
    sortState: SortState
  ): void {
    const index = sortStates.findIndex(
      state => sortState?.columnKey && state.columnKey === sortState.columnKey
    )
    if (index !== undefined && index >= 0) {
      sortStates[index] = sortState
    }
    else {
      sortStates.push(sortState)
    }
  }

  return {
    clearSorter,
    sort,
    sortedDataRef,
    mergedSortStateRef,
    deriveNextSorter
  }
}
