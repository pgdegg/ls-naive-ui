import type { ComputedRef, PropType, Ref } from 'vue'
import type { ExtractPublicPropTypes, MaybeArray } from '../../_utils'
import { useMergedState } from 'vooks'
import {
  computed,
  defineComponent,
  h,
  provide,
  ref,
  toRef,
  watchEffect
} from 'vue'
import { useConfig, useFormItem } from '../../_mixins'
import { readonlyControlProps } from '../../_mixins/use-form-item'
import { call, createInjectionKey, warnOnce } from '../../_utils'
import { useInputElement } from '../../composables/use-input-element'
import NCheckbox from './Checkbox'

export interface CheckboxGroupInjection {
  checkedCountRef: ComputedRef<number>
  maxRef: Ref<number | undefined>
  minRef: Ref<number | undefined>
  disabledRef: Ref<boolean>
  valueSetRef: Ref<Set<string | number>>
  mergedSizeRef: Ref<'small' | 'medium' | 'large'>
  toggleCheckbox: (checked: boolean, checkboxValue: string | number) => void
}

export const checkboxGroupInjectionKey
  = createInjectionKey<CheckboxGroupInjection>('n-checkbox-group')

export interface CheckboxGroupOption {
  visible?: boolean
  label?: string
  value?: string | number
  disabled?: boolean
  [key: string]: unknown
}

export interface CheckboxGroupInst {
  readonly inputElement: HTMLElement | null
  readonly allChecked: boolean
  readonly isIndeterminate: boolean
  toggleAll: (checked?: boolean) => void
}

export const checkboxGroupProps = {
  ...readonlyControlProps,
  min: Number,
  max: Number,
  size: String as PropType<'small' | 'medium' | 'large'>,
  options: Array as PropType<CheckboxGroupOption[]>,
  labelField: {
    type: String,
    default: 'label'
  },
  valueField: {
    type: String,
    default: 'value'
  },
  value: Array as PropType<Array<string | number> | null>,
  defaultValue: {
    type: Array as PropType<Array<string | number> | null>,
    default: null
  },
  disabled: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  'onUpdate:value': [Function, Array] as PropType<
    MaybeArray<
      (
        value: Array<string | number>,
        meta: {
          actionType: 'check' | 'uncheck'
          value: string | number
        }
      ) => void
    >
  >,
  onUpdateValue: [Function, Array] as PropType<
    MaybeArray<
      (
        value: Array<string | number>,
        meta: {
          actionType: 'check' | 'uncheck'
          value: string | number
        }
      ) => void
    >
  >,
  // 已废弃
  onChange: [Function, Array] as PropType<
    MaybeArray<(value: Array<string | number>) => void> | undefined
  >
} as const

export type CheckboxGroupProps = ExtractPublicPropTypes<
  typeof checkboxGroupProps
>

