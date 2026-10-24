import type { DayRect } from '../interface'
import type {
  HeatmapData,
  HeatmapDataItem,
  HeatmapFirstDayOfWeek
} from '../public-types'
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfWeek,
  endOfYear,
  getDay,
  isWithinInterval,
  startOfDay,
  startOfWeek,
  startOfYear,
  subYears
} from 'date-fns'
import { groupBy } from 'lodash-es'

/** 根据 value/maxValue 获取颜色 */
export function calcColorByValue(
  colors: string[],
  value: number | null | undefined,
  maxValue: number
): string {
  if (maxValue === 0 || value === null || value === undefined || value <= 0) {
    return colors[0]
  }

  const ratio = Math.min(value / maxValue, 1)
  const maxLevel = colors.length - 1
  const level = Math.min(Math.ceil(ratio * maxLevel), maxLevel)

  return colors[level]
}

/**
 * 为给定数据填补空缺
 *
 * 用值 `0` 填补 `[firstDate,lastDate]` 之间的空缺
 *
 * 默认用值 `null` 填补 `[firstCalendarDate,firstDate]` 和 `[lastDate,lastCalendarDate]`
 *
 * 当 `fillCalendarLeading` 为 `true` 时，用值 `0` 填补 `[firstCalendarDate,firstDate]`
 */
export function completeDataGaps(
  data: HeatmapData,
  firstDayOfWeek: HeatmapFirstDayOfWeek,
  fillCalendarLeading: boolean
): HeatmapData {
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp)
  const firstDate = sortedData[0].timestamp
  const lastDate = sortedData[sortedData.length - 1].timestamp

  const firstCalendarDate = startOfWeek(firstDate, {
    weekStartsOn: firstDayOfWeek
  })
  const lastCalendarEndDate = endOfWeek(lastDate, {
    weekStartsOn: firstDayOfWeek
  })

  const dataMap = new Map(
    sortedData.map(d => [startOfDay(d.timestamp).getTime(), d])
  )

  const allCalendarDates = eachDayOfInterval({
    start: firstCalendarDate,
    end: lastCalendarEndDate
  })

  const startDate = fillCalendarLeading ? firstCalendarDate : firstDate
  return allCalendarDates.map((date) => {
    const key = startOfDay(date).getTime()
    const dateValue = dataMap.get(key)

    if (dateValue) {
      return dateValue
    }

    const value = isWithinInterval(date, { start: startDate, end: lastDate })
      ? 0
      : null

    return { timestamp: date.getTime(), value }
  })
}

/**
 * 创建带位置信息的 DayRect 对象
 */
export function createDayRect(
  item: HeatmapDataItem,
  calendarStartDate: number,
  weekStartOn: number,
  colors: string[],
  maxValue: number
): DayRect {
  const daysFromGridStart = differenceInCalendarDays(
    item.timestamp,
    calendarStartDate
  )

  const colIndex = Math.floor(daysFromGridStart / 7)
  const dayOfWeek = getDay(item.timestamp)
  const rowIndex = (dayOfWeek - weekStartOn + 7) % 7

  return {
    timestamp: item.timestamp,
    value: item.value,
    color: calcColorByValue(colors, item.value, maxValue),
    dayOfWeek,
    rowIndex,
    colIndex
  }
}

/**
 * 根据带位置信息的条目创建稀疏矩阵
 */
export function createSparseMatrix<T>(
  rows: number,
  items: T[],
  getRowIndex: (item: T) => number,
  getColIndex: (item: T) => number
): T[][] {
  const groupedByRow = groupBy(items, getRowIndex)

  return Array.from({ length: rows }, (_, rowIndex) => {
    const rowData = groupedByRow[rowIndex] || []
    const row: T[] = []
    rowData.forEach((item) => {
      row[getColIndex(item)] = item
    })
    return row
  })
}

/**
 * 创建一个 7x53 的矩阵（典型的年度布局），其中填充 loading 单元格
 */
export function createLoadingMatrix(
  firstDayOfWeek: HeatmapFirstDayOfWeek
): DayRect[][] {
  const rows = 7
  const cols = 53
  const currentTimestamp = Date.now()

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      timestamp: currentTimestamp,
      value: 0,
      color: '#000000',
      dayOfWeek: (firstDayOfWeek + row) % 7,
      rowIndex: row,
      colIndex: col
    })))
}

/**
 * 生成用于 mock 的 heatmap 数据。
 * 此函数生成随机数据，结果不稳定。
 * @param range - 传入 'recent' 表示最近一年，或传入具体的年份数字
 */
export function heatmapMockData(year?: 'recent' | number): HeatmapData {
  let start: Date
  let end: Date

  if (year === undefined || year === 'recent') {
    end = new Date()
    start = subYears(end, 1)
  }
  else {
    const _year = Number(year)
    start = startOfYear(new Date(_year, 0, 1))
    end = endOfYear(new Date(_year, 11, 31))
  }

  const allDays = eachDayOfInterval({ start, end })

  return allDays.map((day) => {
    const dayOfWeek = day.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    if (isWeekend && Math.random() < 0.7) {
      return { timestamp: day.getTime(), value: 0 }
    }

    if (!isWeekend && Math.random() < 0.15) {
      return { timestamp: day.getTime(), value: 0 }
    }

    const value = Math.floor(Math.random() ** 2 * 40) + 1

    return { timestamp: day.getTime(), value }
  })
}
