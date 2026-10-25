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
  c('.bold-content__value input, .bold-content__value textarea, .bold-content__value .n-base-selection-label', { fontWeight: 'bold' }),
  c('.bold-content__value input::placeholder, .bold-content__value textarea::placeholder', { fontWeight: 'normal' }),
  c('.bold-content__label label', { fontWeight: 'bold' }),
  c('.bold-content__placeholder input::placeholder, .bold-content__placeholder textarea::placeholder, .bold-content__placeholder .n-input__placeholder', { fontWeight: 'bold' }),
  c('.zoom-content__value input, .zoom-content__value textarea, .zoom-content__label label, .zoom-content__placeholder input::placeholder, .zoom-content__placeholder .n-input__placeholder', { fontSize: '1.2em' }),
  c('.n-input--readonly:not(.n-input--disabled)', { backgroundColor: '#fafbfc' }),
  c('.hide-circle .n-radio__dot-wrapper, .hide-circle .n-checkbox-box-wrapper', { width: 0, overflow: 'hidden', margin: 0 }),
  c('.hide-circle .n-radio__label, .hide-circle .n-checkbox__label', { paddingLeft: 0 }),
  c('.cancel-disabled.n-checkbox--checked .n-checkbox__label', { color: 'var(--n-color-checked)' }),
  c('.cancel-disabled .n-radio--checked .n-radio__label', { color: 'var(--n-dot-color-active)' }),
  c('.inline-placeholder .n-base-selection-placeholder', { color: 'inherit' }),
  c('.ignore-disable__style .n-base-selection--disabled .n-base-selection-label, .ignore-disable__style .n-input--disabled', { backgroundColor: 'transparent', cursor: 'pointer' }),
  c('.scan.n-input--focus', { animation: 'n-his-scan-focus 2s ease-in-out infinite' }),
  c('@keyframes n-his-scan-focus', { '0%, 60%, 100%': { boxShadow: '0 0 4px rgba(19,194,194,.2)' }, '12%, 35%': { boxShadow: '0 0 14px rgba(19,194,194,.65)' } }),
  c('input', `
    font-family: inherit;
    font-size: inherit;
  `)
])
