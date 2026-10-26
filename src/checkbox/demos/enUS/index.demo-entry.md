# Checkbox

Yo, yo, check it out.

## Demos

```demo
group-state.vue
basic.vue
size.vue
group.vue
options.vue
grid.vue
indeterminate.vue
controlled.vue
event.vue
customize-value.vue
focus.vue
```

## API

### Checkbox Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | Whether the checkbox is being checked manually. |
| checked-value | `string \| boolean \| number` | `true` | Value of checked state. |
| default-checked | `boolean` | `false` | Whether the checkbox is checked by default. |
| disabled | `boolean` | `false` | Whether the checkbox is disabled. |
| focusable | `boolean` | `true` | Whether the checkbox gains focus after being checked. |
| indeterminate | `boolean` | `false` | Whether the checkbox can have a third indeterminate state. |
| label | `string` | `undefined` | Checkbox label. |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | The size of the checkbox. |
| unchecked-value | `string \| boolean \| number` | `false` | Value of unchecked state. |
| value | `string \| number` | `undefined` | The value of the checkbox to be used in a checkbox group. |
| on-update:checked | `(checked: boolean) => void` | `undefined` | Callback function triggered on a checked status change. |
| readonly | `boolean` | `undefined` | Readonly state, combined with the parent form readonly state. Disabled always takes precedence. [Example](#group-state.vue) |
| ignore-parent-readonly | `boolean` | `false` | Ignore the parent form readonly state without overriding local readonly or disabled states. [Example](#group-state.vue) |
| hide-circle | `boolean` | `false` | Hide the check indicator while preserving checked state, label and keyboard interaction. [Example](#group-state.vue) |
| cancel-disabled | `boolean` | `false` | Adjust the label color for disabled checked options. Does not enable interaction or change checked state. [Example](#group-state.vue) |

### CheckboxGroup Props

| Name | Type | Default | Description | Version |
| --- | --- | --- | --- | --- |
| disabled | `boolean` | `false` | Whether the checkbox group is disabled. |  |
| default-value | `Array<string \| number>` | `null` | Checkbox group's default selected value. |  |
| label-field | `string` | `'label'` | The field name of option labels in `options`. | 2.45.0 |
| max | `number` | `undefined` | The maximum number of checkboxes that can be checked. |  |
| min | `number` | `undefined` | The minimum number of checkboxes that can be checked. |  |
| options | `Array<{ label?: string, value: string \| number, disabled?: boolean }>` | `undefined` | Options for the checkbox group. When set, the default slot is ignored. | 2.45.0 |
| value | `Array<string \| number> \| null` | `undefined` | Manually set values of a checkbox group. |  |
| value-field | `string` | `'value'` | The field name of option values in `options`. | 2.45.0 |
| on-update:value | `(value: (string \| number)[], meta: { actionType: 'check' \| 'uncheck', value: string \| number }) => void` | `undefined` | Callback when the checkbox group's value changes. | `meta` 2.32.0 |
| readonly | `boolean` | `undefined` | Readonly state, combined with the parent form readonly state. Disabled always takes precedence. [Example](#group-state.vue) |  |
| ignore-parent-readonly | `boolean` | `false` | Ignore the parent form readonly state without overriding local readonly or disabled states. [Example](#group-state.vue) |  |

### Checkbox Slots

| Name    | Parameters | Description              |
| ------- | ---------- | ------------------------ |
| default | `()`       | Content of the checkbox. |

### CheckboxGroup Slots

| Name    | Parameters | Description                    |
| ------- | ---------- | ------------------------------ |
| default | `()`       | Content of the checkbox group. |

### Checkbox Methods

| Name  | Type         | Description | Version |
| ----- | ------------ | ----------- | ------- |
| focus | `() => void` | Focus.      | 2.24.2  |
| blur  | `() => void` | Blur.       | 2.24.2  |

### CheckboxGroup Methods

| Name | Type | Description |
| --- | --- | --- |
| inputElement | `HTMLElement \| null` | Current checkbox-group entry element. |
| allChecked | `boolean` | Readonly: whether all visible, enabled options are checked. |
| isIndeterminate | `boolean` | Readonly: whether some but not all visible, enabled options are checked. |
| toggleAll | `(checked?: boolean) => void` | Check or clear eligible options, toggling when omitted. Preserves hidden/disabled values and honors min/max. |
