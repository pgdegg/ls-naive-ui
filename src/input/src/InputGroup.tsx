import type { ExtractPublicPropTypes } from '../../_utils'
import { defineComponent, h } from 'vue'
import { useConfig, useStyle } from '../../_mixins'
import style from './styles/input-group.cssr'

export const InputGroupDefaultValueProps: { [key in any]: never } = {}

export type InputGroupProps = ExtractPublicPropTypes<
  typeof InputGroupDefaultValueProps
>

export default defineComponent({
  name: 'InputGroup',
  props: InputGroupDefaultValueProps,
  setup(props) {
    const { mergedClsPrefixRef } = useConfig(props)
    useStyle('-input-group', style, mergedClsPrefixRef)
    return {
      mergedClsPrefix: mergedClsPrefixRef
    }
  },
  render() {
    const { mergedClsPrefix } = this
    return (
      <div class={`${mergedClsPrefix}-input-group`}>
        {this.$slots.default?.()}
      </div>
    )
  }
})
