/**
 * 原始包是 https://www.npmjs.com/package/textarea-caret-ts
 * 原始文件是 https://github.com/TheRealSyler/textarea-caret-position/blob/master/index.ts
 *
 * 这里我修改了它，使其在 input 滚动时也能正常工作。
 */

import { isBrowser } from '../../_utils'

export interface Position {
  /**
   * 以像素为单位的位置。
   */
  top: number
  /**
   * 以像素为单位的位置。
   */
  left: number
  /**
   * 为 true 时位置相对于窗口内尺寸，为 false 时位置相对于元素自身。
   */
  absolute: boolean
  /**
   * 以像素为单位的高度。
   */
  height: number
}
export interface Point {
  /**
   * 左侧位置。
   */
  left: number
  /**
   * 顶部位置。
   */
  top: number
}
export interface Options {
  /**
   * 启用调试模式。
   */
  debug?: boolean
  /**
   * 使用 selectionEnd 而非 selectionStart。
   */
  useSelectionEnd?: boolean
  /**
   * 为 true 时，当 left >= 元素宽度时会截断 left 位置。
   */
  checkWidthOverflow?: boolean
}

/**
 * 返回给定元素中光标的绝对位置（相对于窗口内尺寸）。
 * @param element 输入框（type 必须为 'text'）或文本域。
 */
export function getAbsolutePosition(
  element: HTMLInputElement | HTMLTextAreaElement
): Position {
  const caretRelPost = getRelativePosition(element)
  return {
    left:
      window.scrollX + element.getBoundingClientRect().left + caretRelPost.left,
    top:
      window.scrollY + element.getBoundingClientRect().top + caretRelPost.top,
    absolute: true,
    height: caretRelPost.height
  }
}
/**
 * 返回给定元素中光标的相对位置。
 * @param element 输入框（type 必须为 'text'）或文本域。
 */
