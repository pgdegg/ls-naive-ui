# 对话框 Dialog

执行之前，请确认。

<n-alert title="使用前提" type="warning" :bordered="false">
  如果你想使用对话框，你需要把调用其方法的组件放在 <n-text code>n-dialog-provider</n-text> 内部并且使用 <n-text code>useDialog</n-text> 去获取 API。
</n-alert>

例如：

```html
<!-- App.vue -->
<n-dialog-provider>
  <content />
</n-dialog-provider>
```

```js
import { useDialog } from 'naive-ui'
import { defineComponent } from 'vue'

// content
export default defineComponent({
  setup() {
    const dialog = useDialog()
    return {
      warning() {
        dialog.warning(options)
      }
    }
  }
})
```

## 演示

```demo
height.vue
confirm.vue
basic.vue
async.vue
use-component.vue
mask.vue
action.vue
use-dialog-reactive-list.vue
focus-debug.vue
rtl-debug.vue
```

## API

### useDialog API

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| destroyAll | `() => void` | 销毁所有弹出的对话框 |
| create | `(options: DialogOptions) => DialogReactive` | 创建对话框 |
| error | `(options: DialogOptions) => DialogReactive` | 调用 `error` 类型的对话框 |
| info | `(options: DialogOptions) => DialogReactive` | 调用 `info` 类型的对话框 |
| success | `(options: DialogOptions) => DialogReactive` | 调用 `success` 类型的对话框 |
| warning | `(options: DialogOptions) => DialogReactive` | 调用 `warning` 类型的对话框 |
| confirm | `(options?: DialogConfirmOptions) => Promise<'confirm' \| 'cancel' \| 'close'>` | 创建确认框；确认 resolve('confirm')，取消默认 reject('cancel')。异步按钮回调返回 false 时保持打开且 Promise 不结算。 |
| setConfirmDefaults | `(options: DialogConfirmOptions) => void` | 合并此 DialogProvider 下后续 confirm 调用的默认选项；单次调用的配置优先。 |

### useDialogReactiveList API

`() => Ref<readonly DialogReactive[]>`

