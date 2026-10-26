# HIS customization audit

Source: `D:/HIS/element-plus`, behavioral changes between `dev` and `e6345c3fdf` (before the comment-only translation commit `a0f756c2e7`). Compare runtime logic rather than translated comments when refreshing this inventory.

Public APIs and runnable examples live in each component's `demos/{zhCN,enUS}` documentation. New properties are listed in the corresponding Props tables, with slots and instance methods in their own sections. The documentation uses native Naive model contracts instead of emulating Element Plus event signatures.

| Source directories | Destination |
| --- | --- |
| icon | icon/src/use-sprite-icon.ts, image-resource.ts; visible-only preloading and shared resource state |
| form, card | _mixins/use-form-item.ts, form/src/Form.tsx, card/src/Card.tsx; ancestor disabled/readonly/placeholder contexts |
| input, input-number | input/src/keeps.ts, _internal/input-addons.ts and native control implementations |
| select, select-v2 | select/src/Select.tsx; native virtual list and search plus controlled queries, field filtering, separated models, labels |
| cascader, tree-select | native search extensions; composables/cascader-model.ts for object/path/intermediate models |
| checkbox, radio | native option groups, bulk state, indicator styling; composables/option-model.ts |
| time-picker, date-picker | composables/quick-input.ts; native validation, atomic range updates and keyboard focus |
| time-select, color-picker-panel | Select and ColorPickerPanel inputElement registration; business time lists use Select options |
| autocomplete | auto-complete/src/AutoComplete.tsx; debounce, callback/Promise suggestions, stale-response protection |
| button | button-group and button; disabled and appearance inheritance |
| dialog, message-box | dialog and modal; body height, resize drag reset, Promise confirm and defaults |
| switch, scrollbar | native round=false and independent scrollbar thickness |
| tabs | tabs/src/Tabs.tsx, Tab.tsx, TabPane.tsx and active-context.ts; fixed groups, icon props/slots, surrounding slots and nested activation |
| text, pagination | existing native onClick and colon/camel model event aliases |
| tour | source patch only recognizes an application LsTourStep wrapper; no equivalent name filtering exists in Naive UI |
| hooks | composables/use-input-element.ts, use-content-style.ts and model adapters |
| theme-chalk custom styles | optional themes/his.ts profile, global content classes and native component styles |

Sprite loading listens for symbol registry changes automatically. Explicit symbolVersion remains useful for custom registries that do not mutate DOM. A detached HTML Image preloader avoids deadlocking on an SVG image inside a symbol that is not rendered until loading finishes. Failures keep the built-in placeholder.

HIS default sizing/colors are opt-in through ConfigProvider themeOverrides, keeping upstream default themes usable. Utility classes preserve explicit application opt-ins. Native layout/theme primitives replace Element-specific selectors; do not copy `.el-*` selectors into Naive controls.

Tests use native model updates and lifecycle behavior. On Windows, the existing vue-jsx-vapor virtual-module URL resolution needs a local ignored Vitest alias config; it redirects generated virtual helper modules to real cached files and keeps the project JSX compiler enabled.

API cleanup: remove ignoreGroupDisabled, plain/link, readonlyRaw, square and unused Select label input props. Radio/Checkbox/Switch only add readonly options, not placeholder props. Keep native ghost/text, readonly and round. Every affected component documentation page links to the shared migration guide.

ColorPickerPanel: public inline component in src/color-picker-panel. Shares setupColorPicker state and renderPanel with ColorPicker, excludes popup-only props, keeps actions mounted, propagates disabled/readonly state and reuses the ColorPicker theme. Dedicated bilingual docs and three demos per language are registered in the component routes/menu.

Text: extend the existing typography NText with optional sizes, single/multiline clipping and observed isTruncated state. src/text provides an on-demand entry and dedicated bilingual docs with four demos, while Typography continues to export the same component.