export function getRelativePosition(
  element: HTMLInputElement | HTMLTextAreaElement,
  options: Options = {
    debug: false,
    useSelectionEnd: false,
    checkWidthOverflow: true
  }
): Position {
  const selectionStart
    = element.selectionStart !== null ? element.selectionStart : 0
  const selectionEnd = element.selectionEnd !== null ? element.selectionEnd : 0
  const position = options.useSelectionEnd ? selectionEnd : selectionStart
  // 我们将把下面的样式属性复制到镜像 div 中。
  // 注意，某些浏览器（如 Firefox）不会把属性合并为简写形式
  // （例如 padding-top、padding-bottom 等合并为 padding），
  // 因此我们必须逐一显式列出每个属性。
  const properties: string[] = [
    'direction', // 支持 RTL
    'boxSizing',
    'width', // 在 Chrome 和 IE 中排除滚动条，使镜像 div 的换行行为与 textarea 完全一致
    'height',
    'overflowX',
    'overflowY', // 为 IE 复制滚动条
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration', // 可能没有区别，但稳妥起见保留
    'letterSpacing',
    'wordSpacing',
    'tabSize',
    'MozTabSize'
  ]
  // Firefox 1.0+
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
  if (!isBrowser) {
    throw new Error(
      'textarea-caret-position#getCaretPosition should only be called in a browser'
    )
  }

  const debug = options?.debug
  if (debug) {
    const el = document.querySelector(
      '#input-textarea-caret-position-mirror-div'
    )
    if (el?.parentNode)
      el.parentNode.removeChild(el)
  }

  // 镜像 div 将复刻 textarea 的样式
  const div = document.createElement('div')
  div.id = 'input-textarea-caret-position-mirror-div'
  document.body.appendChild(div)

  const style = div.style
  const computed = window.getComputedStyle
    ? window.getComputedStyle(element)
    : (element as any).currentStyle // currentStyle，用于 IE < 9

  const isInput = element.nodeName === 'INPUT'

  // 默认的 textarea 样式
  style.whiteSpace = isInput ? 'nowrap' : 'pre-wrap'
  if (!isInput)
    style.wordWrap = 'break-word' // 仅用于 textarea

  // 定位到屏幕之外
  style.position = 'absolute' // 正确返回坐标所必需
  if (!debug)
    style.visibility = 'hidden' // 不使用 'display: none'，因为我们仍需要渲染

  // 将元素的属性转移到 div 上
  properties.forEach((prop) => {
    if (isInput && prop === 'lineHeight') {
      // <input> 的特殊情况：文本居中渲染，且行高可能不等于高度
      if (computed.boxSizing === 'border-box') {
        const height = Number.parseInt(computed.height as string)
        const outerHeight
          = Number.parseInt(computed.paddingTop as string)
            + Number.parseInt(computed.paddingBottom as string)
            + Number.parseInt(computed.borderTopWidth as string)
            + Number.parseInt(computed.borderBottomWidth as string)
        const targetHeight
          = outerHeight + Number.parseInt(computed.lineHeight as string)
        if (height > targetHeight) {
          style.lineHeight = `${height - outerHeight}px`
        }
        else if (height === targetHeight) {
          style.lineHeight = computed.lineHeight
        }
        else {
          style.lineHeight = '0'
        }
      }
      else {
        style.lineHeight = computed.height
      }
    }
    else {
      style[prop as any] = computed[prop]
    }
  })

  if (isFirefox) {
    // Firefox 在 textarea 的 overflow 属性上报值不准确：https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > Number.parseInt(computed.height as string)) {
      style.overflowY = 'scroll'
    }
  }
  else {
    style.overflow = 'hidden' // 避免 Chrome 渲染滚动条；IE 保持 overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position)
  // 第二个特殊处理，针对 input type="text" 与 textarea：
  // 空格需要替换为不换行空格 - http://stackoverflow.com/a/13402035/1269037
  if (isInput && div.textContent) {
    div.textContent = div.textContent.replace(/\s/g, '\u00A0')
  }

  const span = document.createElement('span')
  // 换行必须被*精确*复刻，包括长单词被折到
  // 下一行、且前一行末尾保留空白的情况（#7）。
  // 唯一可靠的做法是把剩余的*全部*内容复制到
  // 光标位置处创建的 <span> 中。
  // 对于 input，只用 '.' 就足够了，这里无需这么麻烦。
  span.textContent = element.value.substring(position) || '.' // 使用 || 是因为完全为空的伪 span 根本不会渲染
  span.style.position = 'relative'
  span.style.left = `${-element.scrollLeft}px`
  span.style.top = `${-element.scrollTop}px`
  div.appendChild(span)

  const relativePosition = {
    top: span.offsetTop + Number.parseInt(computed.borderTopWidth as string),
    left: span.offsetLeft + Number.parseInt(computed.borderLeftWidth as string),
    absolute: false,
    // 这里不使用 line-height，因为它对定位来说可能过大，例如 34px
    // 适用于 input
    height: Number.parseInt(computed.fontSize as string) * 1.5
  }

  if (debug) {
    span.style.backgroundColor = '#aaa'
  }
  else {
    document.body.removeChild(div)
  }

  if (
    relativePosition.left >= element.clientWidth
    && options.checkWidthOverflow
  ) {
    relativePosition.left = element.clientWidth
  }
  return relativePosition
}
/**
 * 基于 caretElement 光标的绝对位置，设置元素的 top 和 left CSS 样式，
 * @param offset 对位置进行偏移。
 * @param detectBoundary 当位置超出窗口时对位置进行偏移。
 * @param returnOnly 为 true 时不设置元素位置。
 */
export function setElementPositionBasedOnCaret(
  element: HTMLElement,
  caretElement: HTMLInputElement | HTMLTextAreaElement,
  offset: Point = { top: 0, left: 0 },
  margin: number = 2,
  detectBoundary = true,
  returnOnly = false
): Point {
  const pos = getAbsolutePosition(caretElement)
  if (detectBoundary) {
    pos.left
      = pos.left + (element.clientWidth + margin) + offset.left
        > window.scrollX + window.innerWidth
        ? (pos.left
            = window.scrollX + window.innerWidth - (element.clientWidth + margin))
        : (pos.left += offset.left)
    pos.top
      = pos.top + (element.clientWidth + margin) + offset.top
        > window.scrollY + window.innerHeight
        ? (pos.top -= element.clientWidth + margin)
        : (pos.top += offset.top)
  }
  else {
    pos.top += offset.top
    pos.left += offset.left
  }
  if (!returnOnly) {
    element.style.top = `${pos.top}px`
    element.style.left = `${pos.left}px`
  }
  return pos
}
