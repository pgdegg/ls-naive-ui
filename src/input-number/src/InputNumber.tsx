import type { InputHTMLAttributes, PropType, SlotsType, VNode } from 'vue'
import type { ThemeProps } from '../../_mixins'
import type { ExtractPublicPropTypes, MaybeArray } from '../../_utils'
import type { FormValidationStatus } from '../../form/src/public-types'
import type { InputInst } from '../../input'
import type { InputNumberTheme, InputNumberThemeOverrides } from '../styles'
import type { InputNumberInst, OnUpdateValue, Size } from './interface'
import { on } from 'evtd'
import { rgba } from 'seemly'
import { useMemo, useMergedState } from 'vooks'
import {
  computed,
  defineComponent,
  h,
  nextTick,
  ref,
  toRef,
  watch,
  watchEffect
} from 'vue'
import { NBaseIcon } from '../../_internal'
import { AddIcon, ChevronDownIcon, RemoveIcon } from '../../_internal/icons'
import { renderInputAddons } from '../../_internal/input-addons'
import { useConfig, useFormItem, useLocale, useTheme } from '../../_mixins'
import { formControlProps } from '../../_mixins/use-form-item'
import { useRtl } from '../../_mixins/use-rtl'
import { call, resolveSlot, resolveWrappedSlot, warnOnce } from '../../_utils'
import { NxButton } from '../../button'
import { useInputElement } from '../../composables/use-input-element'
import { NInput } from '../../input'
import { inputNumberLight } from '../styles'
import style from './styles/input-number.cssr'
import { format, isWipValue, parse, parseNumber, validator } from './utils'

const HOLDING_CHANGE_THRESHOLD = 800
const HOLDING_CHANGE_INTERVAL = 100

