# Select

Select something!

## Demo

```demo
search-model.vue
basic.vue
primitive-options.vue
size.vue
multiple.vue
events.vue
filterable.vue
tag.vue
menu-width.vue
remote.vue
remote-multiple.vue
clearable.vue
scroll-event.vue
group.vue
many-options.vue
custom-option.vue
custom-suffix.vue
action.vue
fallback-option.vue
max-tag-count.vue
add-tooltip.vue
render-tag.vue
focus.vue
render-person.vue
tag-input.vue
custom-field.vue
```

## API

### Select Props

| Name | Type | Default | Description | Version |
| --- | --- | --- | --- | --- |
| consistent-menu-width | `boolean` | `true` | Whether the menu keeps its width the same as the select trigger element. Setting it to `false` will also disable `virtual-scroll`. |  |
| children-field | `string` | `'children'` | Field name of group option children. | 2.29.1 |
| clearable | `boolean` | `false` | Whether the value is clearable. |  |
| clear-created-options-on-clear | `boolean` | `true` | When `tag` and `clearable` are enabled, whether to clear created options when clearing. | 2.44.0 |
| clear-filter-after-select | `boolean` | `true` | When multiple and filter is true, whether to clear filter keyword after select an option. | 2.25.2 |
| default-value | `Array<string \| number> \| string \| number \| null` | `null` | Default value. |  |
| disabled | `boolean` | `false` | Whether to disable the select. |  |
| ellipsis-tag-popover-props | `PopoverProps` | `undefined` | `popover` props of the preview ellipsis tag. | 2.37.0 |
| fallback-option | `false \| (value: string \| number) => SelectOption` | `value => ({ label: '' + value, value })` | The option to be created using the value which has no corresponding option value. If set to `false`, the fallback option won't be created and displayed. |  |
| filterable | `boolean` | `false` | Whether options can be filtered. |  |
| filter | `(pattern: string, option: Object) => boolean` | String search method. | Filter function. |  |
| ignore-composition | `boolean` | `true` | Ingore IME's composition status. By default `filter` won't be triggered by input event under compositions. | 2.33.4 |
| input-props | `InputHTMLAttributes` | `undefined` | The attributes of input element in the trigger. It only works when the select is filterable. |  |
| keyboard | `boolean` | `true` | Whether to allow keyboard control. | 2.34.4 |
| label-field | `string` | `'label'` | Field name of option label. | 2.29.1 |
| loading | `boolean` | `false` | Whether to show a loading state. |  |
| max-tag-count | `number \| 'responsive'` | `undefined` | Maximum selected values to display while in `multiple` mode. `responsive` will keep all the tags in single line. |  |
| menu-props | `HTMLAttributes` | `undefined` | The menu's dom props. |  |
| menu-size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Size of select menu. | 2.40.0 |
| multiple | `boolean` | `false` | Whether to allow selecting multiple values. |  |
| node-props | `(option: SelectOption \| SelectGroupOption) => object` | `undefined` | Option's DOM attrs generator. | 2.32.2 |
| options | `Array<SelectOption \| SelectGroupOption> \| string[] \| number[]` | `[]` | Selectable options. String and number arrays become options with matching labels and values, deduplicated in first-occurrence order. Numeric values remain numbers. See SelectOption Properties for object options. |  |
| placeholder | `string` | `'Please Select' (i18n)` | Placeholder. |  |
| placement | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'bottom-start'` | Option menu's placement. | 2.25.0 |
| remote | `boolean` | `false` | Allows options to be fetched asynchronously. Note that if `remote` is set, `filter` & `tag` won't work on `options`. |  |
| render-label | `(option: SelectOption \| SelectGroupOption, selected: boolean) => VNodeChild` | `undefined` | Render function for each option label. |  |
| render-option | `(info: { node: VNode, option: SelectOption \| SelectGroupOption, selected: boolean }) => VNodeChild` | `undefined` | Render function for each option. |  |
| render-tag | `(props: { option: SelectBaseOption, handleClose: () => void }) => VNodeChild` | `undefined` | Render function for each option tag. |  |
| reset-menu-on-options-change | `boolean` | `true` | Whether to reset menu staus on options change, for example, scroll status. | 2.24.2 |
| scrollbar-props | `ScrollbarProps` | `undefined` | See [Scrollbar props](scrollbar#Scrollbar-Props) | 2.44.0 |
| show | `boolean` | `undefined` | Whether to show/open the option menu. |  |
| show-arrow | `boolean` | `true` | Whether to show the dropdown arrow. |  |
| show-checkmark | `boolean` | `true` | Whether to show checkmark. | 2.33.4 |
| show-on-focus | `boolean` | `false` | Whether to show menu on focus. | 2.34.3 |
| size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Size of the select input. |  |
| status | `'success' \| 'warning' \| 'error'` | `undefined` | Validation status. | 2.27.0 |
| tag | `boolean` | `false` | Whether users can create new options. This should be used with `filterable`. |  |
| to | `string \| HTMLElement \| false` | `body` | Container node of the menu. `false` will keep it not detached. |  |
| value | `Array<string \| number> \| string \| number \| null` | `undefined` | Value when being manually set. |  |
| value-field | `string` | `'value'` | Field name of option value. | 2.29.1 |
| virtual-scroll | `boolean` | `true` | Whether to enable virtual scrolling. |  |
| on-blur | `() => void` | `undefined` | Callback triggered when the selection element is blurred. |  |
| on-clear | `() => void` | `undefined` | Callback triggered when the selection element is cleared. |  |
| on-create | `(label: string) => SelectOption` | `label => ({ label, value: label })` | How to create an option when you type in a custom option. Note that `filter` will be applied to the created option too. And you'd better make sure that the value of the created option is not the same as any other option. Should be used with `tag` prop. |  |
| on-focus | `() => void` | `undefined` | Callback triggered when the selection element is focussed on. |  |
| on-scroll | `(e: ScrollEvent) => void` | `undefined` | Callback triggered when the options menu is scrolled. |  |
| on-search | `(value: string) => void` | `undefined` | Callback triggered when a search is conducted. |  |
| on-update:show | `(show: boolean) => void` | `undefined` | Callback on menu open status change. | 2.24.2 |
| on-update:value | `(value: Array \| string \| number \| null, option: SelectBaseOption \| null \| SelectBaseOption[]) => void` | `undefined` | Callback triggered when the selected value is updated. |  |
| readonly | `boolean` | `undefined` | Readonly state, combined with the parent form readonly state. Disabled always takes precedence. [Example](#search-model.vue) |  |
| ignore-parent-readonly | `boolean` | `false` | Ignore the parent form readonly state without overriding local readonly or disabled states. [Example](#search-model.vue) |  |
| hide-placeholder | `boolean` | `undefined` | Hide placeholder text. Inherits the form setting when omitted; explicit false overrides the inherited setting. [Example](#search-model.vue) |  |
| ignore-parent-hide-placeholder | `string \| string[]` | `undefined` | Pass `'form'` or an array containing `'form'` to ignore the form hide-placeholder setting. [Example](#search-model.vue) |  |
| filter-value | `string` | `undefined` | Controlled search text. Managed internally when omitted. Supports v-model:filter-value. [Example](#search-model.vue) |  |
| filter-keys | `string[]` | `undefined` | Additional fields searched together with label-field. Uses the existing filter when omitted. [Example](#search-model.vue) |  |
| on-update:filter-value | `(value: string) => void` | `undefined` | Called with the new search text when it changes. [Example](#search-model.vue) |  |
| on-update-filter-value | `(value: string) => void` | `undefined` | Camel-case prop alias of on-update:filter-value. Both callbacks run if both are supplied. [Example](#search-model.vue) |  |
| on-query-change | `(value: string) => void` | `undefined` | Additional search-text change notification. Does not replace existing search events. [Example](#search-model.vue) |  |
| separator | `string` | `undefined` | Allow a delimited string model in multiple mode. Keeps array models when omitted; label notifications use the same delimiter for string models. [Example](#search-model.vue) |  |
| remote-show-on-input | `boolean` | `false` | In remote mode, show the menu only after entering search text; hide it for an empty query. [Example](#search-model.vue) |  |
| on-update:label | `(value: string \| string[]) => void` | `undefined` | Emit selected labels when selection changes: a string for single selection, an array for multiple selection, or a delimited string for a separator string model. [Example](#search-model.vue) |  |
| on-update-label | `(value: string \| string[]) => void` | `undefined` | Camel-case prop alias of on-update:label. [Example](#search-model.vue) |  |

#### SelectOption Properties

| Name | Type | Description |
| --- | --- | --- |
| class | `string` | Customize the option's class. |
| disabled | `boolean` | Whether to disable the option. |
| label | `string \| ((option: SelectOption, selected: boolean) => VNodeChild)` | Label of the option. Note that if you are using the `render` function, the default filter will filter the option. |
| render | `(info: { node: VNode, option: SelectOption, selected: boolean }) => VNodeChild` | Render the entire option. |
| style | `string \| CSSProperties` | Customize the option's style. |
| value | `string \| number` | Should be unique for each option. |

#### SelectGroupOption Properties

| Name | Type | Description |
| --- | --- | --- |
| children | `Array<SelectOption>` | Child select options. |
| label | `string \| ((option: SelectGroupOption) => VNodeChild)` | Label of the group. |
| key | `string \| number` | Should be unique for each option. |
| render | `(info: { node: VNode, option: SelectOption, selected: boolean }) => VNodeChild` | Render the entire option. |
| type | `'group'` | Type of the group option. |

### Select Slots

| Name   | Parameters | Description                            | Version |
| ------ | ---------- | -------------------------------------- | ------- |
| header | `()`       | Header menu slot.                      | 2.37.0  |
| action | `()`       | Options menu slot.                     |         |
| empty  | `()`       | Empty state slot for the options menu. |         |
| arrow  | `()`       | Arrow icon slot.                       | 2.24.2  |

### Select Methods

| Name | Type | Description | Version |
| --- | --- | --- | --- |
| focus | `() => void` | Focus. | 2.24.2 |
| focusInput | `() => void` | Input focus. | 2.35.0 |
| blur | `() => void` | Blur. | 2.24.2 |
| blurInput | `() => void` | Input blur. | 2.35.0 |
| inputElement | `HTMLElement \| null` | Current input element. A registrar provided through inputElementRegistrationKey registers it automatically and cleans up on unmount/deactivation. |  |

### Object model adapter

`createOptionModelAdapter(() => ({ options, valueKey, valueField, labelField, multiple }))` converts business objects to native values: pass `decode(model)` as value and write `encode(value)` back to the business model. `labels(value)` returns labels; `defaults(field)` selects visible, enabled defaults by marker. This is an exported helper, not Select props.
