export interface QuickInputOptions {
  type?: 'date' | 'time' | 'date-time'
  defaultToExtreme?: 'min' | 'max'
  referenceDate?: Date
}

export function parseQuickInput(
  input: string | undefined,
  options: QuickInputOptions = {}
): Date | undefined {
  if (
    !input?.trim()
    || /[^\d:\-/|. +_*@#$]/.test(input)
    || /\D{2,}|^\D|\D$/.test(input.trim())
  ) {
    return undefined
  }
  const {
    type = 'date',
    defaultToExtreme = 'min',
    referenceDate = new Date()
  } = options
  const max = defaultToExtreme === 'max'
  let tokens = input.trim().split(/\D+/).filter(Boolean)
  if (type === 'time') {
    if (tokens.length === 1 && tokens[0].length > 2) {
      if (tokens[0].length % 2)
        return undefined
      tokens = tokens[0].match(/.{2}/g) ?? []
    }
    if (
      !tokens.length
      || tokens.length > 3
      || tokens.some(token => token.length > 2)
    ) {
      return undefined
    }
    const [hours, minutes = max ? 59 : 0, seconds = max ? 59 : 0]
      = tokens.map(Number)
    if (hours > 23 || minutes > 59 || seconds > 59)
      return undefined
    const result = new Date(referenceDate)
    result.setHours(hours, minutes, seconds, max ? 999 : 0)
    return result
  }
  const first = tokens.shift()!
  let yearText: string
  if (first.length <= 4) {
    yearText = first
  }
  else {
    const shortYear
      = first.length === 6
        && Number(first.slice(2, 4)) >= 1
        && Number(first.slice(2, 4)) <= 12
    const yearLength = shortYear ? 2 : 4
    yearText = first.slice(0, yearLength)
    const rest = first.slice(yearLength)
    if (rest.length % 2)
      return undefined
    tokens.unshift(...(rest.match(/.{2}/g) ?? []))
  }
  if (yearText.length !== 2 && yearText.length !== 4)
    return undefined
  let year = Number(yearText)
  if (yearText.length === 2)
    year += year > 68 ? 1900 : 2000
  tokens = tokens.flatMap(token =>
    token.length > 2 && token.length % 2 === 0 ? token.match(/.{2}/g)! : [token]
  )
  if (
    tokens.some(token => token.length > 2)
    || tokens.length > (type === 'date' ? 2 : 5)
  ) {
    return undefined
  }
  const [
    month = max ? 12 : 1,
    day,
    hours = max ? 23 : 0,
    minutes = max ? 59 : 0,
    seconds = max ? 59 : 0
  ] = tokens.map(Number)
  if (month < 1 || month > 12 || hours > 23 || minutes > 59 || seconds > 59)
    return undefined
  const lastDay = new Date(year, month, 0).getDate()
  const resolvedDay = day ?? (max ? lastDay : 1)
  if (resolvedDay < 1 || resolvedDay > lastDay)
    return undefined
  const result = new Date(0)
  result.setFullYear(year, month - 1, resolvedDay)
  result.setHours(hours, minutes, seconds, max ? 999 : 0)
  return result
}
