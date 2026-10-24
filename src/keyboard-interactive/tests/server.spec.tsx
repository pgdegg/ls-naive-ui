// @vitest-environment node
import { renderToString } from '@vue/server-renderer'
import { h } from 'vue'
import { NKeyboardInteractive, NKeyboardInteractiveItem } from '../index'

describe('n-keyboard-interactive SSR', () => {
  it('renders nested controls without accessing browser globals', async () => {
    const html = await renderToString(
      h(NKeyboardInteractive, null, {
        default: () =>
          h(
            NKeyboardInteractiveItem,
            { path: 'name' },
            {
              default: () => h('input')
            }
          )
      })
    )
    expect(html).toContain('n-keyboard-interactive')
    expect(html).toContain('<input>')
  })
})
