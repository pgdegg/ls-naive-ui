import type { TabPaneActiveContext } from '../src/active-context'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { defineComponent, h, inject, nextTick, ref } from 'vue'
import { NTabPane, NTabs, tabPaneActiveContextKey } from '..'

enableAutoUnmount(afterEach)

it('provides reactive nested pane activation and paths', async () => {
  const outer = ref('outer')
  let context!: TabPaneActiveContext
  const Probe = defineComponent({
    setup() {
      context = inject(tabPaneActiveContextKey)!
      return () => null
    }
  })
  mount(() => (
    <NTabs value={outer.value}>
      <NTabPane name="outer" displayDirective="show">
        <NTabs defaultValue="inner">
          <NTabPane name="inner">
            <Probe />
          </NTabPane>
        </NTabs>
      </NTabPane>
      <NTabPane name="other">Other</NTabPane>
    </NTabs>
  ))
  expect(context.path.value).toBe('outer/inner')
  expect(context.selfActive.value).toBe(true)
  expect(context.active.value).toBe(true)
  outer.value = 'other'
  await nextTick()
  expect(context.selfActive.value).toBe(true)
  expect(context.active.value).toBe(false)
})
