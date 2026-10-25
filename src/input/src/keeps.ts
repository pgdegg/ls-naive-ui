export type InputKeeps = string | RegExp | Array<string | RegExp>

export function buildKeepRegExp(
  rules?: InputKeeps,
  ignore?: string | string[]
): RegExp | null {
  if (!rules)
    return null
  const sets: string[] = []
  const patterns: string[] = []
  for (const rule of Array.isArray(rules) ? rules : [rules]) {
    if (rule instanceof RegExp) {
      patterns.push(rule.source)
    }
    else if (
      ['a-z', 'A-Z', '0-9', 'a-zA-Z', 'a-z0-9', 'A-Z0-9', 'a-zA-Z0-9'].includes(
        rule
      )
    ) {
      sets.push(rule)
    }
    else {
      sets.push(rule.replace(/[-\\^\][]/g, '\\$&'))
    }
  }
  for (const literal of ignore === undefined
    ? []
    : Array.isArray(ignore)
      ? ignore
      : [ignore]) {
    sets.push(literal.replace(/[-\\^\][]/g, '\\$&'))
  }
  if (!sets.length && !patterns.length)
    return null
  if (!patterns.length)
    return new RegExp(`[^${sets.join('')}]`, 'g')
  return new RegExp(
    `(?!${[...(sets.length ? [`[${sets.join('')}]`] : []), ...patterns.map(pattern => `(?:${pattern})`)].join('|')})[\\s\\S]`,
    'g'
  )
}