export const inputNumberProps = {
  ...formControlProps,
  ...(useTheme.props as ThemeProps<
    InputNumberTheme,
    InputNumberThemeOverrides
  >),
  autofocus: Boolean,
  loading: {
    type: Boolean,
    default: undefined
  },
  placeholder: String,
  defaultValue: {
    type: Number as PropType<number | null>,
    default: null
  },
  value: Number as PropType<number | null>,
  step: {
    type: [Number, String],
    default: 1
  },
  min: [Number, String],
  max: [Number, String],
  size: String as PropType<Size>,
  disabled: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  validator: Function as PropType<(value: number) => boolean>,
  bordered: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  showButton: {
    type: Boolean,
    default: true
  },
  buttonPlacement: {
    type: String as PropType<'right' | 'both' | 'right-vertical'>,
    default: 'right'
  },
  inputProps: Object as PropType<InputHTMLAttributes>,
  readonly: Boolean,
  clearable: Boolean,
  keyboard: {
    type: Object as PropType<{
      ArrowUp?: boolean
      ArrowDown?: boolean
    }>,
    default: {}
  },
  updateValueOnInput: {
    type: Boolean,
    default: true
  },
  round: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  parse: Function as PropType<(input: string) => number | null>,
  format: Function as PropType<(value: number | null) => string>,
  precision: Number,
  maxPrecision: Number,
  onPrecisionExceed: Function as PropType<
    (value: number, precision: number) => void
  >,
  status: String as PropType<FormValidationStatus>,
  'onUpdate:value': [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
  onUpdateValue: [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
  onFocus: [Function, Array] as PropType<MaybeArray<(e: FocusEvent) => void>>,
  onBlur: [Function, Array] as PropType<MaybeArray<(e: FocusEvent) => void>>,
  onClear: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
  // 已废弃
  onChange: [Function, Array] as PropType<MaybeArray<OnUpdateValue>>
}

export type InputNumberProps = ExtractPublicPropTypes<typeof inputNumberProps>

export interface InputNumberSlots {
  prepend?: () => VNode[]
  append?: () => VNode[]
  'add-icon'?: () => VNode[]
  'minus-icon'?: () => VNode[]
  prefix?: () => VNode[]
  suffix?: () => VNode[]
}

export default defineComponent({
  name: 'InputNumber',
  props: inputNumberProps,
  slots: Object as SlotsType<InputNumberSlots>,
  setup(props) {
    if (__DEV__) {
      watchEffect(() => {
        if (props.onChange !== undefined) {
          warnOnce(
            'input-number',
            '`on-change` is deprecated, please use `on-update:value` instead'
          )
        }
      })
    }
    const {
      mergedBorderedRef,
      mergedClsPrefixRef,
      mergedRtlRef,
      mergedComponentPropsRef
    } = useConfig(props)
    const themeRef = useTheme(
      'InputNumber',
      '-input-number',
      style,
      inputNumberLight,
      props,
      mergedClsPrefixRef
    )
    const { localeRef } = useLocale('InputNumber')
    const formItem = useFormItem(props, {
      readonlyAsDisabled: false,
      mergedSize: (NFormItem) => {
        const { size } = props
        if (size)
          return size
        const { mergedSize: formItemSize } = NFormItem || {}
        if (formItemSize?.value)
          return formItemSize.value as Size
        const configSize = mergedComponentPropsRef?.value?.InputNumber?.size
        if (configSize)
          return configSize
        return 'medium'
      }
    })
    const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem
    // DOM 引用
    const inputInstRef = ref<InputInst | null>(null)
    const inputElement = useInputElement<
      HTMLInputElement | HTMLTextAreaElement
    >(() => inputInstRef.value?.inputElement)
    const minusButtonInstRef = ref<{ $el: HTMLElement } | null>(null)
    const addButtonInstRef = ref<{ $el: HTMLElement } | null>(null)
    // 值
    const uncontrolledValueRef = ref(props.defaultValue)
    const controlledValueRef = toRef(props, 'value')
    const mergedValueRef = useMergedState(
      controlledValueRef,
      uncontrolledValueRef
    )
    const displayedValueRef = ref('')
    const getPrecision = (value: string | number): number => {
      const fraction = String(value).split('.')[1]
      return fraction ? fraction.length : 0
    }
    const getMaxPrecision = (currentValue: number): number => {
      const precisions = [props.min, props.max, props.step, currentValue].map(
        (value): number => {
          if (value === undefined)
            return 0
          return getPrecision(value)
        }
      )
      return Math.max(...precisions)
    }
    const mergedPlaceholderRef = useMemo(() => {
      const { placeholder } = props
      if (placeholder !== undefined)
        return placeholder
      return localeRef.value.placeholder
    })
    const mergedStepRef = useMemo(() => {
      const parsedNumber = parseNumber(props.step)
      if (parsedNumber !== null) {
        return parsedNumber === 0 ? 1 : Math.abs(parsedNumber)
      }
      return 1
    })
    const mergedMinRef = useMemo(() => {
      const parsedNumber = parseNumber(props.min)
      if (parsedNumber !== null)
        return parsedNumber
      else return null
    })
    const mergedMaxRef = useMemo(() => {
      const parsedNumber = parseNumber(props.max)
      if (parsedNumber !== null)
        return parsedNumber
      else return null
    })
    const deriveDisplayedValueFromValue = (): void => {
      const { value: mergedValue } = mergedValueRef
      if (validator(mergedValue)) {
        const { format: formatProp, precision } = props
        if (formatProp) {
          displayedValueRef.value = formatProp(mergedValue)
        }
        else {
          if (
            mergedValue === null
            || precision === undefined
            // 精度溢出
            || getPrecision(mergedValue) > precision
          ) {
            displayedValueRef.value = format(mergedValue, undefined)
          }
          else {
            displayedValueRef.value = format(mergedValue, precision)
          }
        }
      }
      else {
        // null 可以通过 validator 校验
        // 所以 mergedValue 是一个数字
        displayedValueRef.value = String(mergedValue)
      }
    }
    deriveDisplayedValueFromValue()
    const doUpdateValue = (value: number | null): void => {
      if (formItem.mergedReadonlyRef.value || mergedDisabledRef.value)
        return
      const limit = props.maxPrecision
      if (
        value !== null
        && limit !== undefined
        && Number.isInteger(limit)
        && limit >= 0
        && limit <= 100
      ) {
        const rounded = Number(value.toFixed(limit))
        if (rounded !== value)
          props.onPrecisionExceed?.(value, limit)
        value = rounded
      }
      const { value: mergedValue } = mergedValueRef
      if (value === mergedValue) {
        deriveDisplayedValueFromValue()
        return
      }
      const {
        'onUpdate:value': _onUpdateValue,
        onUpdateValue,
        onChange
      } = props
      const { nTriggerFormInput, nTriggerFormChange } = formItem
      if (onChange)
        call(onChange, value)
      if (onUpdateValue)
        call(onUpdateValue, value)
      if (_onUpdateValue)
        call(_onUpdateValue, value)
      uncontrolledValueRef.value = value
      nTriggerFormInput()
      nTriggerFormChange()
    }
    watch(
      [mergedValueRef, () => props.maxPrecision],
      ([value, limit]) => {
        if (
          typeof value === 'number'
          && limit !== undefined
          && Number.isInteger(limit)
          && limit >= 0
          && limit <= 100
          && Number(value.toFixed(limit)) !== value
        ) {
          doUpdateValue(value)
          deriveDisplayedValueFromValue()
        }
      },
      { immediate: true }
    )
    const deriveValueFromDisplayedValue = ({
      offset,
      doUpdateIfValid,
      fixPrecision,
      isInputing
    }: {
      offset: number
      doUpdateIfValid: boolean
      fixPrecision: boolean
      isInputing: boolean
    }): null | number | false => {
      const { value: displayedValue } = displayedValueRef
      if (isInputing && isWipValue(displayedValue)) {
        return false
      }
      const parsedValue = (props.parse || parse)(displayedValue)
      if (parsedValue === null) {
        if (doUpdateIfValid)
          doUpdateValue(null)
        return null
      }
      if (validator(parsedValue)) {
        const currentPrecision = getPrecision(parsedValue)
        const { precision } = props
        if (
          precision !== undefined
          && precision < currentPrecision
          && !fixPrecision
        ) {
          return false
        }
        let nextValue = Number.parseFloat(
          (parsedValue + offset).toFixed(
            precision ?? getMaxPrecision(parsedValue)
          )
        )
        if (validator(nextValue)) {
          const { value: mergedMax } = mergedMaxRef
          const { value: mergedMin } = mergedMinRef
          if (mergedMax !== null && nextValue > mergedMax) {
            if (!doUpdateIfValid || isInputing)
              return false
            // 如果 doUpdateIfValid=true，尝试使其成为一个有效值
            nextValue = mergedMax
          }
          if (mergedMin !== null && nextValue < mergedMin) {
            if (!doUpdateIfValid || isInputing)
              return false
            // 如果 doUpdateIfValid=true，尝试使其成为一个有效值
            nextValue = mergedMin
          }
          if (props.validator && !props.validator(nextValue))
            return false
          if (doUpdateIfValid)
            doUpdateValue(nextValue)
          return nextValue
        }
      }
      return false
    }
    const displayedValueInvalidRef = useMemo(() => {
      const derivedValue = deriveValueFromDisplayedValue({
        offset: 0,
        doUpdateIfValid: false,
        isInputing: false,
        fixPrecision: false
      })
      return derivedValue === false
    })
    const minusableRef = useMemo(() => {
      const { value: mergedValue } = mergedValueRef
      if (props.validator && mergedValue === null) {
        return false
      }
      const { value: mergedStep } = mergedStepRef
      const derivedNextValue = deriveValueFromDisplayedValue({
        offset: -mergedStep,
        doUpdateIfValid: false,
        isInputing: false,
        fixPrecision: false
      })
      return derivedNextValue !== false
    })
    const addableRef = useMemo(() => {
      const { value: mergedValue } = mergedValueRef
      if (props.validator && mergedValue === null) {
        return false
      }
      const { value: mergedStep } = mergedStepRef
      const derivedNextValue = deriveValueFromDisplayedValue({
        offset: +mergedStep,
        doUpdateIfValid: false,
        isInputing: false,
        fixPrecision: false
      })
      return derivedNextValue !== false
    })
    function doFocus(e: FocusEvent): void {
      const { onFocus } = props
      const { nTriggerFormFocus } = formItem
      if (onFocus)
        call(onFocus, e)
      nTriggerFormFocus()
    }
    function doBlur(e: FocusEvent): void {
      if (e.target === inputInstRef.value?.wrapperElRef) {
        // 命中 input wrapper
        // 意味着尚未激活
        return
      }
      const value = deriveValueFromDisplayedValue({
        offset: 0,
        doUpdateIfValid: true,
        isInputing: false,
        fixPrecision: true
      })
      // 如果有效，update 事件已经触发
      // 确保 blur 回调中 e.target.value 是正确的
      if (value !== false) {
        const inputElRef = inputInstRef.value?.inputElRef
        if (inputElRef) {
          inputElRef.value = String(value || '')
        }
        // 如果值没有变化，展示值可能大于或小于当前
        // 值。推导出的值会被重新格式化，所以值没有变化。
        // 我们可以直接推导出一个新的展示值
        if (mergedValueRef.value === value) {
          deriveDisplayedValueFromValue()
        }
      }
      else {
        // 如果无效，不会触发任何事件，因此从原始值
        // 推导展示值
        deriveDisplayedValueFromValue()
      }
      const { onBlur } = props
      const { nTriggerFormBlur } = formItem
      if (onBlur)
        call(onBlur, e)
      nTriggerFormBlur()
      // 用户可能在 blur 回调中修改值，我们确保它会被
      // 展示出来。有时 mergedValue 不会被视为已变化
      void nextTick(() => {
        deriveDisplayedValueFromValue()
      })
    }
    function doClear(e: MouseEvent): void {
      const { onClear } = props
      if (onClear)
        call(onClear, e)
    }
    function doAdd(): void {
      const { value: addable } = addableRef
      if (!addable) {
        clearAddHoldTimeout()
        return
      }
      const { value: mergedValue } = mergedValueRef
      if (mergedValue === null) {
        if (!props.validator) {
          doUpdateValue(createValidValue())
        }
      }
      else {
        const { value: mergedStep } = mergedStepRef
        deriveValueFromDisplayedValue({
          offset: mergedStep,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        })
      }
    }
    function doMinus(): void {
      const { value: minusable } = minusableRef
      if (!minusable) {
        clearMinusHoldTimeout()
        return
      }
      const { value: mergedValue } = mergedValueRef
      if (mergedValue === null) {
        if (!props.validator) {
          doUpdateValue(createValidValue())
        }
      }
      else {
        const { value: mergedStep } = mergedStepRef
        deriveValueFromDisplayedValue({
          offset: -mergedStep,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        })
      }
    }
    const handleFocus = doFocus
    const handleBlur = doBlur
    function createValidValue(): number | null {
      if (props.validator)
        return null
      const { value: mergedMin } = mergedMinRef
      const { value: mergedMax } = mergedMaxRef
      if (mergedMin !== null) {
        return Math.max(0, mergedMin)
      }
      else if (mergedMax !== null) {
        return Math.min(0, mergedMax)
      }
      else {
        return 0
      }
    }
    function handleClear(e: MouseEvent): void {
      doClear(e)
      doUpdateValue(null)
    }
    function handleMouseDown(e: MouseEvent): void {
      if (addButtonInstRef.value?.$el.contains(e.target as Node)) {
        e.preventDefault()
      }
      if (minusButtonInstRef.value?.$el.contains(e.target as Node)) {
        e.preventDefault()
      }
      inputInstRef.value?.activate()
    }
    let minusHoldStateIntervalId: number | null = null
    let addHoldStateIntervalId: number | null = null
    let firstMinusMousedownId: number | null = null
    function clearMinusHoldTimeout(): void {
      if (firstMinusMousedownId) {
        window.clearTimeout(firstMinusMousedownId)
        firstMinusMousedownId = null
      }
      if (minusHoldStateIntervalId) {
        window.clearInterval(minusHoldStateIntervalId)
        minusHoldStateIntervalId = null
      }
    }
    let firstAddMousedownId: number | null = null
    function clearAddHoldTimeout(): void {
      if (firstAddMousedownId) {
        window.clearTimeout(firstAddMousedownId)
        firstAddMousedownId = null
      }
      if (addHoldStateIntervalId) {
        window.clearInterval(addHoldStateIntervalId)
        addHoldStateIntervalId = null
      }
    }
    function handleMinusMousedown(): void {
      clearMinusHoldTimeout()
      firstMinusMousedownId = window.setTimeout(() => {
        minusHoldStateIntervalId = window.setInterval(() => {
          doMinus()
        }, HOLDING_CHANGE_INTERVAL)
      }, HOLDING_CHANGE_THRESHOLD)
      on('mouseup', document, clearMinusHoldTimeout, {
        once: true
      })
    }
    function handleAddMousedown(): void {
      clearAddHoldTimeout()
      firstAddMousedownId = window.setTimeout(() => {
        addHoldStateIntervalId = window.setInterval(() => {
          doAdd()
        }, HOLDING_CHANGE_INTERVAL)
      }, HOLDING_CHANGE_THRESHOLD)
      on('mouseup', document, clearAddHoldTimeout, {
        once: true
      })
    }
    const handleAddClick = (): void => {
      if (addHoldStateIntervalId)
        return
      doAdd()
    }
    const handleMinusClick = (): void => {
      if (minusHoldStateIntervalId)
        return
      doMinus()
    }
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Enter') {
        if (e.target === inputInstRef.value?.wrapperElRef) {
          // 命中 input wrapper
          // 意味着尚未激活
          return
        }
        const value = deriveValueFromDisplayedValue({
          offset: 0,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        })
        if (value !== false) {
          inputInstRef.value?.deactivate()
        }
      }
      else if (e.key === 'ArrowUp') {
        if (!addableRef.value)
          return
        if (props.keyboard.ArrowUp === false)
          return
        e.preventDefault()
        const value = deriveValueFromDisplayedValue({
          offset: 0,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        })
        if (value !== false) {
          doAdd()
        }
      }
      else if (e.key === 'ArrowDown') {
        if (!minusableRef.value)
          return
        if (props.keyboard.ArrowDown === false)
          return
        e.preventDefault()
        const value = deriveValueFromDisplayedValue({
          offset: 0,
          doUpdateIfValid: true,
          isInputing: false,
          fixPrecision: true
        })
        if (value !== false) {
          doMinus()
        }
      }
    }
    function handleUpdateDisplayedValue(value: string): void {
      displayedValueRef.value = value
      if (
        props.updateValueOnInput
        && !props.format
        && !props.parse
        && props.precision === undefined
      ) {
        deriveValueFromDisplayedValue({
          offset: 0,
          doUpdateIfValid: true,
          isInputing: true,
          fixPrecision: false
        })
      }
    }
    watch(mergedValueRef, () => {
      deriveDisplayedValueFromValue()
    })
    const exposedMethods: InputNumberInst = {
      get inputElement() {
        return inputElement.value
      },
      focus: () => inputInstRef.value?.focus(),
      blur: () => inputInstRef.value?.blur(),
      select: () => inputInstRef.value?.select()
    }
    const rtlEnabledRef = useRtl(
      'InputNumber',
      mergedRtlRef,
      mergedClsPrefixRef
    )
    return {
      ...exposedMethods,
      inputElement,
      mergedReadonly: formItem.mergedReadonlyRef,
      rtlEnabled: rtlEnabledRef,
      // 减少 dts：仅字符串 ref，类型在 render 中未使用
      inputInstRef: inputInstRef as unknown,
      minusButtonInstRef: minusButtonInstRef as unknown,
      addButtonInstRef: addButtonInstRef as unknown,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      mergedPlaceholder: mergedPlaceholderRef,
      displayedValueInvalid: displayedValueInvalidRef,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      displayedValue: displayedValueRef,
      addable: addableRef,
      minusable: minusableRef,
      mergedStatus: mergedStatusRef,
      handleFocus,
      handleBlur,
      handleClear,
      handleMouseDown,
      handleAddClick,
      handleMinusClick,
      handleAddMousedown,
      handleMinusMousedown,
      handleKeyDown,
      handleUpdateDisplayedValue,
      // 主题
      mergedTheme: themeRef,
      inputThemeOverrides: {
        paddingSmall: '0 8px 0 10px',
        paddingMedium: '0 8px 0 12px',
        paddingLarge: '0 8px 0 14px'
      },
      buttonThemeOverrides: computed(() => {
        const {
          self: { iconColorDisabled }
        } = themeRef.value
        const [r, g, b, a] = rgba(iconColorDisabled)
        return {
          ...(props.buttonPlacement === 'right-vertical'
            ? {
                iconSizeTiny: '12px',
                iconSizeSmall: '12px',
                iconSizeMedium: '12px',
                iconSizeLarge: '12px'
              }
            : {}),
          textColorTextDisabled: `rgb(${r}, ${g}, ${b})`,
          opacityDisabled: `${a}`
        }
      })
    }
  },
  render() {
    const { mergedClsPrefix, $slots } = this
    const renderMinusButton = (): VNode => {
      return (
        <NxButton
          text
          aria-label={
            this.buttonPlacement === 'right-vertical' ? '-' : undefined
          }
          disabled={
            !this.minusable || this.mergedDisabled || this.mergedReadonly
          }
          focusable={false}
          theme={this.mergedTheme.peers.Button}
          themeOverrides={this.mergedTheme.peerOverrides.Button}
          builtinThemeOverrides={this.buttonThemeOverrides}
          onClick={this.handleMinusClick}
          onMousedown={this.handleMinusMousedown}
          ref="minusButtonInstRef"
        >
          {{
            icon: () =>
              resolveSlot($slots['minus-icon'], () => [
                <NBaseIcon clsPrefix={mergedClsPrefix}>
                  {{
                    default: () =>
                      this.buttonPlacement === 'right-vertical' ? (
                        <ChevronDownIcon />
                      ) : (
                        <RemoveIcon />
                      )
                  }}
                </NBaseIcon>
              ])
          }}
        </NxButton>
      )
    }
    const renderAddButton = (): VNode => {
      return (
        <NxButton
          text
          aria-label={
            this.buttonPlacement === 'right-vertical' ? '+' : undefined
          }
          disabled={!this.addable || this.mergedDisabled || this.mergedReadonly}
          focusable={false}
          theme={this.mergedTheme.peers.Button}
          themeOverrides={this.mergedTheme.peerOverrides.Button}
          builtinThemeOverrides={this.buttonThemeOverrides}
          onClick={this.handleAddClick}
          onMousedown={this.handleAddMousedown}
          ref="addButtonInstRef"
        >
          {{
            icon: () =>
              resolveSlot($slots['add-icon'], () => [
                <NBaseIcon
                  clsPrefix={mergedClsPrefix}
                  style={
                    this.buttonPlacement === 'right-vertical'
                      ? { transform: 'rotate(180deg)' }
                      : undefined
                  }
                >
                  {{
                    default: () =>
                      this.buttonPlacement === 'right-vertical' ? (
                        <ChevronDownIcon />
                      ) : (
                        <AddIcon />
                      )
                  }}
                </NBaseIcon>
              ])
          }}
        </NxButton>
      )
    }
    const control = (
      <div
        class={[
          `${mergedClsPrefix}-input-number`,
          this.rtlEnabled && `${mergedClsPrefix}-input-number--rtl`
        ]}
      >
        <NInput
          hidePlaceholder={this.hidePlaceholder}
          ignoreParentHidePlaceholder={this.ignoreParentHidePlaceholder}
          ignoreParentReadonly={this.ignoreParentReadonly}
          ref="inputInstRef"
          autofocus={this.autofocus}
          status={this.mergedStatus}
          bordered={this.mergedBordered}
          loading={this.loading}
          value={this.displayedValue}
          onUpdateValue={this.handleUpdateDisplayedValue}
          theme={this.mergedTheme.peers.Input}
          themeOverrides={this.mergedTheme.peerOverrides.Input}
          builtinThemeOverrides={this.inputThemeOverrides}
          size={this.mergedSize}
          placeholder={this.mergedPlaceholder}
          disabled={this.mergedDisabled}
          readonly={this.mergedReadonly as any}
          round={this.round}
          textDecoration={
            this.displayedValueInvalid ? 'line-through' : undefined
          }
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeydown={this.handleKeyDown}
          onMousedown={this.handleMouseDown}
          onClear={this.handleClear}
          clearable={this.clearable}
          inputProps={this.inputProps}
          internalLoadingBeforeSuffix
        >
          {{
            prefix: () =>
              this.showButton && this.buttonPlacement === 'both'
                ? [
                    renderMinusButton(),
                    resolveWrappedSlot($slots.prefix, (children) => {
                      if (children) {
                        return (
                          <span
                            class={`${mergedClsPrefix}-input-number-prefix`}
                          >
                            {children}
                          </span>
                        )
                      }
                      return null
                    })
                  ]
                : $slots.prefix?.(),
            suffix: () =>
              this.showButton
                ? [
                    resolveWrappedSlot($slots.suffix, (children) => {
                      if (children) {
                        return (
                          <span
                            class={`${mergedClsPrefix}-input-number-suffix`}
                          >
                            {children}
                          </span>
                        )
                      }
                      return null
                    }),
                    this.buttonPlacement === 'right-vertical' ? (
                      <div class={`${mergedClsPrefix}-input-number-stepper`}>
                        {renderAddButton()}
                        {renderMinusButton()}
                      </div>
                    ) : this.buttonPlacement === 'right' ? (
                      renderMinusButton()
                    ) : null,
                    this.buttonPlacement === 'right-vertical'
                      ? null
                      : renderAddButton()
                  ]
                : $slots.suffix?.()
          }}
        </NInput>
      </div>
    )
    return renderInputAddons(control, this.$slots, this.mergedSize)
  }
})
