import type { CSSProperties, PropType, SlotsType, VNode } from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'
import { defineComponent } from 'vue'
import { DESCRIPTION_ITEM_FLAG } from './utils'

export const DescriptionsItemDefaultValueProps = {
  label: String,
  span: {
    type: Number,
    default: 1
  },
  labelClass: String,
  labelStyle: [Object, String] as PropType<string | CSSProperties>,
  contentClass: String,
  contentStyle: [Object, String] as PropType<string | CSSProperties>
} as const

export type DescriptionItemProps = ExtractPublicPropTypes<
  typeof DescriptionsItemDefaultValueProps
>

export interface DescriptionItemSlots {
  default?: () => VNode[]
  label?: () => VNode[]
}

export default defineComponent({
  name: 'DescriptionsItem',
  [DESCRIPTION_ITEM_FLAG]: true,
  props: DescriptionsItemDefaultValueProps,
  slots: Object as SlotsType<DescriptionItemSlots>,
  render() {
    return null
  }
})
