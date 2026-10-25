# HIS Customizations

This fork ports the component customizations from the HIS Element Plus fork. Use Naive UI's `value` / `update:value` model, timestamp dates and `formatted-value` strings. Element Plus model bindings and callback arguments are not interchangeable.

## Local build and installation

Run `pnpm build` in this repository. After the library build, smoke tests and artifact checks succeed, it creates `D:/his-dependence/naive-ui-<hash>.tgz`. Run the printed `pnpm add "file:D:/his-dependence/naive-ui-<hash>.tgz"` command in a consuming project to install these customizations. Use the actual generated filename.

Use `pnpm pack:his <destination>` to pack existing build artifacts. Rebuild after changing source files. By default, packaging does not edit consuming projects or publish to npm. See `design-notes/local-package.md` in the repository for all arguments.

## Demos

```demo
controls.vue
selection.vue
date-tabs.vue
sprite.vue
confirm.vue
```

## Migration reference

| Source customization | Naive UI implementation |
| --- | --- |
| Lazy sprite icons | `NIcon symbol`, `prefix` (string, array, or `*`), `symbol-version`, `symbol-resolver`. Until the symbol and all its `image[data-src]` resources are ready, render the component/default slot or the built-in placeholder. Images load upon entering the viewport, share requests and retain the placeholder on failure. |
| Form readonly and placeholders | `NForm readonly`, `hide-placeholder`, `content-width`. Controls support `ignore-parent-readonly`, `hide-placeholder` and `ignore-parent-hide-placeholder="form"`. Selectors become noninteractive; text inputs retain native readonly behavior. |
| Input restrictions and focus | `NInput keeps` accepts strings, regexes and arrays; `ignorekeeps` adds literal allowed characters. Composition is preserved. `focus-delay` delays autofocus. |
| Input addons | Input, InputNumber, DatePicker and TimePicker support `prepend` / `append` slots through InputGroup. Existing prefix/suffix slots stay inside the control. |
| Numeric precision cap | `NInputNumber max-precision`, `on-precision-exceed(value, precision)`. Rounds without zero padding. |
| Group and container state | ButtonGroup `disabled`, `ghost`, `text`; every child inherits group disabling. Card `disabled` propagates to descendants and blocks interaction. |
| Select and virtual select | `NSelect multiple separator` supports string models, `update:label` synchronizes labels. `filter-value`, `filter-keys`, `on-query-change`, `remote-show-on-input` extend search. Native `on-search`, `filter` and virtual scrolling cover the existing remote/filter/virtual APIs. |
| Cascader / TreeSelect search | `filter-value`, `filter-keys`, `update:filter-value`, `on-query-change`. Cascader searches the path, TreeSelect searches node fields. |
| Object models | `createOptionModelAdapter`: `decode`, `encode`, `labels`, `defaults(field)`. Bind decoded values to native controls and encode updates back into business objects. |
| Cascader object paths | `createCascaderModelAdapter` supports `valueKey`, `bindPath`, `middleFields`, label paths and child removal. Supply structural nodes with data/value/label/text/pathNodes. |
| Checkbox bulk selection | CheckboxGroup instance `allChecked`, `isIndeterminate`, `toggleAll(checked?)`; honors disabled/hidden options and min/max, preserving locked values. |
| Indicator and switch appearance | Radio/Checkbox `hide-circle`; Checkbox `cancel-disabled` changes selected label styling only. Use native Switch `:round="false"`. |
| Quick dates and times | `quick-input`, `default-to-extreme="min \| max"`. Enter parses compact or separated input, fills missing parts and checks native constraints. A range start advances focus without emitting an incomplete model. |
| Async autocomplete | `fetch-suggestions(query, callback)` or Promise return, `debounce`, `trigger-on-focus`, `offset`; stale results are ignored. The instance exposes `loading`. |
| Dialog dimensions and drag | `NDialog height`, `NModal reset-on-resize`; provider-created dialogs also accept resetOnResize. |
| Promise confirmation | `useDialog().confirm`, `setConfirmDefaults`. Confirm resolves; cancel rejects by default. `resolveOnCancel` resolves cancel, `distinguishCancelAndClose` separates close. Returning false from async callbacks vetoes closing. |
| Upload validation | `max-size` in bytes, `validate-accept`, `on-validation-error(reason, file)` with size/type reason. Validates selected files and manual submissions. |
| Scrollbar dimensions | `overflow-width`, `overflow-height` set vertical bar width / horizontal bar height in pixels. |
| Fixed tabs | TabPane `fixed="left \| right"`, Tabs `left-type`, `right-type` (bar/line/card/segment); fixed groups sit outside the middle scroll region. Slots: header-left, fixed-top, fixed-left, fixed-right, fixed-bottom. |
| Native element registration | `useInputElement`, `inputElementRegistrationKey`: provide `(element) => cleanup`; cleanup runs on unmount/KeepAlive deactivation. Nested controls register once. |
| Container disabled state | Provide a boolean or `Ref<boolean>` with `componentDisabledContextKey`; container state takes precedence over locally enabled controls. |
| Nested pane activity | `tabPaneActiveContextKey` provides selfActive, ancestor-aware active and nested path. |
| Theme and content styles | Explicitly pass `hisThemeOverrides` to ConfigProvider for the compact 28px theme. `useContentStyle` produces bold-content/zoom-content classes. scan, hide-circle, cancel-disabled, inline-placeholder and ignore-disable__style classes are also supported. |
| Text and pagination aliases | Native NText onClick, onUpdatePage/onUpdate:page and onUpdatePageSize/onUpdate:pageSize already provide equivalent behavior. |
| TimeSelect / ColorPickerPanel registration | NSelect / NColorPickerPanel expose inputElement. Time lists use Select options. |
| Tour wrapper naming | The source-only change allows LsTourStep in Element Plus Tour. Naive UI has no Tour/Step implementation or name filter, so that compatibility check does not apply here. |

`parseQuickInput(text, { type: 'date' | 'date-time' | 'time', defaultToExtreme, referenceDate })` returns a Date or undefined. Invalid calendar dates are rejected rather than normalized into another month. See the Chinese migration table for detailed examples.

## API cleanup and tab icons

ButtonGroup keeps disabled / ghost / text without ignoreGroupDisabled or plain / link aliases. Form uses readonly without readonlyRaw. Switch uses native round without square. Select emits update:label and no longer accepts an unused label input prop; listen with @update:label. Radio, Checkbox and Switch expose readonly options without irrelevant placeholder props.

Tab and TabPane support `icon: string | VNode | (() => VNodeChild)` and an icon slot, which takes precedence. String icons use the NIcon symbol API and loading placeholder. Regular, fixed and segment headers are supported. See the [tab icon demo](../components/tabs#icon.vue).

## Color picker panel

[ColorPickerPanel](../components/color-picker-panel) adds an inline palette, hue/alpha sliders, color inputs, presets and confirm/clear actions. It supports form readonly, container disabling and inputElement registration, sharing value/update:value and ColorPicker themes.

## Vertical numeric step buttons

InputNumber accepts `button-placement="right-vertical"` for stacked increment/decrement arrows, retaining limits, holding, keyboard behavior and icon slots. See the [vertical buttons demo](../components/input-number#right-vertical.vue).

## Text presentation

[NText](../components/text) adds size, truncated, line-clamp and readonly instance isTruncated, with automatic overflow tracking. It retains Typography themes, native tags/events and existing text styles without introducing a duplicate text component.
