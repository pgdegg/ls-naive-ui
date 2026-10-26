# 数字输入 Input Number

输入数字就用它。

## 演示

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
debug.vue
rtl-debug.vue
theme-debug.vue
precision-debug.vue
```

## API

### InputNumber Props

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| autofocus | `boolean` | `false` | 是否自动获取焦点 | 2.26.1 |
| bordered | `boolean` | `true` | 是否有边框 |  |
| button-placement | `'right' \| 'both' \| 'right-vertical'` | `'right'` | 按钮位置：right 为右侧横排，both 为两侧，right-vertical 为右侧上下箭头（上增下减），支持长按、键盘、范围限制及图标插槽。 [使用案例](#precision.vue) |  |
| clearable | `boolean` | `false` | 是否可清空 |  |
| default-value | `number \| null` | `null` | 非受控模式下的默认值 |  |
| disabled | `boolean` | `false` | 是否禁用 |  |
| format | `(value: number \| null) => string` | `undefined` | 格式化值的方法，设定后会禁用 `update-value-on-input` | 2.30.0 |
| input-props | `InputHTMLAttributes` | `undefined` | 组件内部 input 元素的属性，[在这里查看原生属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)。注意：`input-props` 不会覆盖内部 input 元素的已经存在的属性（除了 `type`） | 2.37.0 |
| keyboard | `{ ArrowUp?: boolean, ArrowDown?: boolean }` | `{}` | 控制允许的键盘操作，属性值设为 `false` 的时候会禁用对应的键盘操作 |
| loading | `boolean` | `undefined` | 是否展示加载图标，设为非 `undefined` 会占据空间 |  |
| max | `number` | `undefined` | 最大值 |  |
| min | `number` | `undefined` | 最小值 |  |
| parse | `(input: string) => number \| null` | `undefined` | 解析输入的字符串，设定后会禁用 `update-value-on-input` | 2.30.0 |
| placeholder | `string` | `'请输入'` | 提示信息 |  |
| precision | `number` | `undefined` | 数值保留的精度值，设定后会禁用 `update-value-on-input` | 2.30.0 |
| readonly | `boolean` | `false` | 只读状态，与表单 readonly 合并；禁用始终优先。 [使用案例](#precision.vue) |  |
| round | `boolean` | `undefined` | 输入框是否圆角 | 2.39.0 |
| show-button | `boolean` | `true` | 是否有按钮 |  |
| size | `'tiny' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 输入框大小 |  |
| status | `'success' \| 'warning' \| 'error'` | `undefined` | 验证状态 | 2.27.0 |
| step | `number` | `1` | 每次改变步数，可以为小数 |  |
| update-value-on-input | `boolean` | `true` | 在输入的过程中，在输入值合法的情况下，是否改变值 |  |
| validator | `(value) => boolean` | `undefined` | 设置自定义验证 |  |
| value | `number \| null` | `undefined` | 受控模式下的值 |  |
| on-blur | `(event: FocusEvent) => void` | `undefined` | 移除焦点的回调 |  |
| on-clear | `() => void` | `undefined` | 点击清空按钮时的回调 |  |
| on-focus | `(event: FocusEvent) => void` | `undefined` | 获取焦点的回调 |  |
| on-update:value | `(value: number \| null) => void` | `undefined` | 组件值发生变化的回调 |  |
| ignore-parent-readonly | `boolean` | `false` | 不继承表单的 readonly；不解除组件自身只读或任何禁用状态。 [使用案例](#precision.vue) |  |
| hide-placeholder | `boolean` | `undefined` | 隐藏提示文字；未指定时继承表单配置，显式 false 可覆盖表单隐藏设置。 [使用案例](#precision.vue) |  |
| ignore-parent-hide-placeholder | `string \| string[]` | `undefined` | 传入 `'form'` 或包含 `'form'` 的数组时，不继承表单的 hide-placeholder。 [使用案例](#precision.vue) |  |
| max-precision | `number` | `undefined` | 最大小数位数；超出时四舍五入，不补零。不替代 precision 的固定精度语义。 [使用案例](#precision.vue) |  |
| on-precision-exceed | `(value: number, precision: number) => void` | `undefined` | 超出 max-precision 且实际发生舍入时触发；参数为舍入前数值和上限位数。 [使用案例](#precision.vue) |  |

### InputNumber Slots

| 名称       | 参数 | 说明                                         | 版本   |
| ---------- | ---- | -------------------------------------------- | ------ |
| add-icon   | `()` | 增加按钮的图标                               | 2.28.1 |
| minus-icon | `()` | 减少按钮的图标                               | 2.28.1 |
| prefix     | `()` | 输入框头部内容插槽                           |        |
| suffix     | `()` | 输入框尾部内容插槽                           |        |
| prepend    | `()` | 输入框外部前置附加内容，与内部 prefix 分开。 |        |
| append     | `()` | 输入框外部后置附加内容，与内部 suffix 分开。 |        |

### InputNumber Methods

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| blur | `() => void` | 失焦输入 |
| focus | `() => void` | 聚焦输入 |
| inputElement | `HTMLElement \| null` | 当前可用输入元素；通过 inputElementRegistrationKey 提供注册器可自动注册并在卸载或停用时清理。 |
