# 标签页 Tabs

在同一块区域切换内容。

<n-alert type="warning" title="注意" :bordered="false">
  <n-text code>n-tabs</n-text> 默认情况下会从 slot 获取默认展示的 tab 值，因此会产生一个 vue slot 的 warning。如果你不想看到这个 warning，请设定一个 <n-text code>default-value</n-text>。
</n-alert>

## 演示

```demo
card-group.vue
border-card.vue
basic.vue
icon.vue
segment.vue
card.vue
flex-label.vue
prefix.vue
size.vue
display-directive.vue
addable.vue
before-leave.vue
no-pane.vue
update-bar-manually.vue
bar-width.vue
trigger.vue
placement.vue
line-debug.vue
style-inherit-debug.vue
shadow-debug.vue
unkeyed-debug.vue
addable-debug.vue
suffix-width-debug.vue
animation-debug.vue
animationx-debug.vue
none-debug.vue
modal-debug.vue
show-scroll-button.vue
center-active-tab.vue
rtl-debug.vue
```

## API

### Tabs Props

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| addable | `boolean \| { disabled?: boolean }` | `false` | 是否允许添加标签，只在标签的 `type` 为 `card`、`card-group` 或 `border-card` 时生效 |  |
| add-tab-class | `string` | `undefined` | 添加标签标签的类名 | 2.37.0 |
| add-tab-style | `string \| object` | `undefined` | 添加标签标签的样式 | 2.37.0 |
| animated | `boolean` | `false` | 标签页切换是否使用动画，当 `placement` 为 `'left'`、`'right'`、`'start'` 或 `'end'` 时不生效 | 2.27.0 |
| bar-width | `number` | `undefined` | 标签条的宽度 | 2.25.0 |
| center-active-tab | `boolean` | `false` | 设置为 `true` 时，活动标签将滚动到滚动容器的中心位置 | 2.45.0 |
| closable | `boolean` | `false` | 是否允许关闭标签，只在标签的 `type` 为 `card`、`card-group` 或 `border-card` 时生效 |  |
| default-value | `string \| number` | `undefined` | 非受控模式下的默认值 |  |
| justify-content | `'space-between' \| 'space-around' \| 'space-evenly' \| 'start' \| 'center' \| 'end'` | `undefined` | `flex` 布局下主轴的排列方式，只对 `'line'` 和 `'bar'` 类型生效 | `space-*` 2.29.1 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 标签页的尺寸 |  |
| pane-class | `string` | `undefined` | 面板的类名 |  |
| pane-style | `string \| object` | `undefined` | 面板的样式 |  |
| pane-wrapper-class | `string` | `undefined` | 面板容器的类名 | 2.34.4 |
| pane-wrapper-style | `string \| object` | `undefined` | 面板容器的样式 | 2.34.4 |
| placement | `'left' \| 'right' \| 'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | 标签的位置，`'start'` / `'end'` 会随 RTL 映射到 `'left'` / `'right'`，对于 `'segment'` 类型的 `n-tabs` 不生效 | 2.34.4、`start` `end` 2.45.0 |
| show-scroll-button | `boolean` | `false` | 是否显示滚动按钮 | 2.45.0 |
| tab-class | `string` | `undefined` | 标签的类名 | 2.37.0 |
| tab-style | `string \| object` | `undefined` | 标签的样式 |  |
| tabs-padding | `number` | `0` | 全部标签起止方向的 `padding` |  |
| trigger | `'click' \| 'hover'` | `'click'` | 触发 tab 的方式 | 2.27.0 |
| type | `'bar' \| 'line' \| 'card' \| 'segment' \| 'border-card' \| 'card-group'` | `'bar'` | 标签类型；card 为独立卡片，card-group 为连体标签组，border-card 为整体带边框的面板。[使用案例](#card-group.vue) |  |
| value | `string \| number` | `undefined` | 受控模式下的值 |  |
| on-add | `() => void` | `undefined` | 添加标签的回调函数 |  |
| on-before-leave | `(name: string \| number, oldName: string \| number \| null) => boolean \| Promise<boolean>` | `undefined` | 切换标签之前的钩子函数，返回 `false` 或 promise resolve `false` 或 promise reject 会阻止切换 |  |
| on-close | `(name: string \| number) => void` | `undefined` | 关闭标签的回调函数 |  |
| on-update:value | `(value: string \| number) => void` | `undefined` | 选中发生改变时的回调函数 |  |
| left-type | `'bar' \| 'line' \| 'card' \| 'segment' \| 'border-card' \| 'card-group'` | `undefined` | 左侧固定标签组的类型，省略时继承 type。 [使用案例](#border-card.vue) |  |
| right-type | `'bar' \| 'line' \| 'card' \| 'segment' \| 'border-card' \| 'card-group'` | `undefined` | 右侧固定标签组的类型，省略时继承 type。 [使用案例](#border-card.vue) |  |
| close-button-display | `'hover' \| 'always'` | `'hover'` | 可关闭标签的按钮显示方式，默认移入标签时展开；always 常驻。单个 TabPane/Tab 可覆盖。 键盘聚焦时也显示，无悬停能力设备保持可访问。 [使用案例](#card-group.vue) |  |

### TabPane Props

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| closable | `boolean` | `false` | 是否允许关闭标签，只在标签的 `type` 为 `card`、`card-group` 或 `border-card` 时生效 |  |
| disabled | `boolean` | `false` | 是否禁用 |  |
| display-directive | `'if' \| 'show' \| 'show:lazy'` | `'if'` | 选择性渲染使用的指令，`if` 对应 `v-if`，`show` 对应 `v-show`，使用 `show` 的时候标签页状态切换后不会被重置，使用 `show:lazy` 的时候显示效果跟 `show` 一致，不过内容会进行延迟加载 |  |
| name | `string \| number` | `undefined` | 必填，标签的名称 |  |
| tab | `string \| VNode \| () => VNodeChild` | `undefined` | 标签的 `tab` |  |
| tab-props | `Object` | `undefined` | 标签 `tab` 的 DOM 属性 | 2.24.2 |
| icon | `string \| VNode \| (() => VNodeChild)` | `undefined` | 标签图标；字符串作为 NIcon symbol，VNode/函数直接渲染，icon 插槽优先。 [使用案例](#border-card.vue) |  |
| fixed | `'left' \| 'right'` | `undefined` | 固定于左侧或右侧标签分组，独立于中间滚动区。 [使用案例](#border-card.vue) |  |
| close-button-display | `'hover' \| 'always'` | `undefined` | 关闭按钮显示方式，省略时继承 Tabs；hover 移入时展开，always 常驻。 键盘聚焦时也显示，无悬停能力设备保持可访问。 [使用案例](#card-group.vue) |  |

### Tab Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| closable | `boolean` | `false` | 是否允许关闭标签，只在标签的 `type` 为 `card`、`card-group` 或 `border-card` 时生效 |
| disabled | `boolean` | `false` | 是否禁用 |
| name | `string \| number` | `undefined` | 必填，标签的名称 |
| icon | `string \| VNode \| (() => VNodeChild)` | `undefined` | 标签图标；字符串作为 NIcon symbol，VNode/函数直接渲染，icon 插槽优先。 [使用案例](#border-card.vue) |
| fixed | `'left' \| 'right'` | `undefined` | 固定于左侧或右侧标签分组，独立于中间滚动区。 [使用案例](#border-card.vue) |
| close-button-display | `'hover' \| 'always'` | `undefined` | 关闭按钮显示方式，省略时继承 Tabs；hover 移入时展开，always 常驻。 键盘聚焦时也显示，无悬停能力设备保持可访问。 [使用案例](#card-group.vue) |

### Tabs Slots

| 名称         | 参数 | 说明                                           |
| ------------ | ---- | ---------------------------------------------- |
| default      | `()` | 标签的内容                                     |
| prefix       | `()` | 标签的前缀                                     |
| suffix       | `()` | 标签的后缀                                     |
| header-left  | `()` | 标签头左侧固定内容。                           |
| fixed-top    | `()` | 内容区对应方向的固定区域，不随当前 pane 切换。 |
| fixed-left   | `()` | 内容区对应方向的固定区域，不随当前 pane 切换。 |
| fixed-right  | `()` | 内容区对应方向的固定区域，不随当前 pane 切换。 |
| fixed-bottom | `()` | 内容区对应方向的固定区域，不随当前 pane 切换。 |

### TabPane Slots

| 名称    | 参数 | 说明                                                 |
| ------- | ---- | ---------------------------------------------------- |
| default | `()` | 标签项的内容                                         |
| tab     | `()` | 标签项 `tab` 的内容                                  |
| icon    | `()` | 标签图标插槽，优先于 icon 属性；与标签文字一起展示。 | [使用案例](#border-card.vue) |

### Tab Slots

| 名称    | 参数 | 说明                                                 |
| ------- | ---- | ---------------------------------------------------- |
| default | `()` | tab 的内容                                           |
| icon    | `()` | 标签图标插槽，优先于 icon 属性；与标签文字一起展示。 | [使用案例](#border-card.vue) |

### Tabs Methods

| 名称               | 类型         | 说明             | 版本   |
| ------------------ | ------------ | ---------------- | ------ |
| scrollToCurrentTab | `() => void` | 滚动到当前标签   | 2.45.0 |
| syncBarPosition    | `() => void` | 更新指示条的位置 | 2.24.0 |

### TabPaneActiveContext

`tabPaneActiveContextKey` 为后代提供响应式 selfActive、包含祖先状态的 active 和嵌套 path，便于暂停不可见页签中的业务任务。它是导出的注入键，不是 TabPane prop。
