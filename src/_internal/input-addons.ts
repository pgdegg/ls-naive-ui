import type { Slots, VNode } from 'vue'
import type { InputSize } from '../input/src/public-types'
import { cloneVNode, h } from 'vue'
import InputGroup from '../input/src/InputGroup'
import InputGroupLabel from '../input/src/InputGroupLabel'

export function renderInputAddons(
  control: VNode,
  slots: Partial<Pick<Slots, 'prepend' | 'append'>>,
  size?: InputSize
): VNode {
  if (!slots.prepend && !slots.append)
    return control
  return h(InputGroup, null, {
    default: () => [
      slots.prepend ? h(InputGroupLabel, { size }, slots.prepend) : null,
      cloneVNode(control, { style: { flex: 1, minWidth: 0, width: 'auto' } }),
      slots.append ? h(InputGroupLabel, { size }, slots.append) : null
    ]
  })
}
