# 文本 Text

常用的文本展示组件。基于现有 `NText` 补充 Element Plus Text 的字号、单行省略、多行截断及截断状态功能，保留 Naive UI 的主题和文字样式。

## 演示

```demo
basic.vue
size.vue
ellipsis.vue
tags.vue
```

## API

### Text Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'default' \| 'primary' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | 文字颜色；Element Plus 的 danger 在这里使用 error |
| size | `'small' \| 'medium' \| 'large'` | `undefined` | 主题字号；不设置时继承上下文，与现有 NText 一致 |
| truncated | `boolean` | `false` | 单行超宽显示省略号，需要限制自身或容器宽度 |
| line-clamp | `string \| number` | `undefined` | 最大行数，仅正整数生效；设置后优先于 truncated |
| tag | `string` | `'span'` | 根标签；code / delete 属性保留原有标签优先级 |
| strong | `boolean` | `false` | 粗体 |
| italic | `boolean` | `false` | 斜体 |
| underline | `boolean` | `false` | 下划线 |
| delete | `boolean` | `false` | 删除线，根标签使用 del；与 code 同时设置时在 code 内嵌 del |
| code | `boolean` | `false` | 代码样式，根标签使用 code |
| depth | `1 \| 2 \| 3 \| '1' \| '2' \| '3'` | `undefined` | 默认类型的文字深度 |
| theme / theme-overrides / builtin-theme-overrides | 与 Typography 一致 | `undefined` | 共享 Typography 主题变量 |

### Text Slots

| 名称    | 参数 | 说明                     |
| ------- | ---- | ------------------------ |
| default | `()` | 文字、图标及其他内联组件 |

### Text Inst

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| isTruncated | `boolean`，只读 | 实际内容是否被截断；内容、尺寸及字体变化后更新，无截断时为 false |

### Typography 主题变量

| 名称               | 默认值 | 说明     |
| ------------------ | ------ | -------- |
| textFontSizeSmall  | `12px` | 小号文字 |
| textFontSizeMedium | `14px` | 中号文字 |
| textFontSizeLarge  | `16px` | 大号文字 |

通过 `theme-overrides.Typography` 配置；暗色主题使用同一套字号变量。

### 使用说明

直接使用 `NText`，没有重复创建其他同名组件。支持 `TextProps`、`TextSlots`、`TextInst` 类型，按需入口为 `naive-ui/es/text`；默认插件沿用已有 NText 注册。配置主题请使用 `NConfigProvider` 的 `theme-overrides.Typography`，字号可通过 Typography.textFontSizeSmall / Medium / Large 调整，默认分别为 12 / 14 / 16px。

`class`、`style`、`title` 和原生事件会传递到根标签。组件不自动添加 tooltip；可根据实例 isTruncated 控制 NTooltip。服务端渲染期间该状态为 false，客户端挂载后测量。Element Plus 的 size="default" 对应这里的 medium，省略 size 则继承父级字号。

其他排印组件见 [Typography](typography)。
