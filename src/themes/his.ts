import type { GlobalThemeOverrides } from '../config-provider'

export const hisThemeOverrides: GlobalThemeOverrides = {
  common: { heightMedium: '28px', textColor2: '#313131' },
  Input: { borderHover: '1px solid #24ab9e' },
  Select: {
    peers: { InternalSelection: { borderHover: '1px solid #24ab9e' } }
  },
  DatePicker: { inputWidthDateTimeRange: '320px' }
}
