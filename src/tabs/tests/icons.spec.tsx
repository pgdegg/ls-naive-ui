import { enableAutoUnmount, mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { NTab, NTabPane, NTabs } from '..'

enableAutoUnmount(afterEach)

describe('tab icons', () => {
  it.each(['bar', 'card', 'segment'] as const)(
    'renders icon props and slots with %s tabs',
    async (type) => {
      const wrapper = mount(() => (
        <NTabs type={type} defaultValue="middle">
          <NTabPane
            name="left"
            tab="Pinned left"
            fixed="left"
            icon={() => <svg data-testid="left-icon" />}
          />
          <NTabPane name="middle" tab="Middle" icon="missing-sprite" />
          <NTabPane
            name="right"
            tab="Pinned right"
            fixed="right"
            icon="overridden"
          >
            {{
              icon: () => <svg data-testid="right-icon" />,
              default: () => 'Right content'
            }}
          </NTabPane>
        </NTabs>
      ))
      expect(
        wrapper.find('.n-tabs-fixed--left [data-testid="left-icon"]').exists()
      ).toBe(true)
      expect(wrapper.findAll('[data-name="left"]')).toHaveLength(1)
      expect(wrapper.findAll('[data-name="right"]')).toHaveLength(1)
      expect(
        wrapper.find('[data-name="middle"] .n-tabs-tab__label').text()
      ).toBe('Middle')
      expect(
        wrapper.find('[data-name="middle"] .n-icon__placeholder').exists()
      ).toBe(true)
      expect(
        wrapper.find('.n-tabs-fixed--right [data-testid="right-icon"]').exists()
      ).toBe(true)
      expect(
        wrapper.find('.n-tabs-fixed--right .n-icon__placeholder').exists()
      ).toBe(false)
      await wrapper.find('.n-tabs-fixed--right .n-tabs-tab').trigger('click')
      expect(wrapper.find('.n-tab-pane').text()).toBe('Right content')
    }
  )
  it('supports standalone tabs and preserves custom label content', () => {
    const wrapper = mount(() => (
      <NTabs defaultValue="a">
        <NTab name="a" icon={<svg data-testid="icon" />}>
          <b>Custom label</b>
        </NTab>
        <NTab name="b">
          {{
            icon: () => <svg data-testid="slot-icon" />,
            default: () => 'Second label'
          }}
        </NTab>
      </NTabs>
    ))
    expect(wrapper.findAll('.n-tabs-tab__icon')).toHaveLength(2)
    expect(wrapper.find('b').text()).toBe('Custom label')
    expect(wrapper.find('[data-testid="slot-icon"]').exists()).toBe(true)
  })
  it('updates a rendered icon prop without adding empty icon wrappers', async () => {
    const icon = ref<string>()
    const wrapper = mount(() => (
      <NTabs defaultValue="a">
        <NTabPane name="a" tab="Text only" icon={icon.value} />
      </NTabs>
    ))
    expect(wrapper.find('.n-tabs-tab__icon').exists()).toBe(false)
    expect(wrapper.find('[data-name="a"]').text()).toBe('Text only')
    icon.value = 'dynamic'
    await nextTick()
    expect(
      wrapper.find('.n-tabs-tab__icon .n-icon__placeholder').exists()
    ).toBe(true)
    icon.value = undefined
    await nextTick()
    expect(wrapper.find('.n-tabs-tab__icon').exists()).toBe(false)
    expect(wrapper.find('[data-name="a"]').text()).toBe('Text only')
  })
})
