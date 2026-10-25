import type { CascaderModelNode } from '../cascader-model'
import { buildKeepRegExp } from '../../input/src/keeps'
import { createCascaderModelAdapter } from '../cascader-model'
import { createOptionModelAdapter } from '../option-model'
import { parseQuickInput } from '../quick-input'

describe('hIS model adapters', () => {
  it('preserves object models, zero-valued options and default flags', () => {
    const options = [
      { id: 0, name: 'Zero', selected: 1 },
      { id: 'a', name: 'Alpha', selected: true },
      { id: 'b', disabled: true, selected: true }
    ]
    const adapter = createOptionModelAdapter(() => ({
      options,
      valueKey: 'id',
      labelField: 'name',
      multiple: true
    }))
    expect(adapter.decode([options[0], options[1]])).toEqual([0, 'a'])
    expect(adapter.encode([0, 'a'])).toEqual([options[0], options[1]])
    expect(adapter.labels([0, 'a'])).toEqual(['Zero', 'Alpha'])
    expect(adapter.defaults('selected')).toEqual([options[0], options[1]])
  })
  it('encodes cascader path objects and removes nested children', () => {
    const parent: CascaderModelNode = {
      data: { id: 0, label: 'Parent', children: [] },
      value: 0,
      label: 'Parent',
      text: 'Parent',
      pathNodes: []
    }
    const child: CascaderModelNode = {
      data: { id: false, label: 'Child' },
      value: false,
      label: 'Child',
      text: 'Parent / Child',
      pathNodes: [parent]
    }
    child.pathNodes.push(child)
    const objectAdapter = createCascaderModelAdapter(() => ({
      valueKey: 'id',
      bindPath: true
    }))
    expect(objectAdapter.encode([0, false], [child])).toEqual([
      { id: 0, label: 'Parent' },
      { id: false, label: 'Child' }
    ])
    const primitiveAdapter = createCascaderModelAdapter(() => ({
      bindPath: true
    }))
    expect(primitiveAdapter.encode([0, false], [child])).toEqual([0, false])
    const fieldsAdapter = createCascaderModelAdapter(() => ({
      middleFields: ['first', 'second']
    }))
    expect(fieldsAdapter.encode(false, [child])).toEqual({
      first: 0,
      second: false
    })
  })
  it('filters retained characters and escapes literal brackets', () => {
    expect('abc[12]'.replace(buildKeepRegExp('0-9', '[]')!, '')).toBe('[12]')
    expect(
      'abc中国123'.replace(buildKeepRegExp([/[\u4E00-\u9FFF]/, '0-9'])!, '')
    ).toBe('中国123')
  })
  it.each([
    ['20261009', 'date', 'min', [2026, 9, 9, 0, 0, 0]],
    ['2026/2', 'date', 'max', [2026, 1, 28, 23, 59, 59]],
    ['2024', 'date', 'max', [2024, 11, 31, 23, 59, 59]],
    ['202610091230', 'date-time', 'min', [2026, 9, 9, 12, 30, 0]],
    ['261231', 'date', 'min', [2026, 11, 31, 0, 0, 0]]
  ] as const)(
    'parses quick input %s',
    (input, type, defaultToExtreme, expected) => {
      const date = parseQuickInput(input, { type, defaultToExtreme })!
      expect([
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ]).toEqual(expected)
    }
  )
  it.each(['20260230', '20261301', 'garbage', '12345'])(
    'rejects invalid date %s',
    (input) => {
      expect(parseQuickInput(input, { type: 'date' })).toBeUndefined()
    }
  )
  it('keeps time on the supplied calendar date', () => {
    const date = parseQuickInput('1230', {
      type: 'time',
      referenceDate: new Date(2026, 9, 24)
    })!
    expect([date.getDate(), date.getHours(), date.getMinutes()]).toEqual([
      24,
      12,
      30
    ])
    expect(parseQuickInput('25', { type: 'time' })).toBeUndefined()
  })
})
