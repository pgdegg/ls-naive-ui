import { keysOf } from '../../_utils'
import { cardBaseProps } from '../../card/src/Card'
import { dialogProps } from '../../dialog/src/dialogProps'

const presetProps = {
  ...cardBaseProps,
  // 把 dialog 的 props 放在后面，因为我希望 card 默认不带边框
  ...dialogProps
}

const presetPropsKeys = keysOf(presetProps)

// Modal 会显式地把自身包装过的 onClose/onPositiveClick/onNegativeClick
// 传给 NModalBodyWrapper，所以在这里把它们排除掉——否则 Vue 会把每一对
// 合并成数组，导致 BodyWrapper 里直接调用 `props.onPositiveClick()` 时报错。
const forwardedPresetPropsKeys = presetPropsKeys.filter(
  key =>
    key !== 'onClose' && key !== 'onPositiveClick' && key !== 'onNegativeClick'
)

export { forwardedPresetPropsKeys, presetProps, presetPropsKeys }
