# 图标 Icon

naive-ui 推荐使用 [xicons](https://xicons.org) 作为图标库。

## 演示

```demo
basic.vue
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

## HIS 定制

`symbol`、`prefix`、`symbol-version`、`symbol-resolver` 支持动态 sprite。进入视口后加载 image[data-src]，支持延迟插入、资源共享和版本更新。加载完成前或失败时使用 component / 默认插槽，未指定则显示内置占位。

完整 API 迁移、共享组合函数和演示见 [HIS 定制](../docs/his-customization).
