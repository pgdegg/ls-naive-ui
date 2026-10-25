# Icon

It is recommend to use [xicons](https://www.xicons.org) as your icon library.

## Demos

```demo
basic.vue
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

## HIS extensions

`symbol`, `prefix`, `symbol-version`, `symbol-resolver` support dynamic sprites, visible-only image[data-src] loading, registry changes and shared requests. Pending/failed resources use component/default-slot content or the built-in placeholder.

See the full API migration, shared composables and demos in [HIS customizations](../docs/his-customization).
