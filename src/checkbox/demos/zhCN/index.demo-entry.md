# 复选框 Checkbox

哟，哟，Check it out。

## 演示

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
rtl-debug.vue
```

## API

### Checkbox Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | 受控状态下是否选中 |
| checked-value | `string \| boolean \| number` | `true` | 选中时对应的值 |
| default-checked | `boolean` | `false` | 非受控模式下默认是否选中 |
| disabled | `boolean` | `false` | 是否禁用 |
| focusable | `boolean` | `true` | 是否可被 focus |
| indeterminate | `boolean` | `false` | 是否部分选中 |
| label | `string` | `undefined` | Checkbox 的标签 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 组件尺寸 |
| unchecked-value | `string \| boolean \| number` | `false` | 未选中时对应的值 |
| value | `string \| number` | `undefined` | Checkbox 在 checkbox group 中使用的值 |
| on-update:checked | `(checked: boolean) => void` | `undefined` | 当 checked 改变时触发的回调函数 |
| readonly | `boolean` | `undefined` | 只读状态，与表单 readonly 合并；禁用始终优先。 [使用案例](#group-state.vue) |
| ignore-parent-readonly | `boolean` | `false` | 不继承表单的 readonly；不解除组件自身只读或任何禁用状态。 [使用案例](#group-state.vue) |
| hide-circle | `boolean` | `false` | 隐藏勾选指示器，保留选中状态、标签和键盘交互。 [使用案例](#group-state.vue) |
| cancel-disabled | `boolean` | `false` | 调整禁用且已选标签的颜色；不解除禁用，也不允许修改选中状态。 [使用案例](#group-state.vue) |

### CheckboxGroup Props

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| disabled | `boolean` | `false` | 选项组是否禁用 |  |
| default-value | `Array<string \| number>` | `null` | 选项组非受控模式下的默认值 |  |
| label-field | `string` | `'label'` | `options` 中选项标签的字段名 | 2.45.0 |
| max | `number` | `undefined` | 可被勾选的 checkbox 的最大数量 |  |
| min | `number` | `undefined` | 可被勾选的 checkbox 的最小数量 |  |
| options | `Array<{ label?: string, value: string \| number, disabled?: boolean }>` | `undefined` | 配置选项内容，设置后默认插槽不生效 | 2.45.0 |
| value | `Array<string \| number> \| null` | `undefined` | 选项组受控模式下的值 |  |
| value-field | `string` | `'value'` | `options` 中选项值的字段名 | 2.45.0 |
| on-update:value | `(value: (string \| number)[], meta: { actionType: 'check' \| 'uncheck', value: string \| number }) => void` | `undefined` | 选项组的值改变时的回调 | `meta` 2.32.0 |
| readonly | `boolean` | `undefined` | 只读状态，与表单 readonly 合并；禁用始终优先。 [使用案例](#group-state.vue) |  |
| ignore-parent-readonly | `boolean` | `false` | 不继承表单的 readonly；不解除组件自身只读或任何禁用状态。 [使用案例](#group-state.vue) |  |

### Checkbox Slots

| 名称    | 参数 | 说明                |
| ------- | ---- | ------------------- |
| default | `()` | Checkbox 的标签内容 |

### CheckboxGroup Slots

| 名称    | 参数 | 说明                 |
| ------- | ---- | -------------------- |
| default | `()` | CheckboxGroup 的内容 |

### Checkbox Methods

| 名称  | 类型         | 说明 | 版本   |
| ----- | ------------ | ---- | ------ |
| focus | `() => void` | 聚焦 | 2.24.2 |
| blur  | `() => void` | 失焦 | 2.24.2 |

### CheckboxGroup Methods

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| inputElement | `HTMLElement \| null` | 当前复选框组入口元素。 |
| allChecked | `boolean` | 只读；所有可见、未禁用选项是否全部选中。 |
| isIndeterminate | `boolean` | 只读；可见、未禁用选项是否部分选中。 |
| toggleAll | `(checked?: boolean) => void` | 全选或清空可选项，省略参数时切换；保留隐藏/禁用选项的值并遵守 min/max。 |
