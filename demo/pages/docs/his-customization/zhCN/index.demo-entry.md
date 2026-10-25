# HIS 定制

本页对照 Element Plus 定制分支中的组件逻辑，说明此分支中的对应实现。模型遵循 Naive UI 的 `value` / `update:value` 约定；日期使用时间戳，格式化字符串使用 `formatted-value`。不能直接把 Element Plus 的 `model-value`、事件参数或主题变量原样传入。

## 本地构建与安装

在此仓库执行 `pnpm build`，完成组件库构建、冒烟测试和产物检查后，自动生成 `D:/his-dependence/naive-ui-<hash>.tgz`。在其它项目执行构建日志中给出的 `pnpm add "file:D:/his-dependence/naive-ui-<hash>.tgz"`，即可安装包含本页定制功能的版本。请使用实际生成的文件名。

`pnpm pack:his <输出目录>` 可单独打包已完成的构建产物；源码更新后应重新执行完整构建。默认不会修改其它项目或发布到 npm。完整参数说明见仓库中的 `design-notes/local-package.md`。

## 演示

```demo
controls.vue
selection.vue
date-tabs.vue
sprite.vue
confirm.vue
```

## 迁移对照

| 原定制模块 | 此分支实现 | 使用说明 |
| --- | --- | --- |
| Icon symbol、前缀回退、版本与懒加载 | `NIcon` 的 `symbol`、`prefix`、`symbol-version`、`symbol-resolver` | `prefix` 支持字符串、数组和 `*`；symbol 尚未插入或其中的 `image[data-src]` 尚未成功加载时，优先显示 `component` / 默认插槽，否则显示内置占位图标。进入视口后才请求图片，同一资源共享请求。失败保留占位。 |
| Form 只读、隐藏提示及内容宽度 | `NForm` 的 `readonly`、`hide-placeholder`、`content-width` | content-width 作用于 inline 表单项内容。输入框使用原生 readonly，选择类控件使用禁用交互。子控件 `ignore-parent-readonly` 可跳过表单只读，`:hide-placeholder="false"` 可覆盖隐藏提示。 |
| Input 字符限制及延迟聚焦 | `NInput` 的 `keeps`、`ignorekeeps`、`focus-delay` | `keeps` 接受字符串、正则或数组；`ignorekeeps` 是额外允许的字面字符。中文输入法组合期间不裁剪。延迟作用于 `autofocus`。 |
| 输入附加内容 | `NInput`、`NInputNumber`、`NDatePicker`、`NTimePicker` 的 `prepend` / `append` 插槽 | 基于原生 InputGroup，原有 `prefix` / `suffix` 保留在输入框内部。 |
| InputNumber 最大精度 | `max-precision`、`on-precision-exceed(value, precision)` | 超出时四舍五入，不强制补零；原生 `precision` 保持原语义。 |
| ButtonGroup 统一状态 | `disabled`、`ghost`、`text` | 组内按钮统一继承禁用状态与外观，不提供禁用豁免。 |
| Card 禁用子树 | `NCard disabled` | 提供禁用上下文并阻止内容交互，内部 enabled 卡片不能解除祖先禁用。 |
| Select / SelectV2 分隔模型 | `NSelect multiple separator` | 多选可绑定分隔字符串；不设置 separator 时仍为数组。`update:label` 输出所选标签，字符串模型对应分隔标签字符串。 |
| Select 搜索与远程显示 | `filter-value`、`filter-keys`、`update:filter-value`、`on-query-change`、`remote-show-on-input` | 原生 `on-search` 对应 remote-method；原生 `filter` 对应 filter-method；默认虚拟列表覆盖 SelectV2。 |
| Cascader / TreeSelect 搜索 | `filter-value`、`filter-keys`、`update:filter-value`、`on-query-change` | Cascader 在节点路径上搜索附加字段；TreeSelect 搜索节点附加字段。原生键盘导航及选择策略继续生效。 |
| 选项对象模型、默认标记 | `createOptionModelAdapter` | 使用 `decode` / `encode` 在对象模型与原生基本值模型间转换，`labels` 取标签，`defaults(field)` 取未禁用且可见的默认项。 |
| 级联路径对象、中间字段 | `createCascaderModelAdapter` | `decode` / `encode` 支持 `valueKey`、`bindPath`、`middleFields`；传入节点的 `data`、`value`、`label`、`text`、`pathNodes`，避免依赖 Element Plus 的内部 Node 类型。 |
| CheckboxGroup 全选 | 实例 `allChecked`、`isIndeterminate`、`toggleAll(checked?)` | 只操作可见且未禁用的选项，保留锁定值，遵守 min / max；隐藏选项使用 `visible: false`。 |
| Radio / Checkbox 指示器 | `hide-circle`；Checkbox `cancel-disabled` | 隐藏指示器仍保留键盘操作；cancel-disabled 只影响已选标签颜色，不解除禁用。RadioGroup 可使用同名样式类。 |
| Switch 方形 | 原生 `:round="false"` | 沿用原生属性，不添加重复别名。 |
| 日期 / 时间快捷录入 | `quick-input`、`default-to-extreme="min \| max"` | Enter 解析连续数字或分隔日期，缺失部分补最小或最大值，尊重原生禁用日期 / 时间规则。范围第一段 Enter 聚焦末段，不发出半个模型；第二段完成后整体提交。 |
| Autocomplete 异步建议 | `fetch-suggestions(query, callback)`、`debounce`、`trigger-on-focus`、`offset` | 也可返回 Promise；过期请求结果忽略，卸载 / 失焦取消待触发任务，实例提供 `loading`。不传函数时仍使用原生 options。 |
| Dialog 高度 / 拖拽复位 | `NDialog height`、`NModal reset-on-resize` | resize 防抖后重置拖拽位置；`useDialog().create` 也接受 resetOnResize。 |
| MessageBox confirm | `useDialog().confirm`、`setConfirmDefaults` | 确认 resolve；取消默认 reject `'cancel'`，`resolveOnCancel` 改为 resolve；`distinguishCancelAndClose` 区分 close。异步按钮回调返回 false 可阻止关闭。 |
| Upload 限制 | `max-size`、`validate-accept`、`on-validation-error(reason, file)` | max-size 单位为字节；校验选择文件及手动 submit；reason 为 size / type，失败不会调用上传请求。 |
| Scrollbar 滚动条尺寸 | `overflow-width`、`overflow-height` | 设置垂直条宽度和水平条高度，单位为像素。 |
| Tabs 固定分组 | `NTabPane fixed="left \| right"`，Tabs `left-type` / `right-type` | 固定项与中间滚动区分开，沿用原生激活、关闭、禁用及键盘导航；样式值使用 Naive 的 bar / line / card / segment。 |
| Tabs 固定内容 | `header-left`、`fixed-top`、`fixed-left`、`fixed-right`、`fixed-bottom` 插槽 | 内容区周围的固定区域不随当前 pane 切换。 |
| 输入元素注册 | `useInputElement`、`inputElementRegistrationKey` | 提供 `(element) => cleanup` 注册器，输入控件自动注册；卸载或 KeepAlive 停用时清理，复用时重新注册；嵌套输入只注册外层。 |
| 容器禁用上下文 | `componentDisabledContextKey` | 可 provide 布尔值或 `Ref<boolean>`；容器禁用优先于子控件局部 enabled。 |
| 嵌套页签激活上下文 | `tabPaneActiveContextKey` | 提供 `selfActive`、包含祖先状态的 `active` 与 `path`，便于停用不可见页面的业务任务。 |
| 字体与紧凑主题 | `useContentStyle`、`hisThemeOverrides` | 在 ConfigProvider 上显式启用 HIS 28px 主题。保留 bold-content / zoom-content、scan、hide-circle、cancel-disabled、inline-placeholder、ignore-disable__style 的对应样式类。 |
| Text 点击、Pagination 事件别名 | 原生 `NText onClick`、`onUpdatePage` / `onUpdate:page`、`onUpdatePageSize` / `onUpdate:pageSize` | 使用 Naive 原生接口，无需重复包装。 |
| TimeSelect / ColorPickerPanel 注册 | `NSelect` / `NColorPickerPanel` 的 `inputElement` | 时间列表可使用 Select options；颜色面板使用原生 ColorPicker 面板，注册公共入口元素。 |
| Tour 包装器命名兼容 | 无对应 Naive 内部名称判断 | 原改动仅使 Element Plus Tour 识别业务 `LsTourStep` 名称；本库没有 Tour / TourStep 组件，该名称判断不适用。 |

