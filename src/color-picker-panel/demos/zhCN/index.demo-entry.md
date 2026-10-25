# 颜色选择面板 ColorPickerPanel

直接嵌入页面的颜色编辑器，类似 Element Plus 的 ColorPickerPanel。与 [ColorPicker](color-picker) 共享调色盘、色相、透明度、颜色输入和预设色板，不需要触发器或弹层。

## 演示

```demo
basic.vue
modes.vue
actions.vue
```

## API

### ColorPickerPanel Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | `string \| null` | `undefined` | 受控颜色值；null 表示清空 |
| default-value | `string \| null` | 根据 modes / show-alpha 生成 | 非受控初始值，与 ColorPicker 一致 |
| modes | `Array<'rgb' \| 'hex' \| 'hsl' \| 'hsv'>` | `['rgb', 'hex', 'hsl']` | 可切换的颜色模式，至少提供一种 |
| show-alpha | `boolean` | `true` | 显示透明度滑块及透明度输入 |
| show-preview | `boolean` | `false` | 显示颜色预览控件 |
| swatches | `string[]` | `undefined` | 预设颜色，选择后按当前模式输出 |
| actions | `Array<'confirm' \| 'clear'>` | `null` | 内置操作按钮；操作后面板保持显示 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 继承表单大小，控制内部输入尺寸 |
| disabled | `boolean` | `undefined` | 禁用面板；继承表单或容器禁用 |
| readonly | `boolean` | `undefined` | 保留颜色展示并阻止编辑，继承表单 readonly |
| ignore-parent-readonly | `boolean` | `false` | 跳过表单只读，不跳过禁用 |
| on-update:value / on-update-value | `(value: string \| null) => void` | `undefined` | 实时更新颜色，支持 v-model:value |
| on-complete | `(value: string) => void` | `undefined` | 一次编辑结束时触发；与 ColorPicker 一致，预设色板仅触发值更新 |
| on-confirm | `(value: string \| null) => void` | `undefined` | 点击确认时触发，不关闭或隐藏面板 |
| on-clear | `() => void` | `undefined` | 清空后触发，同时更新 value 为 null |
| theme / theme-overrides / builtin-theme-overrides | 与 ColorPicker 一致 | `undefined` | 共享 ColorPicker 主题变量 |

### ColorPickerPanel Slots

| 名称   | 参数 | 说明                                                |
| ------ | ---- | --------------------------------------------------- |
| action | `()` | 附加操作区域；可以将 actions 留空，仅使用自定义操作 |

### ColorPickerPanel Inst

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| inputElement | `HTMLElement \| null` | 当前可用输入元素，可通过 inputElementRegistrationKey 自动注册到容器 |

### 使用说明

按需导入 `NColorPickerPanel`、`colorPickerPanelProps` 和类型 `ColorPickerPanelProps`、`ColorPickerPanelSlots`、`ColorPickerPanelInst`；默认插件也会注册该组件。主题沿用 `NConfigProvider` 的 `theme-overrides.ColorPicker`，支持暗色、自定义类名前缀和禁用上下文。

面板使用 Naive UI 的字符串颜色模型；不会接受 Element Plus 的 model-value。`show`、`default-show`、`placement`、`to`、`render-label` 和显示事件属于弹出式 ColorPicker，不是本组件的属性。通过外层 v-if / v-show 控制是否显示，通过 style.width 调整面板宽度。
