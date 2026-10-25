import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { NText } from '..'
import { NConfigProvider } from '../../config-provider'

enableAutoUnmount(afterEach)

describe('text extensions', () => {
  afterEach(() => vi.unstubAllGlobals())
  it('supports semantic types, inherited and explicit sizes, tags and native events', async () => {
    const onClick = vi.fn()
    const wrapper = mount(NText, {
      props: { type: 'primary', tag: 'b' },
      slots: { default: () => 'Primary' },
      attrs: { onClick }
    })
    expect(wrapper.element.tagName).toBe('B')
    expect(wrapper.classes()).not.toContain('n-text--sized')
    expect(wrapper.element.style.getPropertyValue('--n-text-font-size')).toBe(
      ''
    )
    expect(wrapper.element.style.getPropertyValue('--n-text-color')).not.toBe(
      ''
    )
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ size: 'large' })
    expect(wrapper.element.style.getPropertyValue('--n-text-font-size')).toBe(
      '16px'
    )
    await wrapper.setProps({ size: undefined })
    expect(wrapper.classes()).not.toContain('n-text--sized')
  })
  it('updates truncation on resize and text mutation, and releases observers', async () => {
    let resize!: ResizeObserverCallback
    const disconnect = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          resize = callback
        }

        observe() {}
        disconnect = disconnect
      }
    )
    const wrapper = mount(NText, {
      props: { truncated: true },
      slots: { default: () => 'Short' }
    })
    await nextTick()
    Object.defineProperties(wrapper.element, {
      clientWidth: { get: () => 60 },
      scrollWidth: { get: () => (wrapper.element.textContent?.length ?? 0) * 8 }
    })
    resize([], {} as ResizeObserver)
    expect(wrapper.vm.isTruncated).toBe(false)
    wrapper.element.textContent = 'A much longer piece of text'
    await flushPromises()
    expect(wrapper.vm.isTruncated).toBe(true)
    wrapper.element.textContent = 'Short'
    await flushPromises()
    expect(wrapper.vm.isTruncated).toBe(false)
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalled()
  })
  it('prioritizes valid line clamping and resets status when truncation is disabled', async () => {
    const wrapper = mount(NText, {
      props: { truncated: true, lineClamp: '2' },
      slots: { default: () => 'Long content' }
    })
    await nextTick()
    expect(wrapper.classes()).toContain('n-text--clamped')
    expect(wrapper.classes()).not.toContain('n-text--truncated')
    expect(wrapper.element.style.getPropertyValue('-webkit-line-clamp')).toBe(
      '2'
    )
    Object.defineProperties(wrapper.element, {
      clientHeight: { value: 40 },
      scrollHeight: { value: 80 }
    })
    window.dispatchEvent(new Event('resize'))
    expect(wrapper.vm.isTruncated).toBe(true)
    await wrapper.setProps({ truncated: false, lineClamp: 0 })
    expect(wrapper.classes()).not.toContain('n-text--clamped')
    expect(wrapper.vm.isTruncated).toBe(false)
  })
  it('retains code/delete semantics with clamping and inline-theme-disabled mode', async () => {
    const wrapper = mount(() => (
      <NConfigProvider inlineThemeDisabled>
        <NText size="small" code delete lineClamp={2}>
          Code sample
        </NText>
      </NConfigProvider>
    ))
    const code = wrapper.find('code')
    expect(code.classes()).toContain('n-text--clamped')
    expect(code.find('del').text()).toBe('Code sample')
    await nextTick()
  })
  it('reconnects measurement when the root tag changes', async () => {
    const wrapper = mount(NText, { props: { truncated: true } })
    await wrapper.setProps({ tag: 'p' })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.vm.isTruncated).toBe(false)
  })
})
