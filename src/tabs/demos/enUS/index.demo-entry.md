# Tabs

Switch contents in same area.

<n-alert type="warning" title="Note" :bordered="false">
  <n-text code>n-tabs</n-text> will extract default tab value from default slot, so there would be a vue slot warning. If you don't want to see the warning, you should give component a  <n-text code>default-value</n-text>.
</n-alert>

## Demos

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
show-scroll-button.vue
center-active-tab.vue
```

## API

### Tabs Props

| Name | Type | Default | Description | Version |
| --- | --- | --- | --- | --- |
| addable | `boolean \| { disabled?: boolean }` | `false` | Whether to allow adding a tag. Only works when the tag's `type` is `card`, `card-group` or `border-card`. |  |
| add-tab-class | `string` | `undefined` | Class of the add tab. | 2.37.0 |
| add-tab-style | `string \| object` | `undefined` | Style of the add tab. | 2.37.0 |
| animated | `boolean` | `false` | Whether to activate tab switching animation. It has no effect if `placement` is `'left'`, `'right'`, `'start'` or `'end'`. | 2.27.0 |
| bar-width | `number` | `undefined` | The width of the tab bar. | 2.25.0 |
| center-active-tab | `boolean` | `false` | When set to true, the active tab will scroll to the center of the scroll container. | 2.45.0 |
| closable | `boolean` | `false` | Whether to allow the tag to be closed. Only works when the tag's `type` is `card`, `card-group` or `border-card`. |  |
| default-value | `string \| number` | `undefined` | Default value in uncontrolled mode. |  |
| justify-content | `'space-between' \| 'space-around' \| 'space-evenly' \| 'start' \| 'center' \| 'end'` | `undefined` | Justify-content value of `flex` layout. Only works with `'line'` or `'bar'` typed tabs. | `space-*` 2.29.1 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of tabs. |  |
| pane-class | `string` | `undefined` | Class of the pane. |  |
| pane-style | `string \| object` | `undefined` | Style of the pane. |  |
| pane-wrapper-class | `string` | `undefined` | Class of the pane wrapper. | 2.34.4 |
| pane-wrapper-style | `string \| object` | `undefined` | Style of the pane wrapper. | 2.34.4 |
| placement | `'left' \| 'right' \| 'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | Placement of tabs. `'start'` / `'end'` map to `'left'` / `'right'` according to RTL. It won't work with `n-tabs` whose `type` is `'segment'`. | 2.34.4, `start` `end` 2.45.0 |
| show-scroll-button | `boolean` | `false` | Whether to display the scroll button. | 2.45.0 |
| tab-class | `string` | `undefined` | Class of the tab. | 2.37.0 |
| tab-style | `string \| object` | `undefined` | Style of the tab. |  |
| tabs-padding | `number` | `0` | Start & end `padding` of the group of tabs. |  |
| trigger | `'click' \| 'hover'` | `'click'` | Trigger of activating a tab | 2.27.0 |
| type | `'bar' \| 'line' \| 'card' \| 'segment' \| 'border-card' \| 'card-group'` | `'bar'` | Tabs type: card uses separate cards, card-group joins tabs into one border, and border-card encloses both header and panel. [Example](#card-group.vue) |  |
| value | `string \| number` | `undefined` | Value in controlled mode. |  |
| on-add | `() => void` | `undefined` | Callback function triggered when adding tag. |  |
| on-before-leave | `(activeName: string \| number, oldActiveName: string \| number \| null) => boolean \| Promise<boolean>` | `undefined` | Hook function executed before switching tabs. Returning `false` or promise resolving `false` or promise rejection will prevent tab switching. |  |
| on-close | `(name: string \| number) => void` | `undefined` | Callback function triggered when closing a tag. |  |
| on-update:value | `(value: string \| number) => void` | `undefined` | Callback function triggered when the value changes. |  |
| left-type | `'bar' \| 'line' \| 'card' \| 'segment' \| 'border-card' \| 'card-group'` | `undefined` | Appearance of the left fixed tab group. Inherits type when omitted. [Example](#border-card.vue) |  |
| right-type | `'bar' \| 'line' \| 'card' \| 'segment' \| 'border-card' \| 'card-group'` | `undefined` | Appearance of the right fixed tab group. Inherits type when omitted. [Example](#border-card.vue) |  |
| close-button-display | `'hover' \| 'always'` | `'hover'` | Close-button display: hover expands it on tab hover; always keeps it visible. TabPane/Tab can override. Also visible on keyboard focus and devices without hover. [Example](#card-group.vue) |  |

### TabPane Props

| Name | Type | Default | Description | Version |
| --- | --- | --- | --- | --- |
| closable | `boolean` | `false` | Whether to allow the tag to be closed. Only works when the tag's `type` is `card`, `card-group` or `border-card`. |  |
| disabled | `boolean` | `false` | Whether to disable the tab. |  |
| display-directive | `'if' \| 'show' \| 'show:lazy'` | `'if'` | The directive to use in conditionally rendering. `if` will use `v-if` and `show` will use `v-show`. When using the `show` directive, the status of tab won't be reset after tab changes. When use `show:lazy`, the display effect is the same as `show`, but the content will be lazily loaded. |  |
| name | `string \| number` | `undefined` | Required, the name of the tab. |  |
| tab | `string \| VNode \| () => VNodeChild` | `undefined` | Tab label. |  |
| tab-props | `Object` | `undefined` | DOM attributes of tab label. | 2.24.2 |
| icon | `string \| VNode \| (() => VNodeChild)` | `undefined` | Tab icon. Strings are NIcon symbol names; VNodes/functions render directly. The icon slot takes precedence. [Example](#border-card.vue) |  |
| fixed | `'left' \| 'right'` | `undefined` | Keep the tab in the left or right fixed group, separate from the middle scrollable area. [Example](#border-card.vue) |  |
| close-button-display | `'hover' \| 'always'` | `undefined` | Close-button display. Inherits Tabs when omitted; hover expands on hover and always keeps it visible. Also visible on keyboard focus and devices without hover. [Example](#card-group.vue) |  |

### Tab Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| closable | `boolean` | `false` | Whether to allow the tag to be closed. Only works when the tag's `type` is `card`, `card-group` or `border-card`. |
| disabled | `boolean` | `false` | Whether to disable. |
| name | `string \| number` | `undefined` | Required, the name of the tab. |
| icon | `string \| VNode \| (() => VNodeChild)` | `undefined` | Tab icon. Strings are NIcon symbol names; VNodes/functions render directly. The icon slot takes precedence. [Example](#border-card.vue) |
| fixed | `'left' \| 'right'` | `undefined` | Keep the tab in the left or right fixed group, separate from the middle scrollable area. [Example](#border-card.vue) |
| close-button-display | `'hover' \| 'always'` | `undefined` | Close-button display. Inherits Tabs when omitted; hover expands on hover and always keeps it visible. Also visible on keyboard focus and devices without hover. [Example](#card-group.vue) |

### Tabs Slots

| Name | Parameters | Description |
| --- | --- | --- |
| default | `()` | Tabs content. |
| prefix | `()` | Tabs prefix. |
| suffix | `()` | Tabs suffix. |
| header-left | `()` | Fixed content before the tab header. |
| fixed-top | `()` | Fixed content on the corresponding side of the content area, preserved across pane changes. |
| fixed-left | `()` | Fixed content on the corresponding side of the content area, preserved across pane changes. |
| fixed-right | `()` | Fixed content on the corresponding side of the content area, preserved across pane changes. |
| fixed-bottom | `()` | Fixed content on the corresponding side of the content area, preserved across pane changes. |

### TabPane Slots

| Name | Parameters | Description |
| --- | --- | --- |
| default | `()` | Tab pane content. |
| tab | `()` | Tab label content. |
| icon | `()` | Tab icon slot, taking precedence over the icon prop and displayed alongside the label. | [Example](#border-card.vue) |

### Tab Slots

| Name | Parameters | Description |
| --- | --- | --- |
| default | `()` | Tab content. |
| icon | `()` | Tab icon slot, taking precedence over the icon prop and displayed alongside the label. | [Example](#border-card.vue) |

### Tabs Methods

| Name               | Type         | Description              | Version |
| ------------------ | ------------ | ------------------------ | ------- |
| scrollToCurrentTab | `() => void` | Scroll to current tab.   | 2.45.0  |
| syncBarPosition    | `() => void` | Sync tab bar's position. | 2.24.0  |

### TabPaneActiveContext

`tabPaneActiveContextKey` provides reactive selfActive, active including ancestor state, and nested path for pausing hidden-pane work. It is an exported injection key, not a TabPane prop.
