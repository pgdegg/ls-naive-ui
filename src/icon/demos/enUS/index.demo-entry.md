# Icon

It is recommend to use [xicons](https://www.xicons.org) as your icon library.

## Demos

```demo
basic.vue
sprite.vue
custom-icon.vue
depth.vue
icon-wrapper.vue
```

## API

### Icon Props

| Name | Type | Default | Description | Version |
| --- | --- | --- | --- | --- |
| color | `string` | `undefined` | Icon color. |  |
| depth | `1 \| 2 \| 3 \| 4 \| 5` | `undefined` | Icon depth. |  |
| size | `number \| string` | `undefined` | Icon size (when the unit is not specified the default unit is `px`). |  |
| component | `Component` | `undefined` | Icon component to display. | 2.24.6 |
| symbol | `string` | `undefined` | SVG sprite name, resolved as `${prefix}-${symbol}`. Shows component, the default slot or the built-in placeholder until the symbol and its images are ready. Loads image[data-src] on visibility and keeps the fallback on failure. [Example](#sprite.vue) |  |
| prefix | `string \| string[]` | `undefined` | Symbol prefix, using `'icon'` when omitted. Arrays try prefixes in order; `'*'` matches a symbol whose id ends in `-${symbol}`. [Example](#sprite.vue) |  |
| symbol-version | `string \| number` | `undefined` | Re-resolve the symbol and images when this value changes. DOM symbol changes are already observed; use this for additional refresh notifications. [Example](#sprite.vue) |  |
| symbol-resolver | `(symbol: string, prefix: string \| string[]) => Element \| null` | `undefined` | Custom symbol resolver, overriding the default prefix lookup. Return the matching element or null to keep the fallback. [Example](#sprite.vue) |  |

### IconWrapper Props

| Name          | Type     | Default     | Description    | Version |
| ------------- | -------- | ----------- | -------------- | ------- |
| border-radius | `number` | `6`         | Border radius. | 2.25.0  |
| color         | `string` | `undefined` | Color.         | 2.25.0  |
| icon-color    | `string` | `undefined` | Icon color.    | 2.25.0  |
| size          | `number` | `24`        | Size.          | 2.25.0  |

### Icon Slots

| Name    | Parameters | Description              |
| ------- | ---------- | ------------------------ |
| default | `()`       | The content of the icon. |
