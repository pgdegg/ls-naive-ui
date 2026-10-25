import type {
  CSSProperties,
  ExtractPropTypes,
  Ref,
  SlotsType,
  VNode
} from 'vue'
import type { InputInst, InputProps } from '../../input'
import type { TimePickerSize } from '../../time-picker/src/public-types'
import type {
  FormattedValue,
  OnConfirmImpl,
  OnUpdateFormattedValueImpl,
  OnUpdateValueImpl,
  PanelRef,
  Value
} from './interface'
import type { UsePanelCommonProps } from './panel/use-panel-common'
import type { DatePickerInst, DatePickerSize } from './public-types'
import { format, getTime, isValid } from 'date-fns'
import { getPreciseEventTarget, happensIn } from 'seemly'
import { clickoutside } from 'vdirs'
import { useIsMounted, useMergedState } from 'vooks'
import {
  computed,
  defineComponent,
  h,
  provide,
  ref,
  toRef,
  Transition,
  watch,
  watchEffect,
  withDirectives
} from 'vue'
import { VBinder, VFollower, VTarget } from 'vueuc'
import { NBaseIcon } from '../../_internal'
import { DateIcon, ToIcon } from '../../_internal/icons'
import { renderInputAddons } from '../../_internal/input-addons'
import {
  useConfig,
  useFormItem,
  useLocale,
  useTheme,
  useThemeClass
} from '../../_mixins'
import {
  call,
  createKey,
  markEventEffectPerformed,
  resolveSlot,
  useAdjustedTo,
  warn,
  warnOnce
} from '../../_utils'
import { parseQuickInput } from '../../composables/quick-input'
import { useInputElement } from '../../composables/use-input-element'
import { NInput } from '../../input'
import { datePickerLight } from '../styles'
import { datePickerInjectionKey } from './interface'
import DatePanel from './panel/date'
import DaterangePanel from './panel/daterange'
import DatetimePanel from './panel/datetime'
import DatetimerangePanel from './panel/datetimerange'
import MonthPanel from './panel/month'
import MonthRangePanel from './panel/monthrange'
import { datePickerProps } from './props'
import style from './styles/index.cssr'
import { strictParse } from './utils'
import {
  dualCalendarValidation,
  uniCalendarValidation
} from './validation-utils'

export type DatePickerSetupProps = ExtractPropTypes<typeof datePickerProps>

export interface DatePickerSlots {
  prepend?: () => VNode[]
  append?: () => VNode[]
  'date-icon'?: () => VNode[]
  footer?: () => VNode[]
  'next-month'?: () => VNode[]
  'next-year'?: () => VNode[]
  'prev-month'?: () => VNode[]
  'prev-year'?: () => VNode[]
  separator?: () => VNode[]
  confirm?: (props: {
    onConfirm: () => void
    disabled: boolean
    text: string
  }) => VNode[]
  clear?: (props: { onClear: () => void, text: string }) => VNode[]
  now?: (props: { onNow: () => void, text: string }) => VNode[]
}

