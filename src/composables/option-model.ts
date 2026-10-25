export interface OptionModelAdapterOptions {
  options?: readonly Record<string, unknown>[]
  valueKey?: string
  valueField?: string
  labelField?: string
  multiple?: boolean
}
export function createOptionModelAdapter(
  source: () => OptionModelAdapterOptions
) {
  const itemValue = (item: unknown, key?: string) =>
    key && item && typeof item === 'object'
      ? ((item as Record<string, unknown>)[key] ?? item)
      : item
  return {
    decode(model: unknown): unknown {
      const { valueKey, multiple } = source()
      return multiple
        ? Array.isArray(model)
          ? model.map(item => itemValue(item, valueKey))
          : []
        : itemValue(model, valueKey)
    },
    encode(value: unknown): unknown {
      const { valueKey, options, multiple } = source()
      const resolve = (value: unknown) =>
        valueKey
          ? (options?.find(
              item => item[valueKey] === itemValue(value, valueKey)
            ) ?? value)
          : value
      return multiple
        ? Array.isArray(value)
          ? value.map(resolve)
          : []
        : resolve(value)
    },
    labels(value: unknown): unknown {
      const {
        options,
        valueField = 'value',
        valueKey,
        labelField = 'label',
        multiple
      } = source()
      const label = (value: unknown) =>
        options?.find(
          item => item[valueKey ?? valueField] === itemValue(value, valueKey)
        )?.[labelField] ?? value
      return multiple && Array.isArray(value) ? value.map(label) : label(value)
    },
    defaults(field: string | number): unknown {
      const { options, multiple, valueKey, valueField = 'value' } = source()
      const matched
        = options?.filter(
          item =>
            !item.disabled
            && item.visible !== false
            && (item[field] === true || item[field] === 1)
        ) ?? []
      const values = matched.map(item => (valueKey ? item : item[valueField]))
      return multiple ? values : values[0]
    }
  }
}
