import { enableAutoUnmount, mount } from '@vue/test-utils'
import { defineComponent, h, KeepAlive, nextTick, provide, ref } from 'vue'
import { NInput } from '../../input'
import { NInputNumber } from '../../input-number'
import { NSelect } from '../../select'
import { inputElementRegistrationKey } from '../use-input-element'

enableAutoUnmount(afterEach)

describe('native input registration', () => {
  it('exposes a focus target rather than the hidden form input for selectors', async () => {
    const wrapper = mount(NSelect, {
      props: { options: [{ value: 'a', label: 'Alpha' }] }
    })
    await nextTick()
    expect(wrapper.vm.inputElement).toBeInstanceOf(HTMLElement)
    expect(wrapper.vm.inputElement?.getAttribute('type')).not.toBe('hidden')
  })
  it('registers a composite control once, ignores addon controls and cleans up on unmount', async () => {
    const cleanup = vi.fn()
    const register = vi.fn((_element: HTMLElement) => cleanup)
    const wrapper = mount(
      defineComponent({
        setup() {
          provide(inputElementRegistrationKey, register)
          return () => (
            <NInputNumber>
              {{ prepend: () => <NInput placeholder="addon" /> }}
            </NInputNumber>
          )
        }
      })
    )
    await nextTick()
    expect(register).toHaveBeenCalledTimes(1)
    expect(register.mock.calls[0][0]).toBe(wrapper.findAll('input')[1].element)
    wrapper.unmount()
    expect(cleanup).toHaveBeenCalledTimes(1)
  })
  it('cleans up on KeepAlive deactivation and registers again on activation', async () => {
    const active = ref(true)
    const cleanup = vi.fn()
    const register = vi.fn((_element: HTMLElement) => cleanup)
    const wrapper = mount(
      defineComponent({
        setup() {
          provide(inputElementRegistrationKey, register)
          return () => <KeepAlive>{active.value ? <NInput /> : null}</KeepAlive>
        }
      })
    )
    await nextTick()
    expect(register).toHaveBeenCalledTimes(1)
    active.value = false
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)
    active.value = true
    await nextTick()
    expect(register).toHaveBeenCalledTimes(2)
    wrapper.unmount()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })
})
