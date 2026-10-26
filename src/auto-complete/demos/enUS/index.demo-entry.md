# AutoComplete

Offer a search hint or maybe guess some likely options?

## Demos

```demo
suggestions.vue
basic.vue
size.vue
group.vue
custom-input.vue
after-select.vue
show-options-by-value.vue
customized-rendering.vue
status.vue
append.vue
```

## API

### AutoComplete Props

| Name | Type | Default | Description | Version |
| --- | --- | --- | --- | --- |
| append | `boolean` | `false` | Whether to append content to input. | 2.38.0 |
| blur-after-select | `boolean` | `false` | Whether to blur after selection. |  |
| clear-after-select | `boolean` | `false` | Whether to clear after selection. |  |
| clearable | `boolean` | `false` | Whether autocomplete is clearable. |  |
| default-value | `string` | `null` | Default value of autocomplete. |  |
| disabled | `boolean` | `false` | Whether the autocomplete is disabled. |  |
| get-show | `(value: string) => boolean` | `undefined` | Use the input to determine whether to show options on focus. |  |
| input-props | `InputHTMLAttributes` | `undefined` | The attributes of input element in autocomplete. |  |
| loading | `boolean` | `false` | Whether to show a loading status. |  |
| menu-props | `HTMLAttributes` | `undefined` | The menu's dom props. | 2.32.2 |
| options | `Array<string \| AutoCompleteOption \| AutoCompleteGroupOption>` | `[]` | Options to autocomplete from. |  |
| placeholder | `string` | `'Please Input'` | Autocomplete's placeholder. |  |
| placement | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'bottom-start'` | Autocomplete's placement. | 2.25.0 |
| render-label | `(option: SelectOption \| SelectGroupOption, selected: boolean) => VNodeChild` | `undefined` | Render function for each option label. | 2.24.0 |
| render-option | `(info: { node: VNode, option: SelectOption \| SelectGroupOption, selected: boolean }) => VNodeChild` | `undefined` | Render function for each option. | 2.24.0 |
| scrollbar-props | `ScrollbarProps` | `undefined` | See [Scrollbar props](scrollbar#Scrollbar-Props) | 2.44.0 |
| show-empty | `boolean` | `false` | Whether to show menu if there's no option. | 2.37.1 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Autocomplete size. |  |
| status | `'success' \| 'warning' \| 'error'` | `undefined` | Validation status. | 2.27.0 |
| to | `string \| HTMLElement \| false` | `body` | Container node of the menu. `false` will keep it not detached. |  |
| value | `string` | `undefined` | Input of autocomplete. |  |
| on-blur | `(event: FocusEvent) => void` | `undefined` | On blur callback function. |  |
| on-focus | `(event: FocusEvent) => void` | `undefined` | On focus callback function. |  |
| on-select | `(value: string) => void` | `undefined` | On select callback function. |  |
| on-update:value | `(value: string \| null) => void` | `undefined` | On update callback function. |  |
| readonly | `boolean` | `undefined` | Readonly state, combined with the parent form readonly state. Disabled always takes precedence. [Example](#suggestions.vue) |  |
| ignore-parent-readonly | `boolean` | `false` | Ignore the parent form readonly state without overriding local readonly or disabled states. [Example](#suggestions.vue) |  |
| hide-placeholder | `boolean` | `undefined` | Hide placeholder text. Inherits the form setting when omitted; explicit false overrides the inherited setting. [Example](#suggestions.vue) |  |
| ignore-parent-hide-placeholder | `string \| string[]` | `undefined` | Pass `'form'` or an array containing `'form'` to ignore the form hide-placeholder setting. [Example](#suggestions.vue) |  |
| fetch-suggestions | `(query: string, callback: (options: AutoCompleteOptions) => void) => void \| AutoCompleteOptions \| Promise<void \| AutoCompleteOptions>` | `undefined` | Fetch suggestions through the callback or an array/Promise return value. Stale responses are ignored. Uses options when omitted. [Example](#suggestions.vue) |  |
| debounce | `number` | `300` | Debounce interval in milliseconds for fetch-suggestions. [Example](#suggestions.vue) |  |
| trigger-on-focus | `boolean` | `true` | Request suggestions with the current text on focus when fetch-suggestions is configured. [Example](#suggestions.vue) |  |
| offset | `number` | `undefined` | Vertical gap between the input and suggestions in pixels. Keeps the existing positioning gap when omitted. [Example](#suggestions.vue) |  |

#### AutoCompleteOption Properties

| Name     | Type      | Description                     |
| -------- | --------- | ------------------------------- |
| disabled | `boolean` | Whether the option is disabled. |
| label    | `string`  | Option label value.             |
| value    | `string`  | Option ID (should be unique).   |

#### AutoCompleteGroupOption Properties

| Name     | Type                                  | Description             |
| -------- | ------------------------------------- | ----------------------- |
| children | `Array<string \| AutoCompleteOption>` | Group children options. |
| label    | `string`                              | Group label.            |
| key      | `string \| number`                    | Unique group key.       |
| type     | `'group'`                             | Required group type.    |

### AutoComplete Slots

| Name | Parameters | Description | Version |
| --- | --- | --- | --- |
| default | `(options: { handleInput: (value: string) => void, handleFocus: function, handleBlur: function, value: string, theme: string \| null })` | Custom input elements, supplied by the user. |  |
| empty | `()` | Menu's content to show when there's no option. | 2.37.1 |
| prefix | `()` | Input's prefix content. |  |
| suffix | `()` | Input's suffix content. |  |

### AutoComplete Methods

| Name | Type | Description | Version |
| --- | --- | --- | --- |
| blur | `() => void` | Blur the input element. | 2.26.2 |
| focus | `() => void` | Focus the input element. | 2.26.2 |
| inputElement | `HTMLElement \| null` | Current input element. A registrar provided through inputElementRegistrationKey registers it automatically and cleans up on unmount/deactivation. |  |
| loading | `boolean` | Readonly loading state of asynchronous suggestion requests. |  |
