import { omit } from 'lodash-es'

export interface CascaderModelNode {
  data: Record<string, unknown>
  value: unknown
  label: unknown
  text: string
  pathNodes: CascaderModelNode[]
}
type CascaderNode = CascaderModelNode
export interface CascaderModelAdapterOptions {
  valueKey?: string
  childrenKey?: string
  labelKey?: string
  multiple?: boolean
  bindPath?: boolean
  labelPath?: 'all' | 'radio'
  middleFields?: readonly string[]
  inlinePlaceholder?: boolean
  separator?: string
}
function field(value: unknown, key: string) {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)[key]
    : undefined
}
export function createCascaderModelAdapter(
  source: () => CascaderModelAdapterOptions
) {
  const nodeValue = (node: CascaderNode) =>
    omit(node.data, [source().childrenKey ?? 'children'])
  return {
    decode(value: unknown): unknown {
      const options = source()
      const key
        = options.middleFields?.[options.middleFields.length - 1]
          ?? options.valueKey
      if (options.bindPath) {
        return options.valueKey && Array.isArray(value)
          ? value.map(item => field(item, options.valueKey!))
          : value
      }
      if (!key)
        return value
      if (options.middleFields) {
        const nested = field(value, key)
        return options.valueKey ? field(nested, options.valueKey) : nested
      }
      return options.multiple && Array.isArray(value)
        ? value.map(item => field(item, key))
        : field(value, key)
    },
    encode(value: unknown, nodes: CascaderNode[]): unknown {
      const options = source()
      if (options.bindPath) {
        if (options.valueKey && nodes[0])
          return nodes[0].pathNodes.map(nodeValue)
        return Array.isArray(value)
          ? value.filter(item => item != null)
          : value
      }
      if (options.middleFields) {
        if (!nodes[0])
          return null
        const result: Record<string, unknown> = {}
        nodes[0].pathNodes.forEach((node, index) => {
          const key = options.middleFields?.[index]
          if (key)
            result[key] = options.valueKey ? nodeValue(node) : node.value
        })
        return result
      }
      if (!options.valueKey)
        return value
      const values = nodes.map(nodeValue)
      return options.multiple || Array.isArray(value)
        ? values
        : (values[0] ?? null)
    },
    labels(nodes: CascaderNode[], model: unknown): unknown {
      const options = source()
      const labels = nodes
        .map(node =>
          options.labelPath === 'all'
            ? node.text
            : options.labelPath === 'radio'
              ? node.label
              : null
        )
        .filter(label => label != null)
      const key = options.labelKey ?? 'label'
      if (options.multiple) {
        return options.valueKey && Array.isArray(model)
          ? model.map((item, index) => field(item, key) ?? labels[index])
          : labels
      }
      return labels[0] ?? (options.valueKey ? field(model, key) : undefined)
    },
    placeholder(model: unknown): string | undefined {
      const options = source()
      if (!options.inlinePlaceholder)
        return undefined
      const separator = options.separator ?? ' / '
      if (options.middleFields) {
        return options.middleFields
          .map(key => field(model, key))
          .filter(value => typeof value === 'string')
          .join(separator)
      }
      if (!options.valueKey)
        return undefined
      const label = (value: unknown) =>
        field(value, options.labelKey ?? 'label')
        ?? field(value, options.valueKey!)
      const value = Array.isArray(model)
        ? model.map(label).join(separator)
        : label(model)
      return value == null ? undefined : String(value)
    }
  }
}
