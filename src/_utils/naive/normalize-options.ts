export function normalizeOptions<T extends object>(
  options: Array<T | string | number>,
  labelField: string,
  valueField: string
): T[] {
  if (!options.some(option => typeof option !== 'object'))
    return options as T[]
  const seen = new Set<string | number>()
  const normalized: T[] = []
  for (const option of options) {
    if (typeof option === 'string' || typeof option === 'number') {
      if (seen.has(option))
        continue
      seen.add(option)
      normalized.push({
        [labelField]: String(option),
        [valueField]: option
      } as T)
    }
    else {
      normalized.push(option)
    }
  }
  return normalized
}
