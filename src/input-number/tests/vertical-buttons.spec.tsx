import { enableAutoUnmount, mount } from '@vue/test-utils'
import { h } from 'vue'
import { NInputNumber } from '..'
import { NForm } from '../../form'

enableAutoUnmount(afterEach)

describe('vertical step buttons', () => {
  it.each(['tiny', 'small', 'medium', 'large'] as const)(
    'keeps the internal icon slots compact for %s inputs',
    async (size) => {
      const wrapper = mount(NInputNumber, {
        props: { buttonPlacement: 'right-vertical', size }
      })
      for (const button of wrapper.findAll('button')) {
        expect(button.attributes('style')).toContain('--n-icon-size: 12px')
      }
      await wrapper.setProps({ buttonPlacement: 'right' })
      for (const button of wrapper.findAll('button')) {
        expect(button.attributes('style')).not.toContain('--n-icon-size: 12px')
      }
    }
  )
  it('reuses keyboard and hold stepping without exceeding the maximum', async () => {
    vi.useFakeTimers()
    const onUpdateValue = vi.fn()
    const wrapper = mount(NInputNumber, {
      props: {
        buttonPlacement: 'right-vertical',
        defaultValue: 0,
        max: 2,
        onUpdateValue
      }
    })
    try {
      await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
      expect(onUpdateValue).toHaveBeenLastCalledWith(1)
      await wrapper.find('.n-input-number-stepper button').trigger('mousedown')
      await vi.advanceTimersByTimeAsync(1200)
      expect(onUpdateValue).toHaveBeenLastCalledWith(2)
      document.dispatchEvent(new MouseEvent('mouseup'))
      const count = onUpdateValue.mock.calls.length
      await vi.advanceTimersByTimeAsync(500)
      expect(onUpdateValue).toHaveBeenCalledTimes(count)
    }
    finally {
      wrapper.unmount()
      vi.useRealTimers()
    }
  })
  it('increments above and decrements below while honoring limits', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(NInputNumber, {
      props: {
        buttonPlacement: 'right-vertical',
        defaultValue: 1,
        min: 0,
        max: 2,
        onUpdateValue
      }
    })
    const [up, down] = wrapper.findAll('.n-input-number-stepper button')
    expect(up.attributes('aria-label')).toBe('+')
    expect(down.attributes('aria-label')).toBe('-')
    await up.trigger('click')
    expect(onUpdateValue).toHaveBeenLastCalledWith(2)
    expect(up.attributes('disabled')).toBeDefined()
    await down.trigger('click')
    await down.trigger('click')
    expect(onUpdateValue).toHaveBeenLastCalledWith(0)
    expect(down.attributes('disabled')).toBeDefined()
  })
  it('respects disabled and inherited readonly states', () => {
    const wrapper = mount(() => (
      <NForm readonly>
        <NInputNumber buttonPlacement="right-vertical" />
      </NForm>
    ))
    expect(
      wrapper
        .findAll('button')
        .every(button => button.attributes('disabled') !== undefined)
    ).toBe(true)
    const disabled = mount(NInputNumber, {
      props: { buttonPlacement: 'right-vertical', disabled: true }
    })
    expect(
      disabled
        .findAll('button')
        .every(button => button.attributes('disabled') !== undefined)
    ).toBe(true)
  })
  it('preserves custom icons, suffix content and input addons', async () => {
    const wrapper = mount(NInputNumber, {
      props: { buttonPlacement: 'right-vertical', clearable: true },
      slots: {
        'add-icon': () => <span>Up</span>,
        'minus-icon': () => <span>Down</span>,
        suffix: () => <span>kg</span>,
        append: () => <span>Unit</span>
      }
    })
    expect(wrapper.find('.n-input-number-stepper').text()).toBe('UpDown')
    expect(wrapper.text()).toContain('kg')
    expect(wrapper.text()).toContain('Unit')
    await wrapper.setProps({ showButton: false })
    expect(wrapper.find('.n-input-number-stepper').exists()).toBe(false)
    expect(wrapper.text()).toContain('kg')
    await wrapper.setProps({ showButton: true, buttonPlacement: 'right' })
    expect(wrapper.find('.n-input-number-stepper').exists()).toBe(false)
    expect(wrapper.findAll('button')).toHaveLength(2)
  })
})
