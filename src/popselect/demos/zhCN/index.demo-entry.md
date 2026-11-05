# 弹出选择 Popselect

如果你想选择一些数据，还不想看到那个框子，可以使用 Popselect。

## 演示

```demo
basic.vue
size.vue
scrollable.vue
multiple.vue
slot.vue
```

## API

### Popselect Props

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| show-value-in-title | `boolean` | `false` | 是否在原生 title 提示中同时展示 value 和「label」，开启后格式为 `value「label」`；不改变控件内显示的标签 |  |
| multiple | `boolean` | `false` | 是否为多选 |  |
| node-props | `(option: SelectOption \| SelectGroupOption) => object` | `undefined` | 选项的 DOM 属性生成函数 | 2.30.4 |
| options | `Array<SelectOption \| SelectGroupOption>` | `[]` | 配置选项内容，详情参考 [Select](select#SelectOption-Properties) |  |
| scrollable | `boolean` | `false` | 选择菜单是否可滚动 |  |
| scrollbar-props | `ScrollbarProps` | `undefined` | 属性参考 [Scrollbar props](scrollbar#Scrollbar-Props) | 2.44.0 |
| render-label | `(option: SelectOption \| SelectGroupOption) => VNodeChild` | `undefined` | 控制全部选项的渲染 |  |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 组件尺寸 |  |
| value | `string \| number \| Array<string \| number> \| null` | `null` | 受控模式下的值 |  |
| virtual-scroll | `boolean` | `false` | 是否启用虚拟滚动 | 2.30.4 |
| on-update:value | `(value: string \| number \| Array<string \| number> \| null, option: SelectBaseOption \| null \| Array<SelectBaseOption>) => void` | `undefined` | 值更新的回调 |  |

对于 SelectOption & SelectGroupOption，参考 [Select](select#SelectOption-Properties)

对于其他 props，参考 [Popover](popover#Popover-Props)

### Popselect Slots

| 名称   | 参数 | 说明                | 版本   |
| ------ | ---- | ------------------- | ------ |
| header | `()` | 菜单头部区域的 slot | 2.36.0 |
| action | `()` | 菜单操作区域的 slot | 2.22.0 |
| empty  | `()` | 菜单无数据时的 slot | 2.22.0 |

### 完整内容提示

悬停控件可通过浏览器原生 `title` 查看完整已选标签，无需展开菜单。多选提示包含折叠隐藏的所有已选项，每项独占一行。设置 `show-value-in-title` 后，提示显示为 `value「label」`。该属性不改变绑定值、筛选内容或控件内显示的标签。清空后移除自动提示；显式设置的 `title` 优先。
