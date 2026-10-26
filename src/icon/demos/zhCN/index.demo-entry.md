# 图标 Icon

naive-ui 推荐使用 [xicons](https://xicons.org) 作为图标库。

## 演示

```demo
basic.vue
sprite.vue
custom-icon.vue
depth.vue
icon-wrapper.vue
```

## API

### Icon Props

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| color | `string` | `undefined` | 图标颜色 |
| depth | `1 \| 2 \| 3 \| 4 \| 5` | `undefined` | 图标深度 |
| size | `number \| string` | `undefined` | 图标大小（当不指定单位时，默认单位: `px`） |
| component | `Component` | `undefined` | 要展示的图标组件 | 2.24.6 |
| symbol | `string` | `undefined` | SVG sprite 图标名称，查找 `${prefix}-${symbol}`。symbol 或其中的图片未就绪时显示 component、默认插槽或内置占位；进入视口后才加载 image[data-src]，失败保留占位。 [使用案例](#sprite.vue) |  |
| prefix | `string \| string[]` | `undefined` | symbol 的命名前缀；省略时按 `'icon'` 查找，数组按顺序尝试首个存在项，`'*'` 查找 id 以 `-${symbol}` 结尾的 symbol。 [使用案例](#sprite.vue) |  |
| symbol-version | `string \| number` | `undefined` | 值变化时重新解析 symbol 及图片资源；常规 DOM symbol 变化会自动监听，此属性用于额外刷新通知。 [使用案例](#sprite.vue) |  |
| symbol-resolver | `(symbol: string, prefix: string \| string[]) => Element \| null` | `undefined` | 自定义 symbol 查找函数，优先于默认前缀查找；返回匹配元素或 null，null 时显示占位。 [使用案例](#sprite.vue) |  |

### IconWrapper Props

| 名称          | 类型     | 默认值      | 说明         | 版本   |
| ------------- | -------- | ----------- | ------------ | ------ |
| border-radius | `number` | `6`         | 边框圆角大小 | 2.25.0 |
| color         | `string` | `undefined` | 颜色         | 2.25.0 |
| icon-color    | `string` | `undefined` | 图标颜色     | 2.25.0 |
| size          | `number` | `24`        | 尺寸         | 2.25.0 |

### Icon Slots

| 名称    | 参数 | 说明       |
| ------- | ---- | ---------- |
| default | `()` | 图标的内容 |