## 常用 API

文本与选择控件共同支持 `readonly`、`ignore-parent-readonly`、`hide-placeholder` 和 `ignore-parent-hide-placeholder`。后者可传 `'form'` 或包含 `'form'` 的数组，表示不继承表单的提示隐藏。禁用优先于只读豁免。新增能力不改变不传这些属性时的原生值模型。

`parseQuickInput(text, { type: 'date' | 'date-time' | 'time', defaultToExtreme, referenceDate })` 返回 `Date | undefined`，可用于业务导入校验。无效日期不会自动滚动到下个月。

对象适配器不会替换组件的原生模型：将 `adapter.decode(model)` 作为 value，将 `adapter.encode(value)` 写回业务模型。级联适配器需由业务根据 options 构造路径节点，`labels(nodes, model)` 可生成路径标签。

## API 收敛与标签图标

按钮组保留 disabled / ghost / text；不再提供 ignoreGroupDisabled、plain / link。表单统一使用 readonly，不提供 readonlyRaw；开关使用原生 round，不提供 square。Select 只输出 update:label，移除未使用的 label 输入属性，演示通过 @update:label 接收标签。单选、复选和开关只提供只读相关属性，不提供没有作用的占位符属性。

Tab 和 TabPane 支持 `icon: string | VNode | (() => VNodeChild)` 与 `icon` 插槽，插槽优先。字符串作为 NIcon 的 symbol，未加载时使用内置占位；普通、固定和 segment 标签均支持。参见[标签页图标演示](../components/tabs#icon.vue)。

## 颜色选择面板

新增独立 [ColorPickerPanel](../components/color-picker-panel)，提供调色盘、色相、透明度、颜色输入、预设色板及确认/清空操作；支持表单只读、容器禁用与 inputElement 注册。value/update:value 与 ColorPicker 主题保持一致。

## 数字输入步进按钮

数字输入框支持 `button-placement="right-vertical"`，在右侧将上增、下减按钮上下排列；支持范围、长按、键盘和原有图标插槽。参见[右侧上下按钮演示](../components/input-number#right-vertical.vue)。

## 文本展示

[NText](../components/text) 新增 size、truncated、line-clamp 和只读实例 isTruncated，支持单行/多行省略及自动更新的实际截断状态。沿用 Typography 主题、tag、原生事件和文字样式，不再创建重复的文本组件。
