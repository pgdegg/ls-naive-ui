import { isBrowser } from '../../_utils'

let supportFlexGap: boolean | undefined

export function ensureSupportFlexGap(): boolean {
  if (!isBrowser)
    return true
  if (supportFlexGap === undefined) {
    // 创建设置了 row-gap 的 flex 容器
    const flex = document.createElement('div')
    flex.style.display = 'flex'
    flex.style.flexDirection = 'column'
    flex.style.rowGap = '1px'

    // 在其中创建两个元素
    flex.appendChild(document.createElement('div'))
    flex.appendChild(document.createElement('div'))

    // 追加到 DOM 中（需要获取 scrollHeight）
    document.body.appendChild(flex)
    const isSupported = flex.scrollHeight === 1 // flex 容器通过 row-gap 保持为 1px 高
    document.body.removeChild(flex)
    return (supportFlexGap = isSupported)
  }
  return supportFlexGap
}
