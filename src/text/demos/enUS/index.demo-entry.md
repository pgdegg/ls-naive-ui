# Text

Common text presentation, extending the existing NText with Element Plus-style sizing, single/multiple-line truncation and overflow state while retaining Naive UI typography and themes.

## Demos

```demo
basic.vue
size.vue
ellipsis.vue
tags.vue
```

## API

### Text Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | `'default' \| 'primary' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | Semantic color; use error for Element Plus danger |
| size | `'small' \| 'medium' \| 'large'` | `undefined` | Text size (theme defaults 12/14/16px). Inherits the parent font size when omitted. |
| truncated | `boolean` | `false` | Enable single-line ellipsis within a constrained width. Read the actual clipping state through isTruncated. |
| line-clamp | `string \| number` | `undefined` | Positive integer line limit for multiline clipping. Overrides truncated when valid; other values are ignored. |
| tag | `string` | `'span'` | Root tag; code/delete retain their existing precedence |
| strong | `boolean` | `false` | Bold |
| italic | `boolean` | `false` | Italic |
| underline | `boolean` | `false` | Underline |
| delete | `boolean` | `false` | Deleted text, using del (nested inside code when both are set) |
| code | `boolean` | `false` | Code styling, using code as the root |
| depth | `1 \| 2 \| 3 \| '1' \| '2' \| '3'` | `undefined` | Text depth for the default type |
| theme / theme-overrides / builtin-theme-overrides | Same as Typography | `undefined` | Shared Typography theme tokens |

### Text Slots

| Name    | Parameters | Description                       |
| ------- | ---------- | --------------------------------- |
| default | `()`       | Text, icons and inline components |

### Text Inst

| Name | Type | Description |
| --- | --- | --- |
| isTruncated | readonly `boolean` | Actual overflow state; updates after content, size and font changes |

### Typography theme variables

| Name               | Default | Description |
| ------------------ | ------- | ----------- |
| textFontSizeSmall  | `12px`  | Small text  |
| textFontSizeMedium | `14px`  | Medium text |
| textFontSizeLarge  | `16px`  | Large text  |

Configure these through theme-overrides.Typography. Dark themes use the same size tokens.

### Usage

Use the existing NText with TextProps, TextSlots and TextInst. The on-demand entry is naive-ui/es/text; the default plugin already registers NText. Use ConfigProvider theme-overrides.Typography and Typography.textFontSizeSmall / Medium / Large for sizing (12 / 14 / 16px by default).

Native class/style/title attributes and events reach the root. Tooltips are opt-in through NTooltip and isTruncated. The state is false during SSR and measured after client mounting. Element Plus size="default" maps to medium; omit size to inherit the parent font size. See [Typography](typography) for other typography components.