export default defineComponent({
  name: 'CheckboxGroup',
  props: checkboxGroupProps,
  setup(props, { expose }) {
    const inputElement = useInputElement()
    if (__DEV__) {
      watchEffect(() => {
        if (props.onChange !== undefined) {
          warnOnce(
            'checkbox-group',
            '`on-change` is deprecated, please use `on-update:value` instead.'
          )
        }
      })
    }
    const { mergedClsPrefixRef } = useConfig(props)
    const formItem = useFormItem(props)
    const { mergedSizeRef, mergedDisabledRef } = formItem
    const uncontrolledValueRef = ref(props.defaultValue)
    const controlledValueRef = computed(() => props.value)
    const mergedValueRef = useMergedState(
      controlledValueRef,
      uncontrolledValueRef
    )
    const checkedCount = computed(() => {
      return mergedValueRef.value?.length || 0
    })

    const valueSetRef = computed<Set<string | number>>(() => {
      if (Array.isArray(mergedValueRef.value)) {
        return new Set(mergedValueRef.value)
      }
      return new Set()
    })
    const selectableValues = computed(() =>
      (props.options ?? [])
        .filter(option => !option.disabled && option.visible !== false)
        .map(option => option[props.valueField] as string | number)
    )
    const allChecked = computed(
      () =>
        selectableValues.value.length > 0
        && selectableValues.value.every(value => valueSetRef.value.has(value))
    )
    const isIndeterminate = computed(
      () =>
        selectableValues.value.some(value => valueSetRef.value.has(value))
        && !allChecked.value
    )
    function toggleAll(checked = !allChecked.value): void {
      const values = selectableValues.value
      if (mergedDisabledRef.value || !values.length)
        return
      const previous = mergedValueRef.value ?? []
      const next = checked
        ? Array.from(new Set([...previous, ...values]))
        : previous.filter(value => !values.includes(value))
      if (
        (props.min !== undefined && next.length < props.min)
        || (props.max !== undefined && next.length > props.max)
      ) {
        return
      }
      if (
        next.length === previous.length
        && next.every(value => previous.includes(value))
      ) {
        return
      }
      const meta = {
        actionType: checked ? ('check' as const) : ('uncheck' as const),
        value: values[0]
      }
      if (props.onUpdateValue)
        call(props.onUpdateValue, next, meta)
      if (props['onUpdate:value'])
        call(props['onUpdate:value'], next, meta)
      if (props.onChange)
        call(props.onChange, next)
      uncontrolledValueRef.value = next
      formItem.nTriggerFormInput()
      formItem.nTriggerFormChange()
    }
    expose({
      get inputElement() {
        return inputElement.value
      },
      get allChecked() {
        return allChecked.value
      },
      get isIndeterminate() {
        return isIndeterminate.value
      },
      toggleAll
    } satisfies CheckboxGroupInst)
    function toggleCheckbox(
      checked: boolean,
      checkboxValue: string | number
    ): void {
      if (mergedDisabledRef.value)
        return
      const { nTriggerFormInput, nTriggerFormChange } = formItem
      const {
        onChange,
        'onUpdate:value': _onUpdateValue,
        onUpdateValue
      } = props

      if (Array.isArray(mergedValueRef.value)) {
        const groupValue = Array.from(mergedValueRef.value)
        const index = groupValue.findIndex(value => value === checkboxValue)
        if (checked) {
          if (!~index) {
            groupValue.push(checkboxValue)
            if (onUpdateValue) {
              call(onUpdateValue, groupValue, {
                actionType: 'check',
                value: checkboxValue
              })
            }
            if (_onUpdateValue) {
              call(_onUpdateValue, groupValue, {
                actionType: 'check',
                value: checkboxValue
              })
            }
            nTriggerFormInput()
            nTriggerFormChange()
            uncontrolledValueRef.value = groupValue
            // 已废弃
            if (onChange)
              call(onChange, groupValue)
          }
        }
        else {
          if (~index) {
            groupValue.splice(index, 1)
            if (onUpdateValue) {
              call(onUpdateValue, groupValue, {
                actionType: 'uncheck',
                value: checkboxValue
              })
            }
            if (_onUpdateValue) {
              call(_onUpdateValue, groupValue, {
                actionType: 'uncheck',
                value: checkboxValue
              })
            }
            if (onChange)
              call(onChange, groupValue) // 已废弃
            uncontrolledValueRef.value = groupValue
            nTriggerFormInput()
            nTriggerFormChange()
          }
        }
      }
      else {
        if (checked) {
          if (onUpdateValue) {
            call(onUpdateValue, [checkboxValue], {
              actionType: 'check',
              value: checkboxValue
            })
          }
          if (_onUpdateValue) {
            call(_onUpdateValue, [checkboxValue], {
              actionType: 'check',
              value: checkboxValue
            })
          }
          if (onChange)
            call(onChange, [checkboxValue]) // 已废弃
          uncontrolledValueRef.value = [checkboxValue]
          nTriggerFormInput()
          nTriggerFormChange()
        }
        else {
          if (onUpdateValue) {
            call(onUpdateValue, [], {
              actionType: 'uncheck',
              value: checkboxValue
            })
          }
          if (_onUpdateValue) {
            call(_onUpdateValue, [], {
              actionType: 'uncheck',
              value: checkboxValue
            })
          }
          if (onChange)
            call(onChange, []) // 已废弃
          uncontrolledValueRef.value = []
          nTriggerFormInput()
          nTriggerFormChange()
        }
      }
    }
    provide(checkboxGroupInjectionKey, {
      checkedCountRef: checkedCount,
      maxRef: toRef(props, 'max'),
      minRef: toRef(props, 'min'),
      valueSetRef,
      disabledRef: mergedDisabledRef,
      mergedSizeRef,
      toggleCheckbox
    })
    return {
      inputElement,
      allChecked,
      isIndeterminate,
      toggleAll,
      mergedClsPrefix: mergedClsPrefixRef
    }
  },
  render() {
    const { options, labelField, valueField } = this.$props
    return (
      <div class={`${this.mergedClsPrefix}-checkbox-group`} role="group">
        {options
          ? options
              .filter(option => option.visible !== false)
              .map((option) => {
                const value = option[valueField] as string | number
                return (
                  <NCheckbox
                    key={value}
                    value={value}
                    disabled={option.disabled}
                    label={option[labelField] as string | undefined}
                  />
                )
              })
          : this.$slots.default?.()}
      </div>
    )
  }
})
