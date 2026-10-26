# Time Picker

Like a digital clock.

## Demos

```demo
quick-input.vue
basic.vue
confirm.vue
size.vue
disabled-time.vue
step-time.vue
format.vue
actions.vue
hours12.vue
formatted.vue
focus.vue
status.vue
timezone.vue
```

## API

### TimePicker Props

| Name | Type | Default | Description | Version |
| --- | --- | --- | --- | --- |
| actions | `Array<'clear' \| 'now' \| 'confirm'> \| null` | `['now', 'confirm']` | Operations supported by the Time Picker. | `'clear'` 2.37.0 |
| clearable | `boolean` | `false` | Whether the value is clearable. |  |
| default-value | `number \| null` | `null` | Default value. |  |
| default-formatted-value | `number \| null` | `undefined` | Default formatted value. | 2.24.0 |
| disabled | `boolean` | `false` | Disabled state. |  |
| format | `string` | `'HH:mm:ss'` | Time format. For possible formats see [date-fns.org](https://date-fns.org/v2.23.0/docs/format). |  |
| formatted-value | `string \| null` | `undefined` | Formatted value. | 2.24.0 |
| hours | `number \| number[]` | `undefined` | The array of hours that can be selected. If a number, it'll be converted into an array of numbers using that increment. |  |
| minutes | `number \| number[]` | `undefined` | The array of minutes that can be selected. If a number, it'll be converted into an array of numbers using that increment. |  |
| seconds | `number \| number[]` | `undefined` | The array of seconds that can be selected. If a number, it'll be converted into an array of numbers using that increment. |  |
| input-readonly | `boolean` | `false` | Readonly state (does not apply to touch devices). |  |
| is-hour-disabled | `(hour: number) => boolean` | `() => false` | Callback function for disabling hours. |  |
| is-minute-disabled | `(minute: number, hour: number \| null) => boolean` | `() => false` | Callback function for disabling minutes. When value is empty, `hour` is `null`. |  |
| is-second-disabled | `(second: number, minute: number \| null, hour: number \| null) => boolean` | `() => false` | Callback function for disabling seconds. When value is empty, `hour` and `minute` are `null`. |  |
| placeholder | `string` | `'Select Time'` | Placeholder. |  |
| placement | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'bottom-start'` | Time picker panel's placement. | 2.25.0 |
| show | `boolean` | `undefined` | Whether to show panel | 2.28.3 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Size. |  |
| status | `'success' \| 'warning' \| 'error'` | `undefined` | Validation status. | 2.27.0 |
| time-zone | `string` | `undefined` | Time zone to be used to format the value. It follows [iana time zones](https://www.iana.org/time-zones). You can use `Intl.supportedValuesOf('timeZone')` to check supported values. | 2.30.0 |
| to | `string \| HTMLElement \| false` | `body` | Container node of the menu. `false` will keep it not detached. |  |
| use-12-hours | `boolean` | `false` | Whether to use a 12-hour clock panel. |  |
| value | `number \| null` | `undefined` | Value when being set manually. |  |
| value-format | `string` | follows `format` | Format of formatted value. | 2.24.0 |
| on-blur | `() => void` | `undefined` | Callback when the selection box loses focus. |  |
| on-clear | `() => void` | `undefined` | Callback when value is cleared. | 2.28.3 |
| on-confirm | `(value: number \| null, formattedValue: string \| null) => void` | `undefined` | Callback when the click confirm button. | 2.28.3 |
| on-focus | `() => void` | `undefined` | Callback when the selection box gets focus. |  |
| on-update:formatted-value | `(value: number \| null, timestampValue: number \| null) => void` | `undefined` | Callback when formatted value changes. | 2.24.0 |
| on-update:show | `(show: boolean) => void` | `undefined` | Callback when panel shows & hides. | 2.28.3 |
| on-update:value | `(value: number \| null, formattedValue: string \| null) => void` | `undefined` | Callback when the value changes. | `formattedValue` 2.24.0 |
| readonly | `boolean` | `undefined` | Readonly state, combined with the parent form readonly state. Disabled always takes precedence. [Example](#quick-input.vue) |  |
| ignore-parent-readonly | `boolean` | `false` | Ignore the parent form readonly state without overriding local readonly or disabled states. [Example](#quick-input.vue) |  |
| hide-placeholder | `boolean` | `undefined` | Hide placeholder text. Inherits the form setting when omitted; explicit false overrides the inherited setting. [Example](#quick-input.vue) |  |
| ignore-parent-hide-placeholder | `string \| string[]` | `undefined` | Pass `'form'` or an array containing `'form'` to ignore the form hide-placeholder setting. [Example](#quick-input.vue) |  |
| quick-input | `boolean` | `false` | Enable Enter-based parsing of compact or separated input, honoring disabled dates/times. Range input advances from the first field and only commits a complete range. [Example](#quick-input.vue) |  |
| default-to-extreme | `'min' \| 'max'` | `undefined` | Fill missing quick-input fields with minimum or maximum values. Uses the parser default min when omitted. [Example](#quick-input.vue) |  |

### TimePicker Slots

| Name | Parameters | Description |
| --- | --- | --- |
| icon | `()` | Custom icon |
| prepend | `()` | Content before the input, outside the input border and separate from prefix. |
| append | `()` | Content after the input, outside the input border and separate from suffix. |

### TimePicker Methods

| Name | Type | Description | Version |
| --- | --- | --- | --- |
| focus | `() => void` | Focus. | 2.24.2 |
| blur | `() => void` | Blur. | 2.24.2 |
| inputElement | `HTMLElement \| null` | Current input element. A registrar provided through inputElementRegistrationKey registers it automatically and cleans up on unmount/deactivation. |  |