export default defineComponent({
  name: 'DatePicker',
  props: datePickerProps,
  slots: Object as SlotsType<DatePickerSlots>,
  setup(props, { slots }) {
    if (__DEV__) {
      watchEffect(() => {
        if (props.onChange !== undefined) {
          warnOnce(
            'date-picker',
            '`on-change` is deprecated, please use `on-update:value` instead.'
          )
        }
      })
    }
    const { localeRef, dateLocaleRef } = useLocale('DatePicker')
    const {
      mergedComponentPropsRef,
      mergedClsPrefixRef,
      mergedBorderedRef,
      namespaceRef,
      inlineThemeDisabled
    } = useConfig(props)
    const formItem = useFormItem(props, {
      mergedSize: (NFormItem) => {
        const { size } = props
        if (size)
          return size
        const { mergedSize: formItemSize } = NFormItem || {}
        if (formItemSize?.value)
          return formItemSize.value as DatePickerSize
        const configSize = mergedComponentPropsRef?.value?.DatePicker?.size
        if (configSize)
          return configSize
        return 'medium'
      }
    })
    const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem
    const panelInstRef = ref<PanelRef | null>(null)
    const triggerElRef = ref<HTMLElement | null>(null)
    const inputInstRef = ref<InputInst | null>(null)
    const inputElement = useInputElement<
      HTMLInputElement | HTMLTextAreaElement
    >(() => inputInstRef.value?.inputElement)
    const uncontrolledShowRef = ref<boolean>(false)
    const controlledShowRef = toRef(props, 'show')
    const mergedShowRef = useMergedState(controlledShowRef, uncontrolledShowRef)
    const dateFnsOptionsRef = computed(() => {
      return {
        locale: dateLocaleRef.value.locale,
        useAdditionalWeekYearTokens: true
      }
    })

    const mergedFormatRef = computed(() => {
      const { format } = props
      if (format)
        return format
      switch (props.type) {
        case 'date':
        case 'daterange':
          return localeRef.value.dateFormat
        case 'datetime':
        case 'datetimerange':
          return localeRef.value.dateTimeFormat
        case 'year':
        case 'yearrange':
          return localeRef.value.yearTypeFormat
        case 'month':
        case 'monthrange':
          return localeRef.value.monthTypeFormat
        case 'quarter':
        case 'quarterrange':
          return localeRef.value.quarterFormat
        case 'week':
          return localeRef.value.weekFormat
      }
    })
    const mergedValueFormatRef = computed(() => {
      return props.valueFormat ?? mergedFormatRef.value
    })

    function getTimestampValue(value: FormattedValue | null): Value | null {
      if (value === null)
        return null
      const { value: mergedValueFormat } = mergedValueFormatRef
      const { value: dateFnsOptions } = dateFnsOptionsRef
      if (Array.isArray(value)) {
        return [
          strictParse(
            value[0],
            mergedValueFormat,
            new Date(),
            dateFnsOptions
          ).getTime(),
          strictParse(
            value[1],
            mergedValueFormat,
            new Date(),
            dateFnsOptions
          ).getTime()
        ]
      }
      return strictParse(
        value,
        mergedValueFormat,
        new Date(),
        dateFnsOptions
      ).getTime()
    }

    const { defaultFormattedValue, defaultValue } = props

    const uncontrolledValueRef = ref(
      (defaultFormattedValue !== undefined
        ? getTimestampValue(defaultFormattedValue)
        : defaultValue) ?? null
    )
    const controlledValueRef = computed(() => {
      const { formattedValue } = props
      if (formattedValue !== undefined) {
        return getTimestampValue(formattedValue)
      }
      return props.value
    })
    const mergedValueRef = useMergedState(
      controlledValueRef,
      uncontrolledValueRef
    )

    // 除非触发 blur 或 confirm，否则我们不会改变 value
    const pendingValueRef: Ref<Value | null> = ref(null)
    watchEffect(() => {
      pendingValueRef.value = mergedValueRef.value
    })
    const singleInputValueRef = ref('')
    const rangeStartInputValueRef = ref('')
    const rangeEndInputValueRef = ref('')
    const themeRef = useTheme(
      'DatePicker',
      '-date-picker',
      style,
      datePickerLight,
      props,
      mergedClsPrefixRef
    )
    const timePickerSizeRef = computed<TimePickerSize>(() => {
      return (
        mergedComponentPropsRef?.value?.DatePicker?.timePickerSize || 'small'
      )
    })
    const isRangeRef = computed(() => {
      return [
        'daterange',
        'datetimerange',
        'monthrange',
        'quarterrange',
        'yearrange'
      ].includes(props.type)
    })
    const localizedPlacehoderRef = computed(() => {
      const { placeholder } = props
      if (placeholder === undefined) {
        const { type } = props
        switch (type) {
          case 'date':
            return localeRef.value.datePlaceholder
          case 'datetime':
            return localeRef.value.datetimePlaceholder
          case 'month':
            return localeRef.value.monthPlaceholder
          case 'year':
            return localeRef.value.yearPlaceholder
          case 'quarter':
            return localeRef.value.quarterPlaceholder
          case 'week':
            return localeRef.value.weekPlaceholder
          default:
            return ''
        }
      }
      else {
        return placeholder
      }
    })
    const localizedStartPlaceholderRef = computed(() => {
      if (props.startPlaceholder === undefined) {
        if (props.type === 'daterange') {
          return localeRef.value.startDatePlaceholder
        }
        else if (props.type === 'datetimerange') {
          return localeRef.value.startDatetimePlaceholder
        }
        else if (props.type === 'monthrange') {
          return localeRef.value.startMonthPlaceholder
        }
        return ''
      }
      else {
        return props.startPlaceholder
      }
    })
    const localizedEndPlaceholderRef = computed(() => {
      if (props.endPlaceholder === undefined) {
        if (props.type === 'daterange') {
          return localeRef.value.endDatePlaceholder
        }
        else if (props.type === 'datetimerange') {
          return localeRef.value.endDatetimePlaceholder
        }
        else if (props.type === 'monthrange') {
          return localeRef.value.endMonthPlaceholder
        }
        return ''
      }
      else {
        return props.endPlaceholder
      }
    })
    const mergedActionsRef = computed(() => {
      const { actions, type, clearable } = props
      if (actions === null)
        return []
      if (actions !== undefined)
        return actions
      const result = clearable ? ['clear'] : []
      switch (type) {
        case 'date':
        case 'week': {
          result.push('now')
          return result
        }
        case 'datetime': {
          result.push('now', 'confirm')
          return result
        }
        case 'daterange': {
          result.push('confirm')
          return result
        }
        case 'datetimerange': {
          result.push('confirm')
          return result
        }
        case 'month': {
          result.push('now', 'confirm')
          return result
        }
        case 'year': {
          result.push('now')
          return result
        }
        case 'quarter': {
          result.push('now', 'confirm')
          return result
        }
        case 'monthrange':
        case 'yearrange':
        case 'quarterrange': {
          result.push('confirm')
          return result
        }
        default: {
          warn(
            'date-picker',
            'The type is wrong, n-date-picker\'s type only supports `date`, `datetime`, `daterange` and `datetimerange`.'
          )
          break
        }
      }
    })
    function getFormattedValue(value: Value | null): FormattedValue | null {
      if (value === null)
        return null
      if (Array.isArray(value)) {
        const { value: mergedValueFormat } = mergedValueFormatRef
        const { value: dateFnsOptions } = dateFnsOptionsRef
        return [
          format(value[0], mergedValueFormat, dateFnsOptions),
          format(value[1], mergedValueFormat, dateFnsOptionsRef.value)
        ]
      }
      else {
        return format(
          value,
          mergedValueFormatRef.value,
          dateFnsOptionsRef.value
        )
      }
    }
    function doUpdatePendingValue(value: Value | null): void {
      pendingValueRef.value = value
    }
    function doUpdateFormattedValue(
      value: FormattedValue | null,
      timestampValue: Value | null
    ): void {
      const {
        'onUpdate:formattedValue': _onUpdateFormattedValue,
        onUpdateFormattedValue
      } = props
      if (_onUpdateFormattedValue) {
        call(
          _onUpdateFormattedValue as OnUpdateFormattedValueImpl,
          value,
          timestampValue
        )
      }
      if (onUpdateFormattedValue) {
        call(
          onUpdateFormattedValue as OnUpdateFormattedValueImpl,
          value,
          timestampValue
        )
      }
    }
    function doUpdateValue(
      value: Value | null,
      options: {
        doConfirm: boolean
      }
    ): void {
      const {
        'onUpdate:value': _onUpdateValue,
        onUpdateValue,
        onChange
      } = props
      const { nTriggerFormChange, nTriggerFormInput } = formItem
      const formattedValue = getFormattedValue(value)
      if (options.doConfirm) {
        doConfirm(value, formattedValue)
      }
      if (onUpdateValue) {
        call(onUpdateValue as OnUpdateValueImpl, value, formattedValue)
      }
      if (_onUpdateValue) {
        call(_onUpdateValue as OnUpdateValueImpl, value, formattedValue)
      }
      if (onChange)
        call(onChange as OnUpdateValueImpl, value, formattedValue)
      uncontrolledValueRef.value = value

      doUpdateFormattedValue(formattedValue, value)

      nTriggerFormChange()
      nTriggerFormInput()
    }
    function doClear(): void {
      const { onClear } = props
      onClear?.()
    }
    function doConfirm(
      value: Value | null,
      formattedValue: FormattedValue | null
    ): void {
      const { onConfirm } = props
      if (onConfirm)
        (onConfirm as OnConfirmImpl)(value, formattedValue)
    }
    function doFocus(e: FocusEvent): void {
      const { onFocus } = props
      const { nTriggerFormFocus } = formItem
      if (onFocus)
        call(onFocus, e)
      nTriggerFormFocus()
    }
    function doBlur(e: FocusEvent): void {
      const { onBlur } = props
      const { nTriggerFormBlur } = formItem
      if (onBlur)
        call(onBlur, e)
      nTriggerFormBlur()
    }
    function doUpdateShow(show: boolean): void {
      const { 'onUpdate:show': _onUpdateShow, onUpdateShow } = props
      if (_onUpdateShow)
        call(_onUpdateShow, show)
      if (onUpdateShow)
        call(onUpdateShow, show)
      uncontrolledShowRef.value = show
    }
    function handleKeydown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        if (mergedShowRef.value) {
          markEventEffectPerformed(e)
          closeCalendar({
            returnFocus: true
          })
        }
      }
      // 我们需要处理与普通日期值输入之间的冲突
      // const { value: mergedValue } = mergedValueRef
      // if (props.type === 'date' && !Array.isArray(mergedValue)) {
      //   const nextValue = getDerivedTimeFromKeyboardEvent(mergedValue, e)
      //   doUpdateValue(nextValue)
      // }
    }
    const uniVaidation = uniCalendarValidation(props, pendingValueRef)
    const dualValidation = dualCalendarValidation(props, pendingValueRef)
    function handleInputKeydown(e: KeyboardEvent): void {
      if (
        props.quickInput
        && e.key === 'Enter'
        && !e.isComposing
        && !mergedDisabledRef.value
        && !formItem.mergedReadonlyRef.value
        && !props.inputReadonly
      ) {
        const target = e.target as HTMLInputElement
        const inputs
          = inputInstRef.value?.wrapperElRef?.querySelectorAll('input')
        const isEnd = isRangeRef.value && target === inputs?.[1]
        const parsed = parseQuickInput(target.value, {
          type: props.type.includes('time') ? 'date-time' : 'date',
          defaultToExtreme: props.defaultToExtreme ?? (isEnd ? 'max' : 'min')
        })
        if (!parsed)
          return
        const timestamp = parsed.getTime()
        const previous = pendingValueRef.value
        const start = Array.isArray(previous) ? previous[0] : timestamp
        pendingValueRef.value = isRangeRef.value
          ? isEnd
            ? [start, timestamp]
            : [timestamp, timestamp]
          : timestamp
        const invalid = isRangeRef.value
          ? dualValidation.isStartValueInvalidRef.value
          || (isEnd
            && (timestamp < start || dualValidation.isEndValueInvalidRef.value))
          : uniVaidation.isValueInvalidRef.value
        if (invalid) {
          pendingValueRef.value = previous
          return
        }
        e.preventDefault()
        if (isRangeRef.value && !isEnd) {
          rangeStartInputValueRef.value = format(
            timestamp,
            mergedFormatRef.value,
            dateFnsOptionsRef.value
          )
          inputs?.[1]?.focus()
          return
        }
        doUpdateValue(pendingValueRef.value, { doConfirm: true })
        deriveInputState()
        closeCalendar({ returnFocus: false })
      }
      if (e.key === 'Escape' && mergedShowRef.value) {
        markEventEffectPerformed(e)
        // closeCalendar 将在 handleDeactivated 中被调用
      }
    }
    function handleClear(): void {
      doUpdateShow(false)
      inputInstRef.value?.deactivate()
      doClear()
    }
    function handlePanelClear(): void {
      // close 将在面板内部被调用
      inputInstRef.value?.deactivate()
      doClear()
    }
    function handlePanelTabOut(): void {
      closeCalendar({
        returnFocus: true
      })
    }
    function handleClickOutside(e: MouseEvent): void {
      if (
        mergedShowRef.value
        && !triggerElRef.value?.contains(getPreciseEventTarget(e) as Node | null)
      ) {
        closeCalendar({
          returnFocus: false
        })
      }
    }
    function handlePanelClose(disableUpdateOnClose: boolean): void {
      closeCalendar({
        returnFocus: true,
        disableUpdateOnClose
      })
    }

    // --- 面板更新值
    function handlePanelUpdateValue(
      value: Value | null,
      doUpdate: boolean
    ): void {
      if (doUpdate) {
        doUpdateValue(value, { doConfirm: false })
      }
      else {
        doUpdatePendingValue(value)
      }
    }
    function handlePanelConfirm(): void {
      const pendingValue = pendingValueRef.value
      doUpdateValue(
        Array.isArray(pendingValue)
          ? [pendingValue[0], pendingValue[1]]
          : pendingValue,
        { doConfirm: true }
      )
    }
    // --- 刷新
    function deriveInputState(): void {
      const { value } = pendingValueRef
      if (isRangeRef.value) {
        if (Array.isArray(value) || value === null) {
          deriveRangeInputState(value)
        }
      }
      else {
        if (!Array.isArray(value)) {
          deriveSingleInputState(value)
        }
      }
    }
    function deriveSingleInputState(value: number | null): void {
      if (value === null) {
        singleInputValueRef.value = ''
      }
      else {
        singleInputValueRef.value = format(
          value,
          mergedFormatRef.value,
          dateFnsOptionsRef.value
        )
      }
    }
    function deriveRangeInputState(values: [number, number] | null): void {
      if (values === null) {
        rangeStartInputValueRef.value = ''
        rangeEndInputValueRef.value = ''
      }
      else {
        const dateFnsOptions = dateFnsOptionsRef.value
        rangeStartInputValueRef.value = format(
          values[0],
          mergedFormatRef.value,
          dateFnsOptions
        )
        rangeEndInputValueRef.value = format(
          values[1],
          mergedFormatRef.value,
          dateFnsOptions
        )
      }
    }
    // --- 输入 deactivate & blur
    function handleInputActivate(): void {
      if (!mergedShowRef.value) {
        openCalendar()
      }
    }
    function handleInputBlur(e: FocusEvent): void {
      if (!panelInstRef.value?.$el.contains(e.relatedTarget as Node)) {
        doBlur(e)
        deriveInputState()
        closeCalendar({
          returnFocus: false
        })
      }
    }
    function handleInputDeactivate(): void {
      if (mergedDisabledRef.value)
        return
      deriveInputState()
      closeCalendar({
        returnFocus: false
      })
    }
    // --- 输入
    function handleSingleUpdateValue(v: string): void {
      // TODO，修复与 clear 的冲突
      if (v === '') {
        doUpdateValue(null, { doConfirm: false })
        pendingValueRef.value = null
        singleInputValueRef.value = ''
        return
      }
      const newSelectedDateTime = strictParse(
        v,
        mergedFormatRef.value,
        new Date(),
        dateFnsOptionsRef.value
      )
      if (isValid(newSelectedDateTime)) {
        doUpdateValue(getTime(newSelectedDateTime), { doConfirm: false })
        deriveInputState()
      }
      else {
        singleInputValueRef.value = v
      }
    }
    function handleRangeUpdateValue(
      v: [string, string],
      { source }: { source: 0 | 1 | 'clear' }
    ): void {
      if (v[0] === '' && v[1] === '') {
        // 清除，或者直接删除全部输入内容
        doUpdateValue(null, { doConfirm: false })
        pendingValueRef.value = null
        rangeStartInputValueRef.value = ''
        rangeEndInputValueRef.value = ''
        return
      }
      const [startTime, endTime] = v
      const newStartTime = strictParse(
        startTime,
        mergedFormatRef.value,
        new Date(),
        dateFnsOptionsRef.value
      )
      const newEndTime = strictParse(
        endTime,
        mergedFormatRef.value,
        new Date(),
        dateFnsOptionsRef.value
      )
      if (isValid(newStartTime) && isValid(newEndTime)) {
        let newStartTs = getTime(newStartTime)
        let newEndTs = getTime(newEndTime)
        if (newEndTime < newStartTime) {
          if (source === 0) {
            newEndTs = newStartTs
          }
          else {
            newStartTs = newEndTs
          }
        }
        doUpdateValue([newStartTs, newEndTs], {
          doConfirm: false
        })
        deriveInputState()
      }
      else {
        ;[rangeStartInputValueRef.value, rangeEndInputValueRef.value] = v
      }
    }
    // --- 点击
    function handleTriggerClick(e: MouseEvent): void {
      if (mergedDisabledRef.value)
        return
      if (happensIn(e, 'clear'))
        return
      if (!mergedShowRef.value) {
        openCalendar()
      }
    }
    // --- 聚焦
    function handleInputFocus(e: FocusEvent): void {
      if (mergedDisabledRef.value)
        return
      doFocus(e)
    }
    // --- 日历
    function openCalendar(): void {
      if (mergedDisabledRef.value || mergedShowRef.value)
        return
      doUpdateShow(true)
    }
    function closeCalendar({
      returnFocus,
      disableUpdateOnClose
    }: {
      returnFocus: boolean
      disableUpdateOnClose?: boolean
    }): void {
      if (mergedShowRef.value) {
        doUpdateShow(false)
        if (
          props.type !== 'date'
          && props.updateValueOnClose
          && !disableUpdateOnClose
        ) {
          handlePanelConfirm()
        }
        if (returnFocus) {
          inputInstRef.value?.focus()
        }
      }
    }
    // 如果新值有效，设置 calendarTime 并刷新展示字符串。
    // 如果新值无效，则不做任何处理。
    watch(pendingValueRef, () => {
      deriveInputState()
    })
    // 初始化
    deriveInputState()

    watch(mergedShowRef, (value) => {
      if (!value) {
        // 关闭并恢复原始值
        // 它不会与 props.value 的变更冲突
        // 因为传入 prop 时，它本身已经
        // 是最新的。
        pendingValueRef.value = mergedValueRef.value
      }
    })

    // 使用 pending 值进行校验
    provide(datePickerInjectionKey, {
      mergedClsPrefixRef,
      mergedThemeRef: themeRef,
      timePickerSizeRef,
      localeRef,
      dateLocaleRef,
      firstDayOfWeekRef: toRef(props, 'firstDayOfWeek'),
      isDateDisabledRef: toRef(props, 'isDateDisabled'),
      rangesRef: toRef(props, 'ranges'),
      timePickerPropsRef: toRef(props, 'timePickerProps'),
      closeOnSelectRef: toRef(props, 'closeOnSelect'),
      updateValueOnCloseRef: toRef(props, 'updateValueOnClose'),
      monthFormatRef: toRef(props, 'monthFormat'),
      yearFormatRef: toRef(props, 'yearFormat'),
      quarterFormatRef: toRef(props, 'quarterFormat'),
      yearRangeRef: toRef(props, 'yearRange'),
      ...uniVaidation,
      ...dualValidation,
      datePickerSlots: slots
    })

    const exposedMethods: DatePickerInst = {
      get inputElement() {
        return inputElement.value
      },
      focus: () => {
        inputInstRef.value?.focus()
      },
      blur: () => {
        inputInstRef.value?.blur()
      }
    }

    const triggerCssVarsRef = computed(() => {
      const {
        common: { cubicBezierEaseInOut },
        self: { iconColor, iconColorDisabled }
      } = themeRef.value
      return {
        '--n-bezier': cubicBezierEaseInOut,
        '--n-icon-color-override': iconColor,
        '--n-icon-color-disabled-override': iconColorDisabled
      }
    })
    const triggerThemeClassHandle = inlineThemeDisabled
      ? useThemeClass(
          'date-picker-trigger',
          undefined,
          triggerCssVarsRef,
          props
        )
      : undefined

    const cssVarsRef = computed(() => {
      const { type } = props
      const {
        common: { cubicBezierEaseInOut },
        self: {
          calendarTitleFontSize,
          calendarDaysFontSize,
          itemFontSize,
          itemTextColor,
          itemColorDisabled,
          itemColorIncluded,
          itemColorHover,
          itemColorActive,
          itemBorderRadius,
          itemTextColorDisabled,
          itemTextColorActive,
          panelColor,
          panelTextColor,
          arrowColor,
          calendarTitleTextColor,
          panelActionDividerColor,
          panelHeaderDividerColor,
          calendarDaysDividerColor,
          panelBoxShadow,
          panelBorderRadius,
          calendarTitleFontWeight,
          panelExtraFooterPadding,
          panelActionPadding,
          itemSize,
          itemCellWidth,
          itemCellHeight,
          scrollItemWidth,
          scrollItemHeight,
          calendarTitlePadding,
          calendarTitleHeight,
          calendarDaysHeight,
          calendarDaysTextColor,
          arrowSize,
          panelHeaderPadding,
          calendarDividerColor,
          calendarTitleGridTempateColumns,
          iconColor,
          iconColorDisabled,
          scrollItemBorderRadius,
          calendarTitleColorHover,
          [createKey('calendarLeftPadding', type)]: calendarLeftPadding,
          [createKey('calendarRightPadding', type)]: calendarRightPadding
        }
      } = themeRef.value
      return {
        '--n-bezier': cubicBezierEaseInOut,

        '--n-panel-border-radius': panelBorderRadius,
        '--n-panel-color': panelColor,
        '--n-panel-box-shadow': panelBoxShadow,
        '--n-panel-text-color': panelTextColor,

        // 面板头部
        '--n-panel-header-padding': panelHeaderPadding,
        '--n-panel-header-divider-color': panelHeaderDividerColor,

        // 面板日历
        '--n-calendar-left-padding': calendarLeftPadding,
        '--n-calendar-right-padding': calendarRightPadding,
        '--n-calendar-title-color-hover': calendarTitleColorHover,
        '--n-calendar-title-height': calendarTitleHeight,
        '--n-calendar-title-padding': calendarTitlePadding,
        '--n-calendar-title-font-size': calendarTitleFontSize,
        '--n-calendar-title-font-weight': calendarTitleFontWeight,
        '--n-calendar-title-text-color': calendarTitleTextColor,
        '--n-calendar-title-grid-template-columns':
          calendarTitleGridTempateColumns,
        '--n-calendar-days-height': calendarDaysHeight,
        '--n-calendar-days-divider-color': calendarDaysDividerColor,
        '--n-calendar-days-font-size': calendarDaysFontSize,
        '--n-calendar-days-text-color': calendarDaysTextColor,
        '--n-calendar-divider-color': calendarDividerColor,

        // 面板操作区
        '--n-panel-action-padding': panelActionPadding,
        '--n-panel-extra-footer-padding': panelExtraFooterPadding,
        '--n-panel-action-divider-color': panelActionDividerColor,

        // 面板项
        '--n-item-font-size': itemFontSize,
        '--n-item-border-radius': itemBorderRadius,
        '--n-item-size': itemSize,
        '--n-item-cell-width': itemCellWidth,
        '--n-item-cell-height': itemCellHeight,
        '--n-item-text-color': itemTextColor,
        '--n-item-color-included': itemColorIncluded,
        '--n-item-color-disabled': itemColorDisabled,
        '--n-item-color-hover': itemColorHover,
        '--n-item-color-active': itemColorActive,
        '--n-item-text-color-disabled': itemTextColorDisabled,
        '--n-item-text-color-active': itemTextColorActive,

        // 滚动项
        '--n-scroll-item-width': scrollItemWidth,
        '--n-scroll-item-height': scrollItemHeight,
        '--n-scroll-item-border-radius': scrollItemBorderRadius,

        // 面板箭头
        '--n-arrow-size': arrowSize,
        '--n-arrow-color': arrowColor,

        // 触发器中的图标
        '--n-icon-color': iconColor,
        '--n-icon-color-disabled': iconColorDisabled
      }
    })
    const themeClassHandle = inlineThemeDisabled
      ? useThemeClass(
          'date-picker',
          computed(() => {
            return props.type
          }),
          cssVarsRef,
          props
        )
      : undefined

    return {
      ...exposedMethods,
      inputElement,
      mergedStatus: mergedStatusRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      namespace: namespaceRef,
      uncontrolledValue: uncontrolledValueRef,
      pendingValue: pendingValueRef,
      // 减少 dts：仅字符串 ref，render 中未使用类型
      panelInstRef: panelInstRef as unknown,
      triggerElRef,
      // 减少 dts：仅字符串 ref，render 中未使用类型
      inputInstRef: inputInstRef as unknown,
      isMounted: useIsMounted(),
      displayTime: singleInputValueRef,
      displayStartTime: rangeStartInputValueRef,
      displayEndTime: rangeEndInputValueRef,
      mergedShow: mergedShowRef,
      adjustedTo: useAdjustedTo(props),
      isRange: isRangeRef,
      localizedStartPlaceholder: localizedStartPlaceholderRef,
      localizedEndPlaceholder: localizedEndPlaceholderRef,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      localizedPlacehoder: localizedPlacehoderRef,
      isValueInvalid: uniVaidation.isValueInvalidRef,
      isStartValueInvalid: dualValidation.isStartValueInvalidRef,
      isEndValueInvalid: dualValidation.isEndValueInvalidRef,
      handleInputKeydown,
      handleClickOutside,
      handleKeydown,
      handleClear,
      handlePanelClear,
      handleTriggerClick,
      handleInputActivate,
      handleInputDeactivate,
      handleInputFocus,
      handleInputBlur,
      handlePanelTabOut,
      handlePanelClose,
      handleRangeUpdateValue,
      handleSingleUpdateValue,
      handlePanelUpdateValue,
      handlePanelConfirm,
      mergedTheme: themeRef,
      actions: mergedActionsRef,
      triggerCssVars: inlineThemeDisabled
        ? undefined
        : (triggerCssVarsRef as Ref<CSSProperties>),
      triggerThemeClass: triggerThemeClassHandle?.themeClass,
      triggerOnRender: triggerThemeClassHandle?.onRender,
      cssVars: inlineThemeDisabled
        ? undefined
        : (cssVarsRef as Ref<CSSProperties>),
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      onNextMonth: props.onNextMonth,
      onPrevMonth: props.onPrevMonth,
      onNextYear: props.onNextYear,
      onPrevYear: props.onPrevYear
    }
  },
  render() {
    const { clearable, triggerOnRender, mergedClsPrefix, $slots } = this
    const commonPanelProps: UsePanelCommonProps & {
      ref: string
      style: CSSProperties
    } = {
      onUpdateValue: this.handlePanelUpdateValue,
      onTabOut: this.handlePanelTabOut,
      onClose: this.handlePanelClose,
      onClear: this.handlePanelClear,
      onKeydown: this.handleKeydown,
      onConfirm: this.handlePanelConfirm,
      ref: 'panelInstRef',
      value: this.pendingValue,
      active: this.mergedShow,
      actions: this.actions,
      shortcuts: this.shortcuts,
      style: this.cssVars as CSSProperties,
      defaultTime: this.defaultTime,
      themeClass: this.themeClass,
      panel: this.panel,
      inputReadonly: this.inputReadonly || this.mergedDisabled,
      onRender: this.onRender,
      onNextMonth: this.onNextMonth,
      onPrevMonth: this.onPrevMonth,
      onNextYear: this.onNextYear,
      onPrevYear: this.onPrevYear,
      timePickerFormat: this.timePickerFormat,
      dateFormat: this.dateFormat,
      fastYearSelect: this.fastYearSelect,
      fastMonthSelect: this.fastMonthSelect,
      calendarDayFormat: this.calendarDayFormat,
      calendarHeaderYearFormat: this.calendarHeaderYearFormat,
      calendarHeaderMonthFormat: this.calendarHeaderMonthFormat,
      calendarHeaderMonthYearSeparator: this.calendarHeaderMonthYearSeparator,
      calendarHeaderMonthBeforeYear: this.calendarHeaderMonthBeforeYear
    }
    const renderPanel = (): VNode => {
      const { type } = this
      return type === 'datetime' ? (
        <DatetimePanel
          {...commonPanelProps}
          defaultCalendarStartTime={this.defaultCalendarStartTime}
        >
          {$slots}
        </DatetimePanel>
      ) : type === 'daterange' ? (
        <DaterangePanel
          {...commonPanelProps}
          defaultCalendarStartTime={this.defaultCalendarStartTime}
          defaultCalendarEndTime={this.defaultCalendarEndTime}
          bindCalendarMonths={this.bindCalendarMonths}
        >
          {$slots}
        </DaterangePanel>
      ) : type === 'datetimerange' ? (
        <DatetimerangePanel
          {...commonPanelProps}
          defaultCalendarStartTime={this.defaultCalendarStartTime}
          defaultCalendarEndTime={this.defaultCalendarEndTime}
          bindCalendarMonths={this.bindCalendarMonths}
        >
          {$slots}
        </DatetimerangePanel>
      ) : type === 'month' || type === 'year' || type === 'quarter' ? (
        <MonthPanel {...commonPanelProps} type={type} key={type} />
      ) : type === 'monthrange'
        || type === 'yearrange'
        || type === 'quarterrange' ? (
            <MonthRangePanel {...commonPanelProps} type={type} />
          ) : (
            <DatePanel
              {...commonPanelProps}
              type={type}
              defaultCalendarStartTime={this.defaultCalendarStartTime}
            >
              {$slots}
            </DatePanel>
          )
    }
    if (this.panel) {
      return renderPanel()
    }
    triggerOnRender?.()
    const commonInputProps: InputProps = {
      bordered: this.mergedBordered,
      size: this.mergedSize,
      passivelyActivated: true,
      disabled: this.mergedDisabled,
      readonly: this.inputReadonly || this.mergedDisabled,
      clearable,
      onClear: this.handleClear,
      onClick: this.handleTriggerClick,
      onKeydown: this.handleInputKeydown,
      onActivate: this.handleInputActivate,
      onDeactivate: this.handleInputDeactivate,
      onFocus: this.handleInputFocus,
      onBlur: this.handleInputBlur
    }
    const control = (
      <div
        ref="triggerElRef"
        class={[
          `${mergedClsPrefix}-date-picker`,
          this.mergedDisabled && `${mergedClsPrefix}-date-picker--disabled`,
          this.isRange && `${mergedClsPrefix}-date-picker--range`,
          this.triggerThemeClass
        ]}
        style={this.triggerCssVars as CSSProperties}
        onKeydown={this.handleKeydown}
      >
        <VBinder>
          {{
            default: () => [
              <VTarget>
                {{
                  default: () =>
                    this.isRange ? (
                      <NInput
                        hidePlaceholder={this.hidePlaceholder}
                        ignoreParentHidePlaceholder={
                          this.ignoreParentHidePlaceholder
                        }
                        ignoreParentReadonly={this.ignoreParentReadonly}
                        ref="inputInstRef"
                        status={this.mergedStatus}
                        value={[this.displayStartTime, this.displayEndTime]}
                        placeholder={[
                          this.localizedStartPlaceholder,
                          this.localizedEndPlaceholder
                        ]}
                        textDecoration={[
                          this.isStartValueInvalid ? 'line-through' : '',
                          this.isEndValueInvalid ? 'line-through' : ''
                        ]}
                        pair
                        onUpdateValue={this.handleRangeUpdateValue}
                        theme={this.mergedTheme.peers.Input}
                        themeOverrides={this.mergedTheme.peerOverrides.Input}
                        internalForceFocus={this.mergedShow}
                        internalDeactivateOnEnter
                        {...commonInputProps}
                      >
                        {{
                          separator: () =>
                            this.separator === undefined
                              ? resolveSlot($slots.separator, () => [
                                  <NBaseIcon
                                    clsPrefix={mergedClsPrefix}
                                    class={`${mergedClsPrefix}-date-picker-icon`}
                                  >
                                    {{
                                      default: () => <ToIcon />
                                    }}
                                  </NBaseIcon>
                                ])
                              : this.separator,
                          [clearable ? 'clear-icon-placeholder' : 'suffix']:
                            () =>
                              resolveSlot($slots['date-icon'], () => [
                                <NBaseIcon
                                  clsPrefix={mergedClsPrefix}
                                  class={`${mergedClsPrefix}-date-picker-icon`}
                                >
                                  {{
                                    default: () => <DateIcon />
                                  }}
                                </NBaseIcon>
                              ])
                        }}
                      </NInput>
                    ) : (
                      <NInput
                        ref="inputInstRef"
                        status={this.mergedStatus}
                        value={this.displayTime}
                        placeholder={this.localizedPlacehoder}
                        textDecoration={
                          this.isValueInvalid && !this.isRange
                            ? 'line-through'
                            : ''
                        }
                        onUpdateValue={this.handleSingleUpdateValue}
                        theme={this.mergedTheme.peers.Input}
                        themeOverrides={this.mergedTheme.peerOverrides.Input}
                        internalForceFocus={this.mergedShow}
                        internalDeactivateOnEnter
                        {...commonInputProps}
                      >
                        {{
                          [clearable ? 'clear-icon-placeholder' : 'suffix']:
                            () => (
                              <NBaseIcon
                                clsPrefix={mergedClsPrefix}
                                class={`${mergedClsPrefix}-date-picker-icon`}
                              >
                                {{
                                  default: () =>
                                    resolveSlot($slots['date-icon'], () => [
                                      <DateIcon />
                                    ])
                                }}
                              </NBaseIcon>
                            )
                        }}
                      </NInput>
                    )
                }}
              </VTarget>,
              <VFollower
                show={this.mergedShow}
                containerClass={this.namespace}
                to={this.adjustedTo}
                teleportDisabled={this.adjustedTo === useAdjustedTo.tdkey}
                placement={this.placement}
              >
                {{
                  default: () => (
                    <Transition
                      name="fade-in-scale-up-transition"
                      appear={this.isMounted}
                    >
                      {{
                        default: () => {
                          if (!this.mergedShow)
                            return null
                          return withDirectives(renderPanel(), [
                            [
                              clickoutside,
                              this.handleClickOutside,
                              undefined,
                              { capture: true }
                            ]
                          ])
                        }
                      }}
                    </Transition>
                  )
                }}
              </VFollower>
            ]
          }}
        </VBinder>
      </div>
    )
    return renderInputAddons(control, this.$slots, this.mergedSize)
  }
})
