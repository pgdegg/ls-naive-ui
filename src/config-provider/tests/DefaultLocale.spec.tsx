import { enableAutoUnmount, mount } from '@vue/test-utils'
import { format } from 'date-fns'
import { defineComponent, h, ref } from 'vue'
import { NConfigProvider } from '..'
import { useLocale } from '../../_mixins'
import { NCascader } from '../../cascader'
import { NDatePicker } from '../../date-picker'
import { NInput } from '../../input'
import { dateEnUS, enUS } from '../../locales'
import { NSelect } from '../../select'

enableAutoUnmount(afterEach)

const LocaleProbe = defineComponent({
  setup() {
    const { localeRef, dateLocaleRef } = useLocale('Select')
    return () =>
      h(
        'output',
        `${localeRef.value.placeholder}|${format(
          new Date(2026, 0, 15),
          'MMMM',
          { locale: dateLocaleRef.value.locale }
        )}`
      )
  }
})

describe('simplified Chinese defaults', () => {
  it('localizes standalone components and date formatting without a provider', () => {
    const wrapper = mount(() => (
      <div>
        <NInput />
        <NSelect />
        <NCascader />
        <NDatePicker />
        <LocaleProbe />
      </div>
    ))
    expect(
      wrapper.findAll('input').map(input => input.attributes('placeholder'))
    ).toContain('请输入')
    expect(
      wrapper.findAll('input').map(input => input.attributes('placeholder'))
    ).toContain('选择日期')
    expect(
      wrapper
        .findAll('.n-base-selection-placeholder')
        .map(node => node.text())
    ).toEqual(['请选择', '请选择'])
    expect(wrapper.find('output').text()).toBe('请选择|一月')
  })

  it('inherits explicit English and resets nested null locales to Chinese', async () => {
    const english = ref(true)
    const wrapper = mount(() => (
      <NConfigProvider
        locale={english.value ? enUS : undefined}
        dateLocale={english.value ? dateEnUS : undefined}
      >
        <NConfigProvider>
          <LocaleProbe />
        </NConfigProvider>
        <NConfigProvider locale={null} dateLocale={null}>
          <LocaleProbe />
        </NConfigProvider>
      </NConfigProvider>
    ))
    expect(wrapper.findAll('output').map(node => node.text())).toEqual([
      'Please Select|January',
      '请选择|一月'
    ])
    english.value = false
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('output').map(node => node.text())).toEqual([
      '请选择|一月',
      '请选择|一月'
    ])
  })
})
