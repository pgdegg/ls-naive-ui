# 排印 Typography

Naive UI 提供了常用 HTML 标签的一些基本样式，以及对文本渲染提供帮助的组件。

排印是一门艺术。

## 演示

```demo
text-ellipsis.vue
text-size.vue
header.vue
tags.vue
text.vue
router-link.vue
```

## API

### Text Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | 排印类型 |
| strong | `boolean` | `false` | 粗体 |
| italic | `boolean` | `false` | 斜体 |
| underline | `boolean` | `false` | 文字下划线 |
| delete | `boolean` | `false` | 文字删除线 |
| code | `boolean` | `false` | 代码模式 |
| depth | `1 \| 2 \| 3 \| '1' \| '2' \| '3'` | `undefined` | 文字深度 |
| tag | `string` | `undefined` | 需要被渲染为什么标签，在 `code` 和 `del` 设定的情况下不生效 |
| size | `'small' \| 'medium' \| 'large'` | `undefined` | 文字字号（主题默认 12/14/16px）；省略时继承父级字号。 [使用案例](#text-size.vue) |
| truncated | `boolean` | `false` | 开启单行省略；需提供有限可用宽度，实际截断状态可通过实例 isTruncated 读取。 [使用案例](#text-ellipsis.vue) |
| line-clamp | `string \| number` | `undefined` | 正整数最大行数，开启多行省略；有效时优先于 truncated，非正整数不生效。 [使用案例](#text-ellipsis.vue) |

### P Props

| 名称  | 类型                               | 默认值      | 说明     |
| ----- | ---------------------------------- | ----------- | -------- |
| depth | `1 \| 2 \| 3 \| '1' \| '2' \| '3'` | `undefined` | 文字深度 |

### H1, H2, H3, H4, H5, H6 Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| align-text | `boolean` | `false` | 文本对齐 |
| type | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | 排印类型 |
| prefix | `'bar'` | `undefined` | 在字首显示条块 |

### Ul, Ol Props

| 名称       | 类型      | 默认值  | 说明     |
| ---------- | --------- | ------- | -------- |
| align-text | `boolean` | `false` | 文本对齐 |

### Blockquote Props

| 名称       | 类型      | 默认值  | 说明     |
| ---------- | --------- | ------- | -------- |
| align-text | `boolean` | `false` | 文本对齐 |

### All Typography Components Slots

| 名称    | 参数 | 说明       |
| ------- | ---- | ---------- |
| default | `()` | 排印的内容 |

### Text Inst

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| isTruncated | `boolean` | 只读的实际截断状态，随内容和容器尺寸变化更新；需开启 truncated 或有效 line-clamp。 |
