import type { SlotsType, VNode } from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'
import { cloneVNode, defineComponent, mergeProps } from 'vue'
import { readonlyControlProps } from '../../_mixins'
import { omit } from '../../_utils'
import {
  colorPickerProps,
  setupColorPicker
} from '../../color-picker/src/ColorPicker'

export const colorPickerPanelProps = {
  ...omit(colorPickerProps, [
    'show',
    'defaultShow',
    'placement',
    'to',
    'renderLabel',
    'onUpdateShow',
    'onUpdate:show',
    'internalActions'
  ]),
  ...readonlyControlProps
} as const

export type ColorPickerPanelProps = ExtractPublicPropTypes<
  typeof colorPickerPanelProps
>

export interface ColorPickerPanelSlots {
  action?: () => VNode[]
}

export interface ColorPickerPanelInst {
  readonly inputElement: HTMLElement | null
}

export default defineComponent({
  name: 'ColorPickerPanel',
  inheritAttrs: false,
  props: colorPickerPanelProps,
  slots: Object as SlotsType<ColorPickerPanelSlots>,
  setup(props, context) {
    return setupColorPicker(props, context, true)
  },
  render() {
    this.onRender?.()
    return cloneVNode(
      this.renderPanel(),
      mergeProps({ style: { margin: 0 } }, this.$attrs)
    )
  }
})
