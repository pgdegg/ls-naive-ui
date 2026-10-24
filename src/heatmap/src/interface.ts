import type { HeatmapDataItem } from './public-types'

export interface DayRect extends HeatmapDataItem {
  color: string
  dayOfWeek: number // 0 = 周日
  rowIndex: number // 0 = 第一行，相对于 weekStartOn
  colIndex: number // 矩阵中的列索引
}
