# Popselect

If you want select some options but don't want a picker, you can use popselect instead.

## Demos

```demo
basic.vue
size.vue
scrollable.vue
multiple.vue
slot.vue
```

## API

### Popselect Props

| Name | Type | Default | Description | Version |
| --- | --- | --- | --- | --- |
| show-value-in-title | `boolean` | `false` | 是否在原生 title 提示中同时展示 value 和「label」，开启后格式为 `value「label」`；不改变控件内显示的标签 |  |
| multiple | `boolean` | `false` | Whether to select multiple values. |  |
| node-props | `(option: SelectOption \| SelectGroupOption) => object` | `undefined` | Option's DOM attrs generator. | 2.30.4 |
| options | `Array<SelectOption \| SelectGroupOption>` | `[]` | For details of configuration options, see [Select](select#SelectOption-Properties) |  |
| render-label | `(option: SelectOption \| SelectGroupOption) => VNodeChild` | `undefined` | Render function of all the options. |  |
| scrollable | `boolean` | `false` | Whether the select menu is scrollable. |  |
| scrollbar-props | `ScrollbarProps` | `undefined` | See [Scrollbar props](scrollbar#Scrollbar-Props) | 2.44.0 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the Popselect. |  |
| value | `string \| number \| Array<string \| number> \| null` | `null` | Value in controlled mode. |  |
| virtual-scroll | `boolean` | `false` | Whether to enable virtual scrolling. | 2.30.4 |
| on-update:value | `(value: string \| number \| Array<string \| number> \| null, option: SelectBaseOption \| null \| Array<SelectBaseOption>) => void` | `undefined` | Callback of value updating. |  |

For SelectOption & SelectGroupOption, see [Select](select#SelectOption-Properties)

For other props, see [Popover](popover#Popover-Props)

### Popselect Slots

| Name   | Parameters | Description                            | Version |
| ------ | ---------- | -------------------------------------- | ------- |
| header | `()`       | Header menu slot.                      | 2.36.0  |
| action | `()`       | Options menu slot.                     | 2.22.0  |
| empty  | `()`       | Empty state slot for the options menu. | 2.22.0  |

### 完整内容提示

悬停控件可通过浏览器原生 `title` 查看完整已选标签，无需展开菜单。多选提示包含折叠隐藏的所有已选项，每项独占一行。设置 `show-value-in-title` 后，提示显示为 `value「label」`。该属性不改变绑定值、筛选内容或控件内显示的标签。清空后移除自动提示；显式设置的 `title` 优先。
