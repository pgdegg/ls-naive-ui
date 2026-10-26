# Input Number

If you just want a number, this is for you.

## Demos

```demo
basic.vue
disabled.vue
parse.vue
precision.vue
event.vue
icon.vue
button-placement.vue
right-vertical.vue
loading.vue
min-max.vue
size.vue
step.vue
validator.vue
show-button.vue
disable-keyboard.vue
change-timing.vue
status.vue
custom-icon.vue
```

## API

### InputNumber Props

| Name | Type | Default | Description | Version |
| --- | --- | --- | --- | --- |
| autofocus | `boolean` | `false` | Whether to autofocus. | 2.26.1 |
| bordered | `boolean` | `true` | Whether to show a border. |  |
| button-placement | `'right' \| 'both' \| 'right-vertical'` | `'right'` | Button position: horizontal on the right, on both sides, or vertically stacked on the right (up increments, down decrements). Supports hold, keyboard, limits and icon slots. [Example](#precision.vue) |  |
| clearable | `boolean` | `false` | Whether the input is clearable. |  |
| default-value | `number \| null` | `null` | Default value when not manually set. |  |
| disabled | `boolean` | `false` | Whether to disable the input. |  |
| format | `(value: number \| null) => string` | `undefined` | Method to format value. If it's set, `update-value-on-input` will be disabled. | 2.30.0 |
| input-props | `InputHTMLAttributes` | `undefined` | The dom props of the input element inside the component. For avaiable attributes, [see here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input). Warning：It won't override internal props with the same name (except `type`). | 2.37.0 |
| keyboard | `{ ArrowUp?: boolean, ArrowDown?: boolean }` | `{}` | Control the keyboard behavior. If you set corresponding to false, the keyboard behavior will be disabled. |  |
| loading | `boolean` | `undefined` | Set loading state. If set (true/false), the element will always take up enough space for the loading indicator. |  |
| max | `number` | `undefined` | The max value. |  |
| min | `number` | `undefined` | The min value. |  |
| parse | `(input: string) => number \| null` | `undefined` | Method to parse input string. If it's set, `update-value-on-input` will be disabled. | 2.30.0 |
| placeholder | `string` | `'Please Input'` | Placeholder. |  |
| precision | `number` | `undefined` | Precision of input value. If it's set, `update-value-on-input` will be disabled. | 2.30.0 |
| round | `boolean` | `undefined` | Use a rounded input style. | 2.39.0 |
| readonly | `boolean` | `false` | Readonly state, combined with the parent form readonly state. Disabled always takes precedence. [Example](#precision.vue) |  |
| show-button | `boolean` | `true` | Whether to show increase/decrease buttons. |  |
| size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | The size of input box. |  |
| status | `'success' \| 'warning' \| 'error'` | `undefined` | Validation status. | 2.27.0 |
| step | `number` | `1` | The number which the current value is increased or decreased on key or button press. It can be an integer or a decimal. |  |
| update-value-on-input | `boolean` | `true` | Whether to change the value on input if the input value is valid. |  |
| validator | `(value) => boolean` | `undefined` | Setup custom validation. |  |
| value | `number \| null` | `undefined` | Manually set the input value. |  |
| on-blur | `(event: FocusEvent) => void` | `undefined` | Callback triggered when the input is blurred. |  |
| on-clear | `() => void` | `undefined` | Callback triggered when the input is cleared. |  |
| on-focus | `(event: FocusEvent) => void` | `undefined` | Callback triggered when the input is focussed on. |  |
| on-update:value | `(value: number \| null) => void` | `undefined` | Callback triggered when the input value changes. |  |
| ignore-parent-readonly | `boolean` | `false` | Ignore the parent form readonly state without overriding local readonly or disabled states. [Example](#precision.vue) |  |
| hide-placeholder | `boolean` | `undefined` | Hide placeholder text. Inherits the form setting when omitted; explicit false overrides the inherited setting. [Example](#precision.vue) |  |
| ignore-parent-hide-placeholder | `string \| string[]` | `undefined` | Pass `'form'` or an array containing `'form'` to ignore the form hide-placeholder setting. [Example](#precision.vue) |  |
| max-precision | `number` | `undefined` | Maximum decimal places. Rounds excess digits without padding zeros; does not replace precision semantics. [Example](#precision.vue) |  |
| on-precision-exceed | `(value: number, precision: number) => void` | `undefined` | Called when exceeding max-precision causes rounding, with the original number and decimal limit. [Example](#precision.vue) |  |

### InputNumber Slots

| Name | Parameters | Description | Version |
| --- | --- | --- | --- |
| add-icon | `()` | icon of the add button. | 2.28.1 |
| minus-icon | `()` | icon of the minus button. | 2.28.1 |
| prefix | `()` | Prefix content slot. |  |
| suffix | `()` | Suffix content slot. |  |
| prepend | `()` | Content before the input, outside the input border and separate from prefix. |  |
| append | `()` | Content after the input, outside the input border and separate from suffix. |  |

### InputNumber Methods

| Name | Type | Description |
| --- | --- | --- |
| blur | `() => void` | Blur the input number. |
| focus | `() => void` | Focus the input number. |
| inputElement | `HTMLElement \| null` | Current input element. A registrar provided through inputElementRegistrationKey registers it automatically and cleans up on unmount/deactivation. |
