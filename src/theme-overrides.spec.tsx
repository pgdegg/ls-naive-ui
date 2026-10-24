/**
 * 针对 themeOverrides 的纯类型 JSX 检查。
 * 由 `tsc -p tsconfig.test.json` 断言；运行时测试为空操作。
 */
import { describe, it } from 'vitest'
import { Fragment, h } from 'vue'
import { NButton } from './button'
import { NDataTable } from './data-table'
import { NEllipsis } from './ellipsis'
import { NMessageProvider } from './message'
import { NTabs } from './tabs'
import { NText } from './typography'

describe('themeOverrides types', () => {
  it('accepts valid overrides and rejects invalid keys', () => {
    void (() => (
      <>
        {/* 叶子主题，没有 peers */}
        <NButton
          themeOverrides={{
            heightTiny: '1px',
            common: { primaryColor: '#000' }
          }}
        />
        <NButton
          themeOverrides={{
            // @ts-expect-error 无效的主题覆盖键
            notARealThemeVar: '1px'
          }}
        />

        {/* 带有 peers 的主题 */}
        <NTabs
          themeOverrides={{
            colorSegment: '#fff',
            peers: {
              Button: { heightTiny: '1px' }
            }
          }}
        />
        <NTabs
          themeOverrides={{
            peers: {
              // @ts-expect-error 无效的主题 peer 键
              NotARealThemePeer: {}
            }
          }}
        />

        {/* 多个 peers */}
        <NDataTable
          themeOverrides={{
            actionDividerColor: '#eee',
            peers: {
              Button: {},
              Checkbox: {},
              Pagination: {}
            }
          }}
        />

        {/* 空的 self 变量 + peer */}
        <NEllipsis
          themeOverrides={{
            peers: {
              Tooltip: {}
            }
          }}
        />

        {/* 共享的 typography 主题 */}
        <NText
          themeOverrides={{
            aTextColor: '#000'
          }}
        />

        {/* 提供者 */}
        <NMessageProvider
          themeOverrides={{
            closeBorderRadius: '2px'
          }}
        />
      </>
    ))
  })
})
