import type { KeyboardInteractiveInst } from '../index'
import { flushPromises, mount } from '@vue/test-utils'
import { Fragment, h, nextTick } from 'vue'
import { NForm, NFormItem } from '../../form'
import { NInput } from '../../input'
import { NKeyboardInteractive, NKeyboardInteractiveItem } from '../index'

describe('n-keyboard-interactive', () => {
  it('preserves handled Enter and IME confirmation while preventing native form submission', async () => {
    const onEnter = vi.fn()
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      props: { onEnter },
      slots: {
        default: () => (
          <form>
            <input />
            <input onKeydown={event => event.preventDefault()} />
            <input />
          </form>
        )
      }
    })
    await nextTick()
    const inputs = wrapper.findAll('input')
    expect(
      inputs[0].element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true
        })
      )
    ).toBe(false)
    await inputs[0].trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement).toBe(inputs[1].element)
    await inputs[1].trigger('keydown', { key: 'Enter' })
    await inputs[1].trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement).toBe(inputs[1].element)
    inputs[0].element.focus()
    await inputs[0].trigger('keydown', { key: 'Enter', isComposing: true })
    await inputs[0].trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement).toBe(inputs[0].element)
    expect(onEnter).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('excludes disabled nested containers and all descendants of ignored items', async () => {
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      slots: {
        default: () => (
          <>
            <input />
            <NKeyboardInteractive disabled>
              <input />
            </NKeyboardInteractive>
            <NKeyboardInteractiveItem ignore>
              <NKeyboardInteractiveItem>
                <input />
              </NKeyboardInteractiveItem>
            </NKeyboardInteractiveItem>
            <input />
          </>
        )
      }
    })
    await nextTick()
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.findAll('input')[3].element)
    wrapper.unmount()
  })

  it('does not focus a target removed while the provider is pending', async () => {
    let resolve!: (value: boolean) => void
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      props: {
        enterProvider: () =>
          new Promise<boolean>((done) => {
            resolve = done
          })
      },
      slots: {
        default: () => (
          <>
            <input />
            <input />
          </>
        )
      }
    })
    await nextTick()
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    wrapper.findAll('input')[1].element.remove()
    resolve(true)
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.find('input').element)
    wrapper.unmount()
  })

  it('focuses the first control and moves on Enter, skipping filled and disabled controls', async () => {
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      slots: {
        default: () => (
          <>
            <input />
            <input value="filled" />
            <input disabled />
            <input readonly />
            <input />
          </>
        )
      }
    })
    await nextTick()
    const inputs = wrapper.findAll('input')
    expect(document.activeElement).toBe(inputs[0].element)
    await inputs[0].trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement).toBe(inputs[4].element)
    wrapper.unmount()
  })

  it('supports order, ignore and reactive value metadata including zero and false', async () => {
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      slots: {
        default: () => (
          <>
            <NKeyboardInteractiveItem order={2}>
              <input id="second" />
            </NKeyboardInteractiveItem>
            <NKeyboardInteractiveItem order={1}>
              <input id="first" />
            </NKeyboardInteractiveItem>
            <NKeyboardInteractiveItem value={0}>
              <input />
            </NKeyboardInteractiveItem>
            <NKeyboardInteractiveItem value={false}>
              <input />
            </NKeyboardInteractiveItem>
            <NKeyboardInteractiveItem ignore>
              <input />
            </NKeyboardInteractiveItem>
            <input id="last" />
          </>
        )
      }
    })
    await nextTick()
    expect(document.activeElement?.id).toBe('first')
    await wrapper.find('#first').trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement?.id).toBe('second')
    await wrapper.find('#second').trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement?.id).toBe('last')
    wrapper.unmount()
  })

  it('loops and emits the terminal event once', async () => {
    const onLastBlur = vi.fn()
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      props: { loopFocus: true, onLastBlur },
      slots: {
        default: () => (
          <>
            <input />
            <input />
          </>
        )
      }
    })
    await nextTick()
    const instance = wrapper.vm as unknown as KeyboardInteractiveInst
    await instance.focus('last')
    await wrapper.findAll('input')[1].trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(onLastBlur).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(wrapper.find('input').element)
    wrapper.unmount()
  })

  it('stops on failed Naive UI form validation and supports form paths', async () => {
    const model = { name: '' }
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      slots: {
        default: () => (
          <NForm
            model={model}
            rules={{ name: { required: true, message: 'Required' } }}
          >
            <NFormItem path="name">
              <NInput />
            </NFormItem>
            <NFormItem path="other">
              <NInput />
            </NFormItem>
          </NForm>
        )
      }
    })
    await nextTick()
    const inputs = wrapper.findAll('input')
    await inputs[0].trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement).toBe(inputs[0].element)
    expect(wrapper.text()).toContain('Required')
    model.name = 'valid'
    await inputs[0].trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement).toBe(inputs[1].element)
    const instance = wrapper.vm as unknown as KeyboardInteractiveInst
    await instance.focus('name')
    expect(document.activeElement).toBe(inputs[0].element)
    wrapper.unmount()
  })

  it('allows an async provider to cancel and serializes repeated Enter events', async () => {
    let resolve!: (value: boolean) => void
    const enterProvider = vi.fn(
      () =>
        new Promise<boolean>((done) => {
          resolve = done
        })
    )
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      props: { enterProvider },
      slots: {
        default: () => (
          <>
            <input />
            <input />
          </>
        )
      }
    })
    await nextTick()
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    expect(enterProvider).toHaveBeenCalledTimes(1)
    resolve(false)
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.find('input').element)
    wrapper.unmount()
  })

  it('does not steal focus after asynchronous validation', async () => {
    let resolve!: (value: boolean) => void
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      slots: {
        default: () => (
          <>
            <NKeyboardInteractiveItem
              validate={() =>
                new Promise<boolean>((done) => {
                  resolve = done
                })}
            >
              <input />
            </NKeyboardInteractiveItem>
            <input />
            <input />
          </>
        )
      }
    })
    await nextTick()
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    const inputs = wrapper.findAll('input')
    inputs[2].element.focus()
    resolve(true)
    await flushPromises()
    expect(document.activeElement).toBe(inputs[2].element)
    wrapper.unmount()
  })

  it('traverses nested containers through the outer queue without duplicate events', async () => {
    const onEnter = vi.fn()
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      props: { onEnter, skipWhenHasValue: false },
      slots: {
        default: () => (
          <>
            <input />
            <NKeyboardInteractive>
              <input />
            </NKeyboardInteractive>
            <input />
          </>
        )
      }
    })
    await nextTick()
    const inputs = wrapper.findAll('input')
    await inputs[0].trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement).toBe(inputs[1].element)
    await inputs[1].trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(document.activeElement).toBe(inputs[2].element)
    expect(onEnter).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('supports row and field targeting and skips ignored controls in either direction', async () => {
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      slots: {
        default: () => (
          <>
            <NKeyboardInteractiveItem path="name" rowId="1">
              <input />
            </NKeyboardInteractiveItem>
            <NKeyboardInteractiveItem path="name" rowId="2">
              <input />
            </NKeyboardInteractiveItem>
            <NKeyboardInteractiveItem ignore>
              <input />
            </NKeyboardInteractiveItem>
            <input />
          </>
        )
      }
    })
    await nextTick()
    const instance = wrapper.vm as unknown as KeyboardInteractiveInst
    const inputs = wrapper.findAll('input')
    await instance.focus({ field: 'name' }, 'next', '2')
    expect(document.activeElement).toBe(inputs[3].element)
    await instance.focus('prev')
    expect(document.activeElement).toBe(inputs[1].element)
    expect(instance.currentFocused).toBe(inputs[1].element)
    expect(instance.previousFocused).toBe(inputs[3].element)
    expect(instance.nextFocused).toBe(inputs[3].element)
    wrapper.unmount()
  })

  it('ignores IME, modified Enter, textarea and disabled containers', async () => {
    const onEnter = vi.fn()
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      props: { onEnter },
      slots: {
        default: () => (
          <>
            <input />
            <textarea />
            <input />
          </>
        )
      }
    })
    await nextTick()
    await wrapper
      .find('input')
      .trigger('keyup', { key: 'Enter', isComposing: true })
    await wrapper
      .find('input')
      .trigger('keyup', { key: 'Enter', shiftKey: true })
    wrapper.find('textarea').element.focus()
    await wrapper.find('textarea').trigger('keyup', { key: 'Enter' })
    await wrapper.setProps({ disabled: true })
    await wrapper.find('input').trigger('keyup', { key: 'Enter' })
    await flushPromises()
    expect(onEnter).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('rebuilds the queue for dynamically inserted, reordered and hidden controls', async () => {
    const wrapper = mount(NKeyboardInteractive, {
      attachTo: document.body,
      props: { defaultFocusFirst: false },
      slots: {
        default: () => (
          <>
            <input />
            <input style="display: none" />
            <input />
          </>
        )
      }
    })
    const instance = wrapper.vm as unknown as KeyboardInteractiveInst
    await instance.focus('first')
    const inserted = document.createElement('input')
    wrapper.element.appendChild(inserted)
    await instance.focus('last')
    expect(document.activeElement).toBe(inserted)
    wrapper.element.prepend(inserted)
    await instance.focus('next')
    expect(document.activeElement).toBe(wrapper.findAll('input')[1].element)
    await instance.focus('next')
    expect(document.activeElement).toBe(wrapper.findAll('input')[3].element)
    wrapper.unmount()
  })
})
