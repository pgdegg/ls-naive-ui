import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { NAutoComplete } from '../../../auto-complete'
import { NCascader } from '../../../cascader'
import { NColorPicker } from '../../../color-picker'
import { NDatePicker } from '../../../date-picker'
import { NInput } from '../../../input'
import { NInputNumber } from '../../../input-number'
import { NPopselect } from '../../../popselect'
import { NSelect } from '../../../select'
import { NTimePicker } from '../../../time-picker'
import { NTreeSelect } from '../../../tree-select'

describe('控件原生 title 提示', () => {
  it('选择器展示完整标签，切换属性后同时展示值，清空后移除提示', async () => {
    const wrapper = mount(NSelect, {
      props: {
        value: 0,
        labelField: 'name',
        valueField: 'id',
        options: [{ id: 0, name: '完整标签内容' }]
      }
    })
    const selection = () => wrapper.get('.n-base-selection')
    expect(selection().attributes('title')).toBe('完整标签内容')
    await wrapper.setProps({ showValueInTitle: true })
    expect(selection().attributes('title')).toBe('0「完整标签内容」')
    expect(wrapper.get('.n-base-selection-input__content').text()).toBe(
      '完整标签内容'
    )
    await wrapper.setProps({ value: null })
    expect(selection().attributes('title')).toBeUndefined()
    wrapper.unmount()
  })

  it('可搜索的禁用选择器和多选折叠项均保留完整提示', async () => {
    const wrapper = mount(NSelect, {
      props: {
        defaultValue: ['a', 'b'],
        multiple: true,
        filterable: true,
        maxTagCount: 1,
        disabled: true,
        options: [
          { value: 'a', label: '第一项' },
          { value: 'b', label: '第二项' }
        ]
      }
    })
    expect(wrapper.get('.n-base-selection').attributes('title')).toBe(
      '第一项\n第二项'
    )
    await wrapper.setProps({ showValueInTitle: true })
    expect(wrapper.get('.n-base-selection').attributes('title')).toBe(
      'a「第一项」\nb「第二项」'
    )
    expect(
      wrapper.get('.n-base-selection-tag-wrapper').attributes('title')
    ).toBe('a「第一项」')
    wrapper.unmount()
  })

  it('单选搜索输入聚焦后仍可查看完整已选标签', async () => {
    const wrapper = mount(NSelect, {
      props: {
        value: 'a',
        filterable: true,
        options: [{ value: 'a', label: '完整标签' }]
      }
    })
    await wrapper.get('input').trigger('focus')
    expect(wrapper.get('.n-base-selection').attributes('title')).toBe(
      '完整标签'
    )
    wrapper.unmount()
  })

  it('函数标签提取文字，保留数字零和缺失选项的回退值', () => {
    const wrapper = mount(NSelect, {
      props: {
        value: 'a',
        showValueInTitle: true,
        options: [
          { value: 'a', label: () => h('span', ['标签', h('b', '全文')]) }
        ]
      }
    })
    expect(wrapper.get('.n-base-selection').attributes('title')).toBe(
      'a「标签全文」'
    )
    wrapper.unmount()
    const fallback = mount(NSelect, {
      props: { value: 0, showValueInTitle: true }
    })
    expect(fallback.get('.n-base-selection').attributes('title')).toBe('0「0」')
    fallback.unmount()
  })

  for (const multiple of [false, true]) {
    it(`级联${multiple ? '多选' : '单选'}提示包含完整路径和自定义字段`, async () => {
      const wrapper = mount(NCascader, {
        props: {
          multiple,
          checkStrategy: 'child',
          value: multiple ? ['child'] : 'child',
          labelField: 'name',
          valueField: 'id',
          options: [
            {
              id: 'parent',
              name: '父级',
              children: [{ id: 'child', name: '子级' }]
            }
          ],
          separator: ' / '
        }
      })
      expect(wrapper.get('.n-base-selection').attributes('title')).toBe(
        '父级 / 子级'
      )
      await wrapper.setProps({ showValueInTitle: true })
      expect(wrapper.get('.n-base-selection').attributes('title')).toBe(
        'child「父级 / 子级」'
      )
      await wrapper.setProps({ showPath: false })
      expect(wrapper.get('.n-base-selection').attributes('title')).toBe(
        'child「子级」'
      )
      wrapper.unmount()
    })

    it(`树选择${multiple ? '多选' : '单选'}提示使用节点键和完整路径`, async () => {
      const wrapper = mount(NTreeSelect, {
        props: {
          multiple,
          showPath: true,
          showValueInTitle: true,
          value: multiple ? ['child'] : 'child',
          options: [
            {
              key: 'parent',
              label: '父级',
              children: [{ key: 'child', label: '子级' }]
            }
          ]
        }
      })
      expect(wrapper.get('.n-base-selection').attributes('title')).toBe(
        'child「父级 / 子级」'
      )
      await wrapper.setProps({ value: multiple ? [] : null })
      expect(
        wrapper.get('.n-base-selection').attributes('title')
      ).toBeUndefined()
      wrapper.unmount()
    })
  }

  it('自动完成提示已选标签、输入回退值并尊重显式 title', async () => {
    const wrapper = mount(NAutoComplete, {
      props: { value: 'a', options: [{ value: 'a', label: '完整标签' }] }
    })
    expect(wrapper.get('.n-input').attributes('title')).toBe('完整标签')
    await wrapper.setProps({ showValueInTitle: true })
    expect(wrapper.get('.n-input').attributes('title')).toBe('a「完整标签」')
    await wrapper.setProps({ value: '自由输入' })
    expect(wrapper.get('.n-input').attributes('title')).toBe(
      '自由输入「自由输入」'
    )
    await wrapper.setProps({ inputProps: { title: '自定义提示' } })
    expect(wrapper.get('.n-input').attributes('title')).toBe('自定义提示')
    wrapper.unmount()
  })

  it('弹出选择器在触发器展示所有已选项并保留自定义提示', async () => {
    const wrapper = mount(NPopselect, {
      props: {
        value: ['a', 'b'],
        multiple: true,
        showValueInTitle: true,
        options: [
          { value: 'a', label: '第一项' },
          { value: 'b', label: '第二项' }
        ]
      },
      slots: { default: () => h('button', '选择') }
    })
    expect(wrapper.get('button').attributes('title')).toBe(
      'a「第一项」\nb「第二项」'
    )
    await wrapper.setProps({ value: [] })
    expect(wrapper.get('button').attributes('title')).toBeUndefined()
    wrapper.unmount()
    const custom = mount(NPopselect, {
      props: { value: 'a', options: [{ value: 'a', label: '标签' }] },
      slots: { default: () => h('button', { title: '自定义提示' }, '选择') }
    })
    expect(custom.get('button').attributes('title')).toBe('自定义提示')
    custom.unmount()
  })

  for (const type of ['text', 'textarea'] as const) {
    it(`${type}输入框提示随输入更新，清空后移除`, async () => {
      const wrapper = mount(NInput, {
        props: { type, defaultValue: '完整内容' }
      })
      expect(wrapper.get('.n-input').attributes('title')).toBe('完整内容')
      await wrapper
        .get(type === 'textarea' ? 'textarea' : 'input')
        .setValue('更新内容')
      expect(wrapper.get('.n-input').attributes('title')).toBe('更新内容')
      await wrapper.get(type === 'textarea' ? 'textarea' : 'input').setValue('')
      expect(wrapper.get('.n-input').attributes('title')).toBeUndefined()
      wrapper.unmount()
    })
  }

  it('成对、只读和禁用输入框展示全文，密码输入框不生成明文提示', async () => {
    const wrapper = mount(NInput, {
      props: { pair: true, value: ['开始', '结束'], readonly: true }
    })
    expect(wrapper.get('.n-input').attributes('title')).toBe('开始 ～ 结束')
    await wrapper.setProps({ disabled: true })
    expect(wrapper.get('.n-input').attributes('title')).toBe('开始 ～ 结束')
    wrapper.unmount()
    const password = mount(NInput, {
      props: { type: 'password', value: '秘密' }
    })
    expect(password.find('[title]').exists()).toBe(false)
    password.unmount()
  })

  it('数字、日期、时间和颜色选择器继承完整值提示', () => {
    const number = mount(NInputNumber, {
      props: { value: 123456.78, format: value => `${value} 元` }
    })
    expect(number.get('.n-input').attributes('title')).toBe('123456.78 元')
    number.unmount()
    const date = mount(NDatePicker, {
      props: { value: [0, 86400000], type: 'daterange' }
    })
    const dateValues = date.findAll('input').map(input => input.element.value)
    expect(date.get('.n-input').attributes('title')).toBe(
      dateValues.join(' ～ ')
    )
    date.unmount()
    const time = mount(NTimePicker, { props: { value: 0 } })
    expect(time.get('.n-input').attributes('title')).toBe(
      time.get('input').element.value
    )
    time.unmount()
    const color = mount(NColorPicker, { props: { value: '#123456' } })
    expect(color.get('.n-color-picker').attributes('title')).toBe('#123456')
    color.unmount()
  })

  it('选择菜单和级联菜单提示完整选项标签', () => {
    const select = mount(NSelect, {
      props: {
        show: true,
        virtualScroll: false,
        to: false,
        options: [{ value: 'a', label: '选项全文' }]
      }
    })
    expect(select.get('.n-base-select-option').attributes('title')).toBe(
      '选项全文'
    )
    select.unmount()
    const cascader = mount(NCascader, {
      props: {
        show: true,
        virtualScroll: false,
        to: false,
        options: [{ value: 'a', label: '级联选项全文' }]
      }
    })
    expect(cascader.get('.n-cascader-option').attributes('title')).toBe(
      '级联选项全文'
    )
    cascader.unmount()
    const tree = mount(NTreeSelect, {
      props: {
        show: true,
        virtualScroll: false,
        to: false,
        options: [{ key: 'a', label: '树选项全文' }]
      }
    })
    expect(tree.get('.n-tree-node-content').attributes('title')).toBe(
      '树选项全文'
    )
    tree.unmount()
  })
})
