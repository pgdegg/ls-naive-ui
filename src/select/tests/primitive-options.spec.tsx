import type { Component } from 'vue'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { NSelect } from '..'
import { NInternalSelectMenu } from '../../_internal'
import { NCascader } from '../../cascader'

enableAutoUnmount(afterEach)

describe.each([
  ['select', NSelect, '.n-base-select-option'],
  ['cascader', NCascader, '.n-cascader-option']
] as const)('%s primitive options', (_, component, selector) => {
  it('filters numeric labels and emits numeric values in multiple mode', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(() =>
      h(component as Component, {
        options: [0, 2, 2, 3],
        multiple: true,
        filterable: true,
        show: true,
        to: false,
        virtualScroll: false,
        onUpdateValue
      })
    )
    await wrapper.find('input').setValue('2')
    await flushPromises()
    const menu = wrapper.findComponent(NInternalSelectMenu)
    expect(
      menu.props('treeMate').treeNodes.map(node => node.rawNode)
    ).toEqual([{ label: '2', value: 2 }])
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(onUpdateValue.mock.calls.at(-1)?.[0]).toEqual([2])
    expect(onUpdateValue.mock.calls.at(-1)?.[1]).toEqual([
      { label: '2', value: 2 }
    ])
  })
  it('deduplicates numbers, honors field names and reacts to array mutations', async () => {
    const options = ref([0, 2, 2, 0])
    const onUpdateValue = vi.fn()
    const wrapper = mount(() =>
      h(component as Component, {
        options: options.value,
        labelField: 'name',
        valueField: 'id',
        defaultValue: 0,
        show: true,
        to: false,
        virtualScroll: false,
        onUpdateValue
      })
    )
    expect(wrapper.find('.n-base-selection').text()).toContain('0')
    expect(wrapper.findAll(selector).map(option => option.text())).toEqual([
      '0',
      '2'
    ])
    await wrapper.findAll(selector)[1].trigger('click')
    expect(onUpdateValue.mock.calls.at(-1)?.[0]).toBe(2)
    expect(onUpdateValue.mock.calls.at(-1)?.[1]).toEqual({ name: '2', id: 2 })
    expect(options.value).toEqual([0, 2, 2, 0])
    options.value.push(3, 3)
    await nextTick()
    expect(wrapper.findAll(selector).map(option => option.text())).toEqual([
      '0',
      '2',
      '3'
    ])
    options.value = [4, 4]
    await nextTick()
    expect(wrapper.findAll(selector).map(option => option.text())).toEqual([
      '4'
    ])
  })

  it('keeps first occurrence order and supports empty string values', async () => {
    const onUpdateValue = vi.fn()
    const options = ['Beta', '', 'Alpha', 'Beta', '']
    const wrapper = mount(() =>
      h(component as Component, {
        options,
        defaultValue: 'Alpha',
        show: true,
        to: false,
        virtualScroll: false,
        onUpdateValue
      })
    )
    expect(wrapper.find('.n-base-selection').text()).toContain('Alpha')
    expect(wrapper.findAll(selector).map(option => option.text())).toEqual([
      'Beta',
      '',
      'Alpha'
    ])
    await wrapper.findAll(selector)[1].trigger('click')
    expect(onUpdateValue.mock.calls.at(-1)?.[0]).toBe('')
    expect(onUpdateValue.mock.calls.at(-1)?.[1]).toEqual({
      label: '',
      value: ''
    })
    expect(options).toEqual(['Beta', '', 'Alpha', 'Beta', ''])
  })
})
