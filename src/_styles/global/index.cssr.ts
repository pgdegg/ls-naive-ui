import { c } from '../../_utils/cssr'
import commonVariables from '../common/_common'

const {
  fontSize,
  fontFamily,
  lineHeight
} = commonVariables

// 所有组件都需要这些样式
// 它是静态的，在应用的生命周期内不会改变
// 如果用户想覆盖它，需要使用提供的 `n-global-style`
//
// 从技术上讲，我们可以移除 font-size、font-family 和 line-height 使其
// 更纯粹，但这么做的编码成本并不划算。
//
// -webkit-tap-hilight-color:
// https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-tap-highlight-color
// 在一些安卓设备上会存在该样式。
export default c('body', `
  margin: 0;
  font-size: ${fontSize};
  font-family: ${fontFamily};
  line-height: ${lineHeight};
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
`, [
  c('input', `
    font-family: inherit;
    font-size: inherit;
  `)
])
