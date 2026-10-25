import type { DialogApiInjection } from '../src/DialogProvider'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { NDialogProvider, useDialog } from '..'

enableAutoUnmount(afterEach)

function setup() {
  let api!: DialogApiInjection
  const Child = defineComponent({
    setup() {
      api = useDialog()
      return () => null
    }
  })
  const wrapper = mount(
    () => (
      <NDialogProvider>
        <Child />
      </NDialogProvider>
    ),
    { attachTo: document.body }
  )
  return { wrapper, api }
}

describe('dialog confirmation', () => {
  it('resolves confirmation and applies provider defaults', async () => {
    const { api } = setup()
    api.setConfirmDefaults({ positiveText: 'Save' })
    const result = api.confirm({ content: 'Confirm content' })
    await flushPromises()
    const button = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.n-dialog button')
    ).find(el => el.textContent?.includes('Save'))!
    button.click()
    await expect(result).resolves.toBe('confirm')
    expect(document.querySelector('[resolveoncancel]')).toBeNull()
  })
  it('rejects cancellation by default and permits async veto', async () => {
    const { api } = setup()
    const onNegativeClick = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(undefined)
    const result = api.confirm({ negativeText: 'Cancel', onNegativeClick })
    const rejection = expect(result).rejects.toBe('cancel')
    await flushPromises()
    const button = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.n-dialog button')
    ).find(el => el.textContent?.includes('Cancel'))!
    button.click()
    await flushPromises()
    expect(document.querySelector('.n-dialog')).not.toBeNull()
    button.click()
    await rejection
    expect(onNegativeClick).toHaveBeenCalledTimes(2)
  })
  it('distinguishes close when cancellation resolution is enabled', async () => {
    const { api } = setup()
    const result = api.confirm({
      resolveOnCancel: true,
      distinguishCancelAndClose: true
    })
    await flushPromises()
    document.querySelector<HTMLButtonElement>('.n-dialog__close')!.click()
    await expect(result).resolves.toBe('close')
  })
})
