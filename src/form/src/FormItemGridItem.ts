import type { SlotsType } from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { FormItemInst, FormItemSlots } from './interface'
import { defineComponent, h, ref } from 'vue'
import { keep, keysOf } from '../../_utils'
import NGridItem, {
  GridItemDefaultValueProps,
  gridItemPropKeys
} from '../../grid/src/GridItem'
import NFormItem, {
  FormItemDefaultValueProps,
  formItemPropKeys
} from './FormItem'

export const FormItemGiDefaultValueProps = {
  ...GridItemDefaultValueProps,
  ...FormItemDefaultValueProps
} as const

export const formItemGiPropKeys = keysOf(FormItemGiDefaultValueProps)

export type FormItemGiProps = ExtractPublicPropTypes<
  typeof FormItemGiDefaultValueProps
>

export default defineComponent({
  __GRID_ITEM__: true,
  name: 'FormItemGridItem',
  alias: ['FormItemGi'],
  props: FormItemGiDefaultValueProps,
  slots: Object as SlotsType<FormItemSlots>,
  setup() {
    const formItemInstRef = ref<FormItemInst | null>(null)
    const validate = ((...args: any[]) => {
      const { value } = formItemInstRef
      if (value) {
        return value.validate(...args)
      }
    }) as FormItemInst['validate']
    const restoreValidation: FormItemInst['restoreValidation'] = () => {
      const { value } = formItemInstRef
      if (value) {
        value.restoreValidation()
      }
    }
    return {
      // 减少 dts：仅使用字符串 ref，类型在 render 中未使用
      formItemInstRef: formItemInstRef as unknown,
      validate,
      restoreValidation
    }
  },
  render() {
    return h(NGridItem, keep(this.$.vnode.props || {}, gridItemPropKeys), {
      default: () => {
        const itemProps = keep(this.$props, formItemPropKeys)
        return h(
          NFormItem,
          {
            ref: 'formItemInstRef',
            ...itemProps
          },
          this.$slots
        )
      }
    })
  }
})
