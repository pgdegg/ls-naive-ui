import { cB } from '../../../_utils/cssr'

// 变量：
// --input-width
export default cB('dynamic-tags', [
  cB('input', {
    minWidth: 'var(--n-input-width)'
  })
])
