# Typography

Naive UI provides some HTML text styling.

Typography is an art.

## Demos

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

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | Typography type. |
| strong | `boolean` | `false` | Strong. |
| italic | `boolean` | `false` | Italic. |
| underline | `boolean` | `false` | Underline. |
| delete | `boolean` | `false` | Use the `del` tag and strikethrough style. |
| code | `boolean` | `false` | Use the `code` tag and style. |
| depth | `1 \| 2 \| 3 \| '1' \| '2' \| '3'` | `undefined` | Text depth (shade of text). |
| tag | `string` | `undefined` | Tag to use. `code` or `delete` properties will override this. |
| size | `'small' \| 'medium' \| 'large'` | `undefined` | Text size (theme defaults 12/14/16px). Inherits the parent font size when omitted. [Example](#text-size.vue) |
| truncated | `boolean` | `false` | Enable single-line ellipsis within a constrained width. Read the actual clipping state through isTruncated. [Example](#text-ellipsis.vue) |
| line-clamp | `string \| number` | `undefined` | Positive integer line limit for multiline clipping. Overrides truncated when valid; other values are ignored. [Example](#text-ellipsis.vue) |

### P Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| depth | `1 \| 2 \| 3 \| '1' \| '2' \| '3'` | `undefined` | Text depth (shade of text). |

### H1, H2, H3, H4, H5, H6 Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| align-text | `boolean` | `false` | Text alignment. |
| type | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | Text color style. |
| prefix | `'bar'` | `undefined` | Show a bar in front of the heading. |

### Ul, Ol Props

| Name       | Type      | Default | Description     |
| ---------- | --------- | ------- | --------------- |
| align-text | `boolean` | `false` | Text alignment. |

### Blockquote Props

| Name       | Type      | Default | Description     |
| ---------- | --------- | ------- | --------------- |
| align-text | `boolean` | `false` | Text alignment. |

### All Typography Components Slots

| Name    | Parameters | Description                |
| ------- | ---------- | -------------------------- |
| default | `()`       | The content of typography. |

### Text Inst

| Name | Type | Description |
| --- | --- | --- |
| isTruncated | `boolean` | Readonly actual clipping state, updated for content and size changes. Requires truncated or a valid line-clamp. |
