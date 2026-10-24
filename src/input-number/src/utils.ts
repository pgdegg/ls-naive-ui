// string => string（预期，未实现）
// string => number（遗留）
export function parse(value: string): number | null {
  if (
    value === undefined
    || value === null
    || (typeof value === 'string' && value.trim() === '')
  ) {
    return null
  }
  return Number(value)
}

// 此函数为 `update-value-on-input` prop 而创建。当该 prop 为
// true 时，输入值会同时更新 value 和 <input /> 的 value。所以我
// 们需要确保在某些情况下，用户输入的内容不会被其解析值替换。例如
// '0.' 会被解析并替换为 '0'，'-0' 会被解析并替换为 '0'，因为用户
// 之后可能输入 '-0.1'。
export function isWipValue(value: string): boolean {
  return (
    (value.includes('.')
      && (/^(-)?\d+.*(\.|0)$/.test(value) || /^-?\d*$/.test(value)))
    || value === '-'
    || value === '-0'
  )
}

// string => boolean（预期，未实现）
// number => boolean（遗留）
export function validator(value: number | null): boolean {
  if (value === undefined || value === null)
    return true
  if (Number.isNaN(value))
    return false
  return true
}

// string => string（预期，未实现）
// number => string（遗留）
export function format(
  value: number | undefined | null,
  precision: number | undefined
): string {
  if (typeof value !== 'number')
    return ''
  return precision === undefined ? String(value) : value.toFixed(precision)
}

export function parseNumber(
  number: number | null | undefined | string
): number | null {
  if (number === null)
    return null
  if (typeof number === 'number') {
    return number
  }
  else {
    const parsedNumber = Number(number)
    if (Number.isNaN(parsedNumber)) {
      return null
    }
    else {
      return parsedNumber
    }
  }
}