### DialogOptions Properties

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| action | `() => VNodeChild` | `undefined` | 操作区域的内容，需要是渲染函数 |  |
| actionClass | `string` | `undefined` | 操作区域的类名 | 2.38.2 |
| actionStyle | `Object \| string` | `undefined` | 操作区域的样式 | 2.38.2 |
| autoFocus | `boolean` | `true` | 是否自动聚焦 Modal 第一个可聚焦的元素 | 2.28.3 |
| blockScroll | `boolean` | `true` | 是否在打开时禁用 body 滚动 | 2.28.3 |
| bordered | `boolean` | `false` | 是否显示 `border` |  |
| class | `any` | `undefined` | 类名 | 2.33.0 |
| closable | `boolean` | `true` | 是否显示 `close` 图标 |  |
| closeFocusable | `boolean` | `false` | 关闭按钮是否可以聚焦 | 2.43.0 |
| closeOnEsc | `boolean` | `true` | 是否在摁下 Esc 键的时候关闭对话框 | 2.26.4 |
| content | `string \| (() => VNodeChild)` | `undefined` | 对话框内容，可以是渲染函数 |  |
| contentClass | `string` | `undefined` | 内容的类名 | 2.38.2 |
| contentStyle | `Object \| string` | `undefined` | 内容的样式 | 2.38.2 |
| draggable | `boolean \| { bounds?: 'none' }` | `false` | 是否可拖拽 | 2.41.0 |
| iconPlacement | `'left' \| 'top'` | `'left'` | 图标的位置 |  |
| icon | `() => VNodeChild` | `undefined` | 对话框 `icon`, 需要是渲染函数 |  |
| loading | `boolean` | `false` | 是否显示 `loading` 状态 |  |
| maskClosable | `boolean` | `true` | 是否可以通过点击 `mask` 关闭对话框 |  |
| negativeButtonProps | `ButtonProps` | `undefined` | 取消按钮的属性 | 2.27.0 |
| negativeText | `string` | `undefined` | 取消按钮的文字，不填对应的按钮不会出现 |  |
| positiveButtonProps | `ButtonProps` | `undefined` | 确认按钮的属性 | 2.27.0 |
| positiveText | `string` | `undefined` | 确认按钮的文字，不填对应的按钮不会出现 |  |
| showIcon | `boolean` | `true` | 是否显示 `icon` |  |
| style | `string \| Object` | `undefined` | 样式 |  |
| title | `string \| (() => VNodeChild)` | `undefined` | 标题，可以是渲染函数 |  |
| titleClass | `string` | `undefined` | 标题的类名 | 2.38.2 |
| titleStyle | `Object \| string` | `undefined` | 标题的样式 | 2.38.2 |
| transformOrigin | `'mouse' \| 'center'` | `'mouse'` | 对话框动画出现的位置 | 2.34.0 |
| type | `'error \| 'success' \| 'warning'` | `'warning'` | 对话框类型 |  |
| zIndex | `number` | `undefined` | Dialog 的 z-index | 2.43.0 |
| onAfterEnter | `() => void` | `undefined` | 出现动画完成执行的回调 | 2.33.0 |
| onAfterLeave | `() => void` | `undefined` | 关闭动画完成执行的回调 | 2.33.3 |
| onClose | `() => boolean \| Promise<boolean> \| any` | `undefined` | 默认行为是关闭确认框。返回 `false` 或者 `resolve false` 或者 `Promise` 被 `reject` 会避免默认行为 |  |
| onNegativeClick | `(e: MouseEvent) => boolean \| Promise<boolean> \| any` | `undefined` | 默认行为是关闭确认框。返回 `false` 或者 `resolve false` 或者 `Promise` 被 `reject` 会避免默认行为 |  |
| onPositiveClick | `(e: MouseEvent) => boolean \| Promise<boolean> \| any` | `undefined` | 默认行为是关闭确认框。返回 `false` 或者 `resolve false` 或者 `Promise` 被 `reject` 会避免默认行为 |  |
| onMaskClick | `() => void` | `undefined` | 点击蒙层后执行的回调 |  |
| reset-on-resize | `boolean` | `false` | 可拖拽对话框在窗口 resize 后防抖重置拖拽位移，恢复初始位置。 [使用案例](#height.vue) |  |
| height | `number \| string` | `undefined` | 内容区高度；数字单位为 px，超出时滚动，与 Dialog height 一致。 [使用案例](#height.vue) |  |

### DialogReactive API

#### DialogReactive Properties

下列属性都可以被动态修改。

| 名称 | 类型 | 说明 | 版本 |
| --- | --- | --- | --- |
| actionClass | `string` | 操作区域的类名 | 2.38.2 |
| actionStyle | `Object \| string` | 操作区域的样式 | 2.38.2 |
| bordered | `boolean` | 是否显示 `border` |  |
| class | `any` | 类名 | 2.33.0 |
| closable | `boolean` | 是否显示 `close` 图标 |  |
| closeFocusable | `boolean` | 关闭按钮是否可以聚焦 | 2.43.0 |
| closeOnEsc | `boolean` | 是否在摁下 Esc 键的时候关闭对话框 | 2.26.4 |
| content | `string \| (() => VNodeChild)` | 对话框内容，可以是渲染函数 |  |
| contentClass | `string` | 内容的类名 | 2.38.2 |
| contentStyle | `Object \| string` | 内容的样式 | 2.38.2 |
| iconPlacement | `'left' \| 'top'` | 图标的位置 |  |
| icon | `() => VNodeChild` | 对话框 `icon`，需要是渲染函数 |  |
| loading | `boolean` | 是否显示 `loading` 状态 |  |
| maskClosable | `boolean` | 是否可以通过点击 `mask` 关闭对话框 |  |
| negativeButtonProps | `ButtonProps` | 取消按钮的属性 | 2.27.0 |
| negativeText | `string` | 取消按钮的文字，不填对应的按钮不会出现 |  |
| positiveButtonProps | `ButtonProps` | 确认按钮的属性 | 2.27.0 |
| positiveText | `string` | 确认按钮的文字，不填对应的按钮不会出现 |  |
| showIcon | `boolean` | 是否显示 `icon` |  |
| style | `string \| Object` | 样式 |  |
| title | `string \| (() => VNodeChild)` | 可以是渲染函数 |  |
| titleClass | `string` | 标题的类名 | 2.38.2 |
| titleStyle | `Object \| string` | 标题的样式 | 2.38.2 |
| transformOrigin | `'mouse' \| 'center'` | 对话框动画出现的位置 | 2.34.0 |
| type | `'error \| 'success' \| 'warning'` | 对话框类型 |  |
| onAfterEnter | `() => void \| undefined` | 出现动画完成执行的回调 | 2.33.0 |
| onAfterLeave | `() => void \| undefined` | 关闭动画完成执行的回调 | 2.33.3 |
| onClose | `() => boolean \| Promise<boolean> \| any` | 默认行为是关闭确认框。返回 `false` 或者 resolve `false` 或者 `Promise` 被 `reject` 会避免默认行为 |  |
| onEsc | `() => void` | 焦点在 dialog 内部时按下 Esc 键的回调 | 2.32.0 |
| onNegativeClick | `(e: MouseEvent) => boolean \| Promise<boolean> \| any` | 默认行为是关闭确认框。返回 `false` 或者 resolve `false` 或者 `Promise` 被 `reject` 会避免默认行为 |  |
| onPositiveClick | `(e: MouseEvent) => boolean \| Promise<boolean> \| any` | 默认行为是关闭确认框。返回 `false` 或者 resolve `false` 或者 `Promise` 被 `reject` 会避免默认行为 |  |

#### DialogReactive Methods

| 名称    | 类型 | 说明          |
| ------- | ---- | ------------- |
| destroy | `()` | 关闭 `Dialog` |

### Dialog Props

| 名称 | 类型 | 默认值 | 说明 | 版本 |
| --- | --- | --- | --- | --- |
| action-class | `string` | `undefined` | 操作区域的类名 | 2.38.2 |
| action-style | `Object \| string` | `undefined` | 操作区域的样式 | 2.38.2 |
| bordered | `boolean` | `false` | 是否显示 `border` |  |
| closable | `boolean` | `true` | 是否显示 `close` 图标 |  |
| close-focusable | `boolean` | `false` | 关闭按钮是否可以聚焦 | 2.43.0 |
| content | `string \| (() => VNodeChild)` | `undefined` | 对话框内容，可以是渲染函数 |  |
| content-class | `string` | `undefined` | 内容的类名 | 2.38.2 |
| content-style | `Object \| string` | `undefined` | 内容的样式 | 2.38.2 |
| icon-placement | `'left' \| 'top'` | `'left'` | 图标放置的位置 |  |
| icon | `() => VNodeChild` | `undefined` | 需要是渲染函数 |  |
| loading | `boolean` | `false` | 是否显示 `loading` 状态 |  |
| negative-button-props | `ButtonProps` | `undefined` | 取消按钮的属性 | 2.27.0 |
| negative-text | `string` | `undefined` | 取消按钮的文字，不填对应的按钮不会出现 |  |
| positive-button-props | `ButtonProps` | `undefined` | 确认按钮的属性 | 2.27.0 |
| positive-text | `string` | `undefined` | 确认按钮的文字，不填对应的按钮不会出现 |  |
| show-icon | `boolean` | `true` | 是否显示 `icon` |  |
| title | `string \| (() => VNodeChild)` | `undefined` | 对话框标题，可以是渲染函数 |  |
| title-class | `string` | `undefined` | 标题的类名 | 2.38.2 |
| title-style | `Object \| string` | `undefined` | 标题的样式 | 2.38.2 |
| type | `'error \| 'success' \| 'warning' \| 'info'` | `'warning'` | 对话框类型 |  |
| on-close | `() => void` | `undefined` | 点击关闭时执行的回调函数 |  |
| on-negative-click | `(e: MouseEvent) => void` | `undefined` | 执行 `negative` 时执行的回调函数 |  |
| on-positive-click | `(e: MouseEvent) => void` | `undefined` | 执行 `positive` 时执行的回调函数 |  |
| height | `number \| string` | `undefined` | 对话框内容区域高度；数字单位为 px，字符串支持 CSS 长度。 [使用案例](#height.vue) |  |

### Dialog Slots

| 名称    | 参数 | 说明          | 版本   |
| ------- | ---- | ------------- | ------ |
| action  | `()` | `action` 内容 |        |
| default | `()` | 对话框内容    |        |
| header  | `()` | `header` 内容 |        |
| icon    | `()` | `icon` 内容   |        |
| close   | `()` | `close` 内容  | 2.36.0 |

### DialogConfirmOptions Properties

继承上述 DialogOptions；以下选项仅用于 `useDialog().confirm()` 和 `setConfirmDefaults()`，不是 NDialog 组件属性。

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| resolveOnCancel | `boolean` | `false` | 取消或关闭也让 Promise resolve 对应动作；默认会 reject。 |
| distinguishCancelAndClose | `boolean` | `false` | 将关闭动作区分为 'close'；默认将关闭归为 'cancel'。 |
