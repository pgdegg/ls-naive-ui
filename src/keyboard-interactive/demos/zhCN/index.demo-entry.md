# 键盘交互 Keyboard Interactive

使用 Enter 在录入控件之间切换焦点，支持表单校验、自定义顺序、已有值跳过、嵌套和循环导航。

本组件为 HIS fork 扩展。按需导入 `NKeyboardInteractive`、`NKeyboardInteractiveItem`；全量注册也可直接使用。

## 演示

```demo
basic.vue
form.vue
order.vue
programmatic.vue
```

## 使用说明

- 原生可聚焦控件及 Naive UI 控件的可聚焦 DOM 自动参与导航，无需逐个注册。动态增删和排序在每次导航时重新读取。
- 使用 `NKeyboardInteractiveItem` 包裹单个逻辑控件配置顺序、忽略、字段或行标识。对于 Select、CheckboxGroup 等复合控件，传入绑定的 `value`，避免将搜索文字误当业务值。
- `NFormItem` 自动提供字段名和校验。默认在 Enter 时校验当前表单项的全部规则。自定义 `validate` 优先于表单项校验，可用于编辑表格或第三方控件。
- `order` 优先于 DOM 顺序；相同顺序保持 DOM 顺序。嵌套容器由最外层统一导航和触发事件，子容器不自动聚焦，行为配置以最外层为准。
- 禁用、只读、隐藏、`tabindex="-1"` 和 `ignore` 控件不参与导航。`ignore` 不影响正常 Tab 和鼠标操作。
- 默认首次挂载聚焦第一个可用控件，文档演示关闭此选项以免页面加载时抢焦点。异步内容加载后可手动调用 `focus('first')`。
- 多行输入框、富文本、组合键 Enter 和输入法组合输入保留原生行为。子控件 keydown 已处理的 Enter 不触发导航；自定义下拉控件也可在外层使用 `@keyup.enter.stop`，并在选择完成后调用实例 `focus('next')`。
- 对焦点仍在当前控件时才应用异步结果；等待期间的重复 Enter 会被忽略。校验或拦截回调拒绝时保留焦点。
- 不依赖 Element Plus 或 VXE。编辑表格必须实际挂载目标行的编辑器；虚拟滚动中尚未渲染的行需要由调用方先滚动并挂载，再聚焦。

## API

### KeyboardInteractive Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| disabled | `boolean` | `false` | 停用 Enter 导航和实例聚焦。 |
| default-focus-first | `boolean` | `true` | 挂载后自动聚焦首个控件，嵌套时不生效。 |
| loop-focus | `boolean` | `false` | 到达末尾后回到第一个可用控件。 |
| skip-when-has-value | `boolean` | `true` | Enter 导航跳过已有值的后续控件；`0`、`false` 也视为有值，空数组视为空。实例聚焦不跳过已有值。 |
| stop-when-invalid | `boolean` | `true` | 校验不通过时停止导航。 |
| enter-provider | `(context: KeyboardInteractiveEnterContext) => void \| boolean \| Promise<void \| boolean>` | `undefined` | 校验通过后执行，返回 `false` 或拒绝可取消切换。 |
| on-enter | `(context: KeyboardInteractiveEnterContext) => void` | `undefined` | 校验通过、候选目标确定后触发，在异步拦截之前。 |
| on-last-blur | `() => void` | `undefined` | 没有可用后续目标时触发；未开启循环时保持当前焦点。 |

### KeyboardInteractiveItem Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| order | `number` | `undefined` | 聚焦优先级，数值小的优先。 |
| ignore | `boolean` | `false` | 忽略此项内的控件。 |
| path | `string` | `undefined` | 字段标识，覆盖表单项 path。 |
| row-id | `string` | `undefined` | 编辑表格行标识。 |
| value | `unknown` | `undefined` | 业务值，未传入时使用原生输入值。 |
| validate | `() => boolean \| Promise<boolean>` | `undefined` | 自定义校验，返回 `false` 或拒绝时停止导航。 |

### KeyboardInteractive 实例

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| focus | `(target: string \| HTMLElement \| { field: string }, direction?: 'next' \| 'prev', rowId?: string) => Promise<void>` | 支持 `first`、`last`、`next`、`prev`，字段名、DOM 元素或表格列字段。`direction` 表示从定位控件继续前进或后退一个可用控件。保留字优先于同名字段。 |
| currentFocused | `HTMLElement \| null` | 当前聚焦的元素，移出容器后为 null。 |
| previousFocused | `HTMLElement \| null` | 上一次聚焦的元素。 |
| nextFocused | `HTMLElement \| null` | 下一个可用元素，不应用已有值跳过。 |

### KeyboardInteractiveEnterContext

| 名称    | 类型                  | 说明                                    |
| ------- | --------------------- | --------------------------------------- |
| event   | `KeyboardEvent`       | 原始 Enter 事件。                       |
| current | `HTMLElement`         | 当前元素。                              |
| next    | `HTMLElement \| null` | 应用跳过规则后的候选元素，末尾为 null。 |

### 插槽

两个组件均提供 `default` 插槽。容器渲染为 `section`，配置项渲染为 `div`，支持透传 HTML 属性、class 和 style。
