import type { ComputedRef, PropType, Ref } from 'vue'
import type {
  FormItemSize,
  FormValidationStatus
} from '../form/src/public-types'
import { computed, inject, onBeforeUnmount, provide, unref } from 'vue'
import { createInjectionKey } from '../_utils'
import { formInjectionKey } from '../form/src/context'

export const componentDisabledInjectionKey = createInjectionKey<
  boolean | Ref<boolean>
>('n-component-disabled')
export const readonlyControlProps = {
  readonly: { type: Boolean, default: undefined },
  ignoreParentReadonly: Boolean
}
export const formControlProps = {
  ...readonlyControlProps,
  hidePlaceholder: { type: Boolean, default: undefined },
  ignoreParentHidePlaceholder: [String, Array] as PropType<string | string[]>
}

type AllowedSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | number

export interface FormItemInjection {
  path: Ref<string | undefined>
  disabled: Ref<boolean>
  mergedSize: ComputedRef<FormItemSize>
  mergedValidationStatus: ComputedRef<FormValidationStatus | undefined>
  restoreValidation: () => void
  handleContentBlur: () => void
  handleContentFocus: () => void
  handleContentInput: () => void
  handleContentChange: () => void
}

export const formItemInjectionKey
  = createInjectionKey<FormItemInjection | null>('n-form-item')

interface UseFormItemOptions<T> {
  readonlyAsDisabled?: boolean
  defaultSize?: FormItemSize
  mergedSize?: (formItem: FormItemInjection | null) => T
  mergedDisabled?: (formItem: FormItemInjection | null) => boolean
}

interface UseFormItemProps<T> {
  readonly?: boolean | string
  ignoreParentReadonly?: boolean
  hidePlaceholder?: boolean
  ignoreParentHidePlaceholder?: string | string[]
  size?: T
  disabled?: boolean
  status?: FormValidationStatus
}

export interface UseFormItem<T> {
  mergedReadonlyRef: ComputedRef<boolean>
  mergedHidePlaceholderRef: ComputedRef<boolean>
  mergedSizeRef: ComputedRef<T>
  mergedDisabledRef: ComputedRef<boolean>
  mergedStatusRef: ComputedRef<FormValidationStatus | undefined>
  nTriggerFormBlur: () => void
  nTriggerFormChange: () => void
  nTriggerFormFocus: () => void
  nTriggerFormInput: () => void
}

export default function useFormItem<T extends AllowedSize = FormItemSize>(
  props: UseFormItemProps<T>,
  {
    readonlyAsDisabled = true,
    defaultSize = 'medium',
    mergedSize,
    mergedDisabled
  }: UseFormItemOptions<T> = {}
): UseFormItem<T> {
  const NFormItem = inject(formItemInjectionKey, null)
  const NForm = inject(formInjectionKey, null)
  const inheritedDisabled = inject(componentDisabledInjectionKey, null)
  const mergedReadonlyRef = computed(() =>
    Boolean(
      props.readonly || (!props.ignoreParentReadonly && NForm?.props.readonly)
    )
  )
  const mergedHidePlaceholderRef = computed(
    () =>
      props.hidePlaceholder
      ?? Boolean(
        NForm?.props.hidePlaceholder
        && ![props.ignoreParentHidePlaceholder].flat().includes('form')
      )
  )
  provide(formItemInjectionKey, null)
  const mergedSizeRef = computed(
    mergedSize
      ? () => mergedSize(NFormItem)
      : () => {
          const { size } = props
          if (size)
            return size
          if (NFormItem) {
            const { mergedSize } = NFormItem
            if (mergedSize.value !== undefined) {
              return mergedSize.value as T
            }
          }
          return defaultSize as T
        }
  )
  const ownDisabledRef = computed(
    mergedDisabled
      ? () => mergedDisabled(NFormItem)
      : () => {
          const { disabled } = props
          if (disabled !== undefined) {
            return disabled
          }
          if (NFormItem) {
            return NFormItem.disabled.value
          }
          return NForm?.props.disabled ?? false
        }
  )
  const mergedDisabledRef = computed(() =>
    Boolean(
      unref(inheritedDisabled)
      || ownDisabledRef.value
      || (readonlyAsDisabled && mergedReadonlyRef.value)
    )
  )
  const mergedStatusRef = computed<FormValidationStatus | undefined>(() => {
    const { status } = props
    if (status)
      return status
    return NFormItem?.mergedValidationStatus.value
  })
  onBeforeUnmount(() => {
    if (NFormItem) {
      NFormItem.restoreValidation()
    }
  })
  return {
    mergedReadonlyRef,
    mergedHidePlaceholderRef,
    mergedSizeRef,
    mergedDisabledRef,
    mergedStatusRef,
    nTriggerFormBlur() {
      if (NFormItem) {
        NFormItem.handleContentBlur()
      }
    },
    nTriggerFormChange() {
      if (NFormItem) {
        NFormItem.handleContentChange()
      }
    },
    nTriggerFormFocus() {
      if (NFormItem) {
        NFormItem.handleContentFocus()
      }
    },
    nTriggerFormInput() {
      if (NFormItem) {
        NFormItem.handleContentInput()
      }
    }
  }
}
