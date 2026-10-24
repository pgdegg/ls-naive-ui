import type { PropType } from 'vue'
import type { ColorPickerMode } from './utils'
import { hsv2rgb, hsva, toRgbaString } from 'seemly'
import { computed, defineComponent, h } from 'vue'
import { warn } from '../../_utils'
import { convertColor, getModeFromValue } from './utils'

// 尝试将颜色值规范化，以确保它们是合法的 CSS 颜色
function normalizeColor(color: string, mode: ColorPickerMode | null): string {
  if (mode === 'hsv') {
    const [h, s, v, a] = hsva(color)
    return toRgbaString([...hsv2rgb(h, s, v), a])
  }
  // 对于预设中不存在的模式，保留原始值。
  // 颜色名称对 CSS 而言是合法的，因此不做处理，
  // 仅在输出时才将其标准化。
  return color
}

function getHexFromName(color: string): string {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) {
    return '#000000'
  }
  ctx.fillStyle = color
  return ctx.fillStyle
}

interface ParsedColor {
  value: string
  mode: ColorPickerMode | null
  legalValue: string
}

export default defineComponent({
  name: 'ColorPickerSwatches',
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    mode: {
      type: String as PropType<ColorPickerMode>,
      required: true
    },
    swatches: {
      type: Array as PropType<string[]>,
      required: true
    },
    onUpdateColor: {
      type: Function as PropType<(value: string) => void>,
      required: true
    }
  },
  setup(props) {
    const parsedSwatchesRef = computed<ParsedColor[]>(() =>
      props.swatches.map((value) => {
        const mode = getModeFromValue(value)
        return {
          value,
          mode,
          legalValue: normalizeColor(value, mode)
        }
      })
    )

    function normalizeOutput(parsed: ParsedColor): string {
      const { mode: modeProp } = props
      let { value, mode: swatchColorMode } = parsed
      // 颜色名称会被转换为 hex
      if (!swatchColorMode) {
        swatchColorMode = 'hex'
        if (/^[a-zA-Z]+$/.test(value)) {
          value = getHexFromName(value)
        }
        else {
          // 对于非法的颜色，将其置为黑色
          warn('color-picker', `color ${value} in swatches is invalid.`)
          value = '#000000'
        }
      }

      if (swatchColorMode === modeProp)
        return value

      // 将色块值转换为当前模式的值
      return convertColor(value, modeProp, swatchColorMode)
    }

    function handleSwatchSelect(parsed: ParsedColor): void {
      props.onUpdateColor(normalizeOutput(parsed))
    }

    function handleSwatchKeyDown(e: KeyboardEvent, parsed: ParsedColor): void {
      if (e.key === 'Enter')
        handleSwatchSelect(parsed)
    }

    return {
      parsedSwatchesRef,
      handleSwatchSelect,
      handleSwatchKeyDown
    }
  },
  render() {
    const { clsPrefix } = this
    return (
      <div class={`${clsPrefix}-color-picker-swatches`}>
        {this.parsedSwatchesRef.map(swatch => (
          <div
            class={`${clsPrefix}-color-picker-swatch`}
            tabindex={0}
            onClick={() => {
              this.handleSwatchSelect(swatch)
            }}
            onKeydown={(e) => {
              this.handleSwatchKeyDown(e, swatch)
            }}
          >
            <div
              class={`${clsPrefix}-color-picker-swatch__fill`}
              style={{ background: swatch.legalValue }}
            />
          </div>
        ))}
      </div>
    )
  }
})
