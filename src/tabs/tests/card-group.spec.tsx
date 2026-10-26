import { enableAutoUnmount, mount } from '@vue/test-utils'
import { h } from 'vue'
import { NTab, NTabPane, NTabs } from '..'

enableAutoUnmount(afterEach)

describe('card group and close-button display', () => {
  it.each(['card', 'card-group', 'border-card'] as const)(
    'defaults to hover and allows global and per-pane overrides with %s',
    async (type) => {
      const wrapper = mount(NTabs, {
        props: { type, closable: true, defaultValue: 'inherit' },
        slots: {
          default: () => [
            <NTabPane name="inherit" tab="Inherited" />,
            <NTabPane name="pinned" tab="Pinned" closeButtonDisplay="always" />,
            <NTabPane name="hover" tab="Hover" closeButtonDisplay="hover" />,
            <NTabPane name="no-close" tab="No close" closable={false} />
          ]
        }
      })
      const mode = (name: string) =>
        wrapper
          .find(`[data-name="${name}"]`)
          .classes()
          .includes('n-tabs-tab--close-always')
      expect(mode('inherit')).toBe(false)
      expect(mode('pinned')).toBe(true)
      expect(mode('hover')).toBe(false)
      expect(
        wrapper.find('[data-name="no-close"] .n-tabs-tab__close').exists()
      ).toBe(false)
      await wrapper.setProps({ closeButtonDisplay: 'always' })
      expect(mode('inherit')).toBe(true)
      expect(mode('pinned')).toBe(true)
      expect(mode('hover')).toBe(false)
      await wrapper.setProps({ closeButtonDisplay: 'hover' })
      expect(mode('inherit')).toBe(false)
    }
  )

  it('supports close/add events and standalone Tab overrides', async () => {
    const onClose = vi.fn()
    const onAdd = vi.fn()
    const wrapper = mount(() => (
      <NTabs
        type="card-group"
        defaultValue="a"
        closable
        addable
        onClose={onClose}
        onAdd={onAdd}
      >
        <NTab name="a" closeButtonDisplay="always">
          Alpha
        </NTab>
        <NTab name="b" disabled>
          Disabled
        </NTab>
      </NTabs>
    ))
    expect(wrapper.find('.n-tabs').classes()).toContain(
      'n-tabs--card-group-type'
    )
    expect(wrapper.find('.n-tabs-bar').exists()).toBe(false)
    expect(wrapper.find('[data-name="a"]').classes()).toContain(
      'n-tabs-tab--close-always'
    )
    await wrapper.find('[data-name="a"] .n-tabs-tab__close').trigger('click')
    expect(onClose).toHaveBeenLastCalledWith('a')
    await wrapper.find('[data-name="b"] .n-tabs-tab__close').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
    await wrapper.find('.n-tabs-tab--addable').trigger('click')
    expect(onAdd).toHaveBeenCalledTimes(1)
  })
})
