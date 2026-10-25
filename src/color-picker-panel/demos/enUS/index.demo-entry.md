# ColorPickerPanel

An inline color editor similar to Element Plus ColorPickerPanel. It shares the palette, hue/alpha sliders, inputs and swatches with [ColorPicker](color-picker), without a trigger or popup.

## Demos

```demo
basic.vue
modes.vue
actions.vue
```

## API

### ColorPickerPanel Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| value | `string \| null` | `undefined` | Controlled color; null clears it |
| default-value | `string \| null` | Derived from modes / show-alpha | Initial uncontrolled value, matching ColorPicker |
| modes | `Array<'rgb' \| 'hex' \| 'hsl' \| 'hsv'>` | `['rgb', 'hex', 'hsl']` | Available modes; provide at least one |
| show-alpha | `boolean` | `true` | Show alpha slider and input |
| show-preview | `boolean` | `false` | Show the color preview control |
| swatches | `string[]` | `undefined` | Presets, emitted in the current mode |
| actions | `Array<'confirm' \| 'clear'>` | `null` | Built-in actions; the panel stays mounted afterwards |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Internal input size, inherited from forms |
| disabled | `boolean` | `undefined` | Disable editing; inherits form/container state |
| readonly | `boolean` | `undefined` | Show the color without allowing editing; inherits form readonly |
| ignore-parent-readonly | `boolean` | `false` | Ignore form readonly without bypassing disabling |
| on-update:value / on-update-value | `(value: string \| null) => void` | `undefined` | Live value updates; supports v-model:value |
| on-complete | `(value: string) => void` | `undefined` | End of an edit; matches ColorPicker. Presets only update the value |
| on-confirm | `(value: string \| null) => void` | `undefined` | Confirm without hiding the panel |
| on-clear | `() => void` | `undefined` | Clear action, alongside updating value to null |
| theme / theme-overrides / builtin-theme-overrides | Same as ColorPicker | `undefined` | Shared ColorPicker theme tokens |

### ColorPickerPanel Slots

| Name | Parameters | Description |
| --- | --- | --- |
| action | `()` | Extra actions; leave actions empty to use only this slot |

### ColorPickerPanel Inst

| Name | Type | Description |
| --- | --- | --- |
| inputElement | `HTMLElement \| null` | Current available input; supports inputElementRegistrationKey |

### Usage

Import `NColorPickerPanel`, `colorPickerPanelProps` and the `ColorPickerPanelProps`, `ColorPickerPanelSlots`, `ColorPickerPanelInst` types. The default plugin also registers this component. Use ConfigProvider theme-overrides.ColorPicker for shared theming. Dark themes, custom class prefixes and disabled contexts are supported.

Use Naive UI string colors and value/update:value rather than Element Plus model-value. Popup-only show, default-show, placement, to, render-label and show events are excluded. Control visibility with an outer v-if/v-show and width with style.width.
