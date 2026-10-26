import { enableAutoUnmount, mount } from '@vue/test-utils'
import { h } from 'vue'
import { NTab, NTabPane, NTabs } from '..'

enableAutoUnmount(afterEach)

describe('border-card tabs', () => {
  it('switches, closes and adds tabs without a line indicator', async () => {
    const onUpdateValue = vi.fn()
    const onClose = vi.fn()
    const onAdd = vi.fn()
    const wrapper = mount(NTabs, {
      props: {
        type: 'border-card',
        defaultValue: 'a',
        closable: true,
        addable: true,
        onUpdateValue,
        onClose,
        onAdd
      },
      slots: {
        default: () => [
          <NTabPane name="a" tab="Alpha">
            Alpha content
          </NTabPane>,
          <NTabPane name="b" tab="Beta">
            Beta content
          </NTabPane>,
          <NTabPane name="disabled" tab="Disabled" disabled />
        ]
      }
    })
    expect(wrapper.classes()).toContain('n-tabs--border-card-type')
    expect(wrapper.find('.n-tabs-bar').exists()).toBe(false)
    expect(wrapper.attributes('style')).toContain('--n-pane-padding-top: 15px')
    expect(wrapper.attributes('style')).not.toContain('undefined')
    await wrapper.find('[data-name="b"]').trigger('click')
    expect(onUpdateValue).toHaveBeenLastCalledWith('b')
    await wrapper.find('[data-name="disabled"]').trigger('click')
    expect(onUpdateValue).toHaveBeenCalledTimes(1)
    await wrapper.find('[data-name="b"] .n-tabs-tab__close').trigger('click')
    expect(onClose).toHaveBeenLastCalledWith('b')
    await wrapper.find('.n-tabs-tab--addable').trigger('click')
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it.each(['top', 'bottom', 'left', 'right'] as const)(
    'supports %s placement and standalone fixed tabs',
    (placement) => {
      const wrapper = mount(() => (
        <NTabs
          type="border-card"
          placement={placement}
          defaultValue="fixed"
          leftType="border-card"
          rightType="card"
          closable
        >
          <NTab name="fixed" fixed="left" icon="missing">
            Fixed
          </NTab>
          <NTab name="middle">Middle</NTab>
          <NTab name="right" fixed="right">
            Right
          </NTab>
        </NTabs>
      ))
      expect(wrapper.find('.n-tabs').classes()).toContain(
        `n-tabs--${placement}`
      )
      expect(wrapper.findAll('.n-tabs-tab__close')).toHaveLength(3)
      expect(
        wrapper.find('.n-tabs-fixed--left [data-name="fixed"]').exists()
      ).toBe(true)
      expect(
        wrapper.find('.n-tabs-fixed--right [data-name="right"]').exists()
      ).toBe(true)
      expect(wrapper.find('.n-tabs-tab__icon').exists()).toBe(true)
    }
  )
})
