import type { Locale } from 'date-fns'
import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'
import { format, formatDistanceStrict, fromUnixTime } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { computed, createTextVNode, defineComponent, h } from 'vue'
import { useLocale } from '../../_mixins'

export const timeProps = {
  time: {
    type: [Number, Date] as PropType<number | Date>,
    default: undefined // 在 unix 或非 unix 模式下，它应有不同的默认值
  },
  type: {
    type: String as PropType<'relative' | 'date' | 'datetime'>,
    default: 'datetime'
  },
  to: {
    type: [Number, Date] as PropType<number | Date>,
    default: undefined // 与 `time` prop 相同
  },
  unix: Boolean,
  format: String,
  text: Boolean,
  timeZone: String
} as const

export type TimeProps = ExtractPublicPropTypes<typeof timeProps>

export default defineComponent({
  name: 'Time',
  props: timeProps,
  setup(props) {
    const now = Date.now()
    const { localeRef, dateLocaleRef } = useLocale('Time')
    const mergedFormatRef = computed(() => {
      const { timeZone } = props
      if (timeZone) {
        return (
          time: number | Date,
          _format: string,
          options: { locale: Locale }
        ) => {
          return formatInTimeZone(time, timeZone, _format, options)
        }
      }
      return format
    })
    const dateFnsOptionsRef = computed(() => {
      return {
        locale: dateLocaleRef.value.locale
      }
    })
    const mergedTimeRef = computed(() => {
      const { time } = props
      if (props.unix) {
        if (time === undefined)
          return now
        return fromUnixTime(typeof time === 'number' ? time : time.valueOf())
      }
      return time ?? now
    })
    const mergedToRef = computed(() => {
      const { to } = props
      if (props.unix) {
        if (to === undefined)
          return now
        return fromUnixTime(typeof to === 'number' ? to : to.valueOf())
      }
      return to ?? now
    })
    const renderedTimeRef = computed(() => {
      if (props.format) {
        return mergedFormatRef.value(
          mergedTimeRef.value,
          props.format,
          dateFnsOptionsRef.value
        )
      }
      else if (props.type === 'date') {
        return mergedFormatRef.value(
          mergedTimeRef.value,
          localeRef.value.dateFormat,
          dateFnsOptionsRef.value
        )
      }
      else if (props.type === 'datetime') {
        return mergedFormatRef.value(
          mergedTimeRef.value,
          localeRef.value.dateTimeFormat,
          dateFnsOptionsRef.value
        )
      }
      else {
        return formatDistanceStrict(mergedTimeRef.value, mergedToRef.value, {
          addSuffix: true,
          locale: dateLocaleRef.value.locale
        })
      }
    })
    return {
      renderedTime: renderedTimeRef
    }
  },
  render() {
    return this.text
      ? createTextVNode(this.renderedTime)
      : h('time', [this.renderedTime])
  }
})
