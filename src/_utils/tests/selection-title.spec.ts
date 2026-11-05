import { createCommentVNode, h } from 'vue'
import { getSelectionTitle, getTitleText } from '../naive/selection-title'

describe('原生标题文本', () => {
  it('提取嵌套文字和数字，忽略注释与空值', () => {
    expect(
      getTitleText(
        h('span', ['标签', h('b', '全文'), 0, createCommentVNode('注释')])
      )
    ).toBe('标签全文0')
    expect(getTitleText(null)).toBe('')
  })

  it('支持自定义字段和函数标签，按属性组合原始值和完整标签', () => {
    const option = { id: 0, name: () => h('span', '完整标签') }
    expect(getSelectionTitle(option, 'name', 'id', false)).toBe('完整标签')
    expect(getSelectionTitle(option, 'name', 'id', true)).toBe('0「完整标签」')
    expect(getSelectionTitle({}, 'label', 'value', false)).toBeUndefined()
  })
})
