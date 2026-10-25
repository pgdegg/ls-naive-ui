import { enableAutoUnmount, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, provide } from 'vue'
import { NColorPickerPanel } from '..'
import { NCard } from '../../card'
import { inputElementRegistrationKey } from '../../composables'
import { NConfigProvider } from '../../config-provider'
import { NForm } from '../../form'

enableAutoUnmount(afterEach)

describe('n-color-picker-panel', () => {
  it('renders directly with forwarded attributes and no popup or trigger', () => {
    const wrapper = mount(NColorPickerPanel, {
      attrs: {
        class: 'custom-panel',
        style: 'width: 300px',
        'aria-label': 'Color editor'
      }
    })
    expect(wrapper.classes()).toContain('n-color-picker-panel')
    expect(wrapper.classes()).toContain('custom-panel')
    expect(wrapper.attributes('aria-label')).toBe('Color editor')
    expect(wrapper.element.style.width).toBe('300px')
    expect(wrapper.find('.n-color-picker').exists()).toBe(false)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(
      document.body.querySelector('.v-binder-follower-container')
    ).toBeNull()
  })
  it('updates an uncontrolled color using swatches and keyboard selection', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(NColorPickerPanel, {
      props: {
        defaultValue: '#000000',
        modes: ['hex'],
        showAlpha: false,
        swatches: ['#FF0000', '#00FF00'],
        onUpdateValue
      }
    })
    await wrapper.findAll('.n-color-picker-swatch')[0].trigger('click')
    expect(onUpdateValue).toHaveBeenLastCalledWith('#FF0000')
    await wrapper
      .findAll('.n-color-picker-swatch')[1]
      .trigger('keydown', { key: 'Enter' })
    expect(onUpdateValue).toHaveBeenLastCalledWith('#00FF00')
    expect(wrapper.vm.mergedValue).toBe('#00FF00')
  })
  it('keeps controlled values until the parent updates them', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(NColorPickerPanel, {
      props: {
        value: '#000000',
        modes: ['hex'],
        swatches: ['#FF0000'],
        onUpdateValue
      }
    })
    await wrapper.find('.n-color-picker-swatch').trigger('click')
    expect(onUpdateValue).toHaveBeenCalledWith('#FF0000')
    expect(wrapper.vm.mergedValue).toBe('#000000')
    await wrapper.setProps({ value: '#FF0000' })
    expect(wrapper.vm.mergedValue).toBe('#FF0000')
  })
  it('keeps the panel mounted after confirming or clearing', async () => {
    const onConfirm = vi.fn()
    const onClear = vi.fn()
    const onUpdateValue = vi.fn()
    const wrapper = mount(NColorPickerPanel, {
      props: {
        defaultValue: '#FF0000',
        actions: ['confirm', 'clear'],
        onConfirm,
        onClear,
        onUpdateValue
      }
    })
    await wrapper.findAll('button')[0].trigger('click')
    expect(onConfirm).toHaveBeenCalledWith('#FF0000')
    expect(wrapper.find('input').exists()).toBe(true)
    await wrapper.findAll('button')[1].trigger('click')
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(onUpdateValue).toHaveBeenLastCalledWith(null)
    expect(wrapper.classes()).toContain('n-color-picker-panel')
  })
  it('supports modes, alpha toggling and custom actions', async () => {
    const wrapper = mount(NColorPickerPanel, {
      props: {
        defaultValue: '#123456',
        modes: ['hex', 'rgb'],
        showAlpha: false
      },
      slots: { action: () => <button>Apply locally</button> }
    })
    expect(wrapper.find('.n-color-picker-input__mode').text()).toBe('HEX')
    await wrapper.find('.n-color-picker-input__mode').trigger('click')
    expect(wrapper.find('.n-color-picker-input__mode').text()).toBe('RGB')
    const sliders = wrapper.findAll('.n-color-picker-slider').length
    await wrapper.setProps({ showAlpha: true })
    expect(wrapper.findAll('.n-color-picker-slider').length).toBe(sliders + 1)
    expect(wrapper.find('button').text()).toBe('Apply locally')
  })
  it('blocks disabled and readonly changes including inherited container state', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(NColorPickerPanel, {
      props: { readonly: true, swatches: ['#FF0000'], onUpdateValue }
    })
    expect(wrapper.attributes('inert')).toBeDefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    await wrapper.find('.n-color-picker-swatch').trigger('click')
    expect(onUpdateValue).not.toHaveBeenCalled()
    await wrapper.setProps({ readonly: false, disabled: true })
    await wrapper.find('.n-color-picker-swatch').trigger('click')
    expect(onUpdateValue).not.toHaveBeenCalled()
    const inherited = mount(() => (
      <NForm readonly>
        <NColorPickerPanel />
      </NForm>
    ))
    expect(
      inherited.find('.n-color-picker-panel').attributes('inert')
    ).toBeDefined()
    const container = mount(() => (
      <NCard disabled>
        <NColorPickerPanel disabled={false} />
      </NCard>
    ))
    expect(
      container.find('.n-color-picker-panel').attributes('inert')
    ).toBeDefined()
  })
  it('shares ColorPicker theme overrides and registers a native input once', async () => {
    const cleanup = vi.fn()
    const register = vi.fn((_element: HTMLElement) => cleanup)
    const wrapper = mount(
      defineComponent({
        setup() {
          provide(inputElementRegistrationKey, register)
          return () => (
            <NConfigProvider
              clsPrefix="custom"
              themeOverrides={{ ColorPicker: { color: '#123456' } }}
            >
              <NColorPickerPanel showPreview />
            </NConfigProvider>
          )
        }
      })
    )
    await nextTick()
    expect(
      wrapper.find('.custom-color-picker-panel').attributes('style')
    ).toContain('--n-color: #123456')
    expect(register).toHaveBeenCalledTimes(1)
    expect(register.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement)
    expect(register.mock.calls[0][0].getAttribute('type')).not.toBe('color')
    wrapper.unmount()
    expect(cleanup).toHaveBeenCalledTimes(1)
  })
})
