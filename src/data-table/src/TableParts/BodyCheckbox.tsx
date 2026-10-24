import type { PropType } from 'vue'
import type { RowKey } from '../interface'
import { defineComponent, h, inject } from 'vue'
import { NCheckbox } from '../../../checkbox'
import { dataTableInjectionKey } from '../interface'

// 抽出 checkbox 以避免表格主体中的无用渲染
export default defineComponent({
  name: 'DataTableBodyCheckbox',
  props: {
    rowKey: {
      type: [String, Number] as PropType<RowKey>,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    onUpdateChecked: {
      type: Function as PropType<
        (checked: boolean, e: MouseEvent | KeyboardEvent) => void
      >,
      required: true
    }
  },
  setup(props) {
    const { mergedCheckedRowKeySetRef, mergedInderminateRowKeySetRef } = inject(
      dataTableInjectionKey
    )!
    return () => {
      const { rowKey } = props
      return (
        <NCheckbox
          privateInsideTable
          disabled={props.disabled}
          indeterminate={mergedInderminateRowKeySetRef.value.has(rowKey)}
          checked={mergedCheckedRowKeySetRef.value.has(rowKey)}
          onUpdateChecked={props.onUpdateChecked}
        />
      )
    }
  }
})
