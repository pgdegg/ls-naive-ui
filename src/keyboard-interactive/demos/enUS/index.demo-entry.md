# Keyboard Interactive

Navigate data entry controls with Enter, with validation, ordering, value skipping, nesting and looping.

This component is a HIS fork extension. Import `NKeyboardInteractive` and `NKeyboardInteractiveItem` on demand, or use the full plugin.

## Demos

```demo
behavior.vue
basic.vue
form.vue
order.vue
programmatic.vue
```

## Usage

- Focusable native elements and Naive UI controls participate automatically. The queue is rebuilt on every navigation so inserted, removed and reordered controls are reflected immediately.
- Wrap an individual logical control in `NKeyboardInteractiveItem` to configure its order, exclusion, field or row identifier. Pass the bound business `value` for composite controls such as Select and CheckboxGroup instead of relying on their internal search input.
- `NFormItem` automatically supplies its path and validation. Enter validates all rules on the current form item. An item-level `validate` callback takes precedence and can integrate editable tables or third-party controls.
- Explicit `order` values come first, sorted ascending; ties preserve DOM order. Nested containers use the outermost navigation policy and events, and do not autofocus independently.
- Disabled, readonly, hidden, negative-tabindex and ignored controls are excluded. `ignore` preserves normal mouse and Tab access.
- Autofocus runs once after mounting. These demos disable it to avoid taking focus on page load. For asynchronously loaded content, call `focus('first')` after rendering.
- Textareas, editable content, modified Enter and IME composition retain their normal behavior. Enter already handled by a descendant keydown handler is preserved. For custom dropdowns, use `@keyup.enter.stop` and call `focus('next')` after selection if needed.
- Async navigation only completes while focus remains on the original control. Repeated Enter events during validation or interception are ignored. Rejected validation or provider promises keep focus in place.
- No Element Plus or VXE dependency is required. Table editors must be mounted before they can be focused. Scroll and render virtualized rows before requesting focus.

## API

### KeyboardInteractive Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| disabled | `boolean` | `false` | Disable Enter navigation and instance focus. |
| default-focus-first | `boolean` | `true` | Focus the first available control after mounting. Ignored when nested. |
| loop-focus | `boolean` | `false` | Return to the first available control at the end. |
| skip-when-has-value | `boolean` | `true` | Skip filled subsequent controls on Enter. Zero and false are values; empty arrays are empty. Instance focus does not skip filled controls. |
| stop-when-invalid | `boolean` | `true` | Stop navigation when validation fails. |
| enter-provider | `(context: KeyboardInteractiveEnterContext) => void \| boolean \| Promise<void \| boolean>` | `undefined` | Intercept after validation. Return false or reject to cancel. |
| on-enter | `(context: KeyboardInteractiveEnterContext) => void` | `undefined` | Run after validation and target selection, before the provider. |
| on-last-blur | `() => void` | `undefined` | Run when there is no subsequent eligible control. Focus stays in place unless looping. |

### KeyboardInteractiveItem Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | `number` | `undefined` | Focus priority, ascending. |
| ignore | `boolean` | `false` | Exclude controls inside the item. |
| path | `string` | `undefined` | Field identifier, overriding the form item path. |
| row-id | `string` | `undefined` | Editable table row identifier. |
| value | `unknown` | `undefined` | Business value, falling back to the native input value when omitted. |
| validate | `() => boolean \| Promise<boolean>` | `undefined` | Custom validation. False or rejection stops navigation. |

### KeyboardInteractive Instance

| Name | Type | Description |
| --- | --- | --- |
| focus | `(target: string \| HTMLElement \| { field: string }, direction?: 'next' \| 'prev', rowId?: string) => Promise<void>` | Accepts first, last, next, prev, a field name, DOM element or column field. Direction advances one eligible control from the resolved target. Reserved target names take precedence over identical field names. |
| currentFocused | `HTMLElement \| null` | Current logical focus target; null after leaving the container. |
| previousFocused | `HTMLElement \| null` | Previous logical focus target. |
| nextFocused | `HTMLElement \| null` | Next available target, without value skipping. |

### KeyboardInteractiveEnterContext

| Name | Type | Description |
| --- | --- | --- |
| event | `KeyboardEvent` | Original Enter event. |
| current | `HTMLElement` | Current logical target. |
| next | `HTMLElement \| null` | Next candidate after value skipping, or null at the end. |

### Slots

Both components provide a default slot. The container renders a section and the item renders a div. HTML attributes, class and style are forwarded.
