import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { NAutoComplete } from '../../auto-complete'
import { NButton } from '../../button'
import { NButtonGroup } from '../../button-group'
import { NCard } from '../../card'
import { NCheckboxGroup } from '../../checkbox'
import { NDatePicker } from '../../date-picker'
import { NForm } from '../../form'
import { NInput } from '../../input'
import { NInputNumber } from '../../input-number'
import { NSelect } from '../../select'
import { NTabPane, NTabs } from '../../tabs'
import { NTimePicker } from '../../time-picker'
import { NUpload } from '../../upload'

enableAutoUnmount(afterEach)

describe('hIS component customizations', () => {
  afterEach(() => vi.useRealTimers())
  it('inherits reactive form readonly and placeholder flags while allowing opt-outs', async () => {
    const readonly = ref(true)
    const wrapper = mount(() => (
      <NForm readonly={readonly.value} hidePlaceholder>
        <NInput placeholder="hidden" />
        <NInput
          ignoreParentReadonly
          hidePlaceholder={false}
          placeholder="visible"
        />
        <NInputNumber defaultValue={1} />
      </NForm>
    ))
    const inputs = wrapper.findAll('input')
    expect(inputs[0].attributes('readonly')).toBeDefined()
    expect(inputs[0].attributes('placeholder')).toBe('')
    expect(inputs[1].attributes('readonly')).toBeUndefined()
    expect(inputs[1].attributes('placeholder')).toBe('visible')
    expect(inputs[2].attributes('readonly')).toBeDefined()
    readonly.value = false
    await nextTick()
    expect(inputs[0].attributes('readonly')).toBeUndefined()
  })
  it('filters input without filtering unfinished composition', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(NInput, {
      props: { keeps: '0-9', ignorekeeps: '[]', onUpdateValue }
    })
    await wrapper.find('input').setValue('abc[12]')
    expect(onUpdateValue).toHaveBeenLastCalledWith('[12]', { source: 0 })
    await wrapper.find('input').trigger('compositionstart')
    await wrapper.find('input').setValue('候选')
    expect(onUpdateValue).toHaveBeenCalledTimes(1)
  })
  it('forwards local placeholder and readonly overrides through composite inputs', () => {
    const wrapper = mount(() => (
      <NForm readonly hidePlaceholder>
        <NInputNumber
          ignoreParentReadonly
          hidePlaceholder={false}
          placeholder="number"
        />
        <NDatePicker
          hidePlaceholder
          startPlaceholder="start"
          endPlaceholder="end"
          type="daterange"
        />
        <NTimePicker hidePlaceholder placeholder="time" />
      </NForm>
    ))
    const [number, start, end, time] = wrapper.findAll('input')
    expect(number.element.readOnly).toBe(false)
    expect(number.element.placeholder).toBe('number')
    expect([
      start.element.placeholder,
      end.element.placeholder,
      time.element.placeholder
    ]).toEqual(['', '', ''])
  })
  it('cancels delayed autofocus on unmount', () => {
    vi.useFakeTimers()
    const wrapper = mount(NInput, {
      props: { autofocus: true, focusDelay: 200 }
    })
    const focus = vi.spyOn(wrapper.find('input').element, 'focus')
    expect(wrapper.find('input').attributes('autofocus')).toBeUndefined()
    wrapper.unmount()
    vi.runAllTimers()
    expect(focus).not.toHaveBeenCalled()
  })
  it('rounds excess numeric precision without padding the display', async () => {
    const onUpdateValue = vi.fn()
    const onPrecisionExceed = vi.fn()
    const wrapper = mount(NInputNumber, {
      props: {
        defaultValue: 1.234,
        maxPrecision: 2,
        onUpdateValue,
        onPrecisionExceed
      }
    })
    await nextTick()
    expect(onUpdateValue).toHaveBeenCalledWith(1.23)
    expect(onPrecisionExceed).toHaveBeenCalledWith(1.234, 2)
    expect(wrapper.find('input').element.value).toBe('1.23')
  })
  it('inherits button group appearance and disabled state for every child', async () => {
    const wrapper = mount(NButtonGroup, {
      props: { disabled: true, ghost: true },
      slots: {
        default: () => [
          <NButton>Normal</NButton>,
          <NButton disabled={false}>Locally enabled</NButton>
        ]
      }
    })
    expect(wrapper.findAll('button')[0].attributes('disabled')).toBeDefined()
    expect(wrapper.findAll('button')[1].attributes('disabled')).toBeDefined()
    expect(wrapper.findAll('button')[0].classes()).toContain('n-button--ghost')
    await wrapper.setProps({ disabled: false, ghost: false, text: true })
    expect(wrapper.findAll('button')[0].attributes('disabled')).toBeUndefined()
    expect(
      wrapper.findAll('button')[0].element.style.getPropertyValue('--n-color')
    ).toBe('#0000')
  })
  it('does not allow an enabled nested card to override its disabled ancestor', () => {
    const wrapper = mount(() => (
      <NCard disabled>
        <NCard>
          <NInput disabled={false} />
          <NButton disabled={false}>Action</NButton>
        </NCard>
      </NCard>
    ))
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
  it('decodes separated selections and synchronizes labels', async () => {
    const onUpdateLabel = vi.fn()
    const wrapper = mount(NSelect, {
      props: {
        multiple: true,
        separator: ',',
        value: 'a,b',
        options: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' }
        ],
        onUpdateLabel
      }
    })
    expect(wrapper.text()).toContain('Alpha')
    expect(wrapper.text()).toContain('Beta')
    expect(onUpdateLabel).toHaveBeenLastCalledWith('Alpha,Beta')
    await wrapper.setProps({ value: '' })
    expect(onUpdateLabel).toHaveBeenLastCalledWith('')
  })
  it('controls query text and guards empty remote dropdowns', async () => {
    const wrapper = mount(NSelect, {
      props: {
        filterable: true,
        remote: true,
        remoteShowOnInput: true,
        show: true,
        filterValue: '',
        options: [{ label: 'Alpha', value: 'a' }]
      }
    })
    expect(wrapper.vm.mergedShow).toBe(false)
    await wrapper.setProps({ filterValue: 'a' })
    expect(wrapper.vm.pattern).toBe('a')
    expect(wrapper.vm.mergedShow).toBe(true)
  })
  it('bulk selection preserves locked values and respects bounds', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(NCheckboxGroup, {
      props: {
        value: ['locked'],
        options: [
          { value: 'locked', disabled: true },
          { value: 0 },
          { value: 'hidden', visible: false },
          { value: 'a' }
        ],
        onUpdateValue
      }
    })
    wrapper.vm.toggleAll(true)
    expect(onUpdateValue).toHaveBeenLastCalledWith(
      ['locked', 0, 'a'],
      expect.anything()
    )
    await wrapper.setProps({ value: ['locked', 0, 'a'] })
    expect(wrapper.vm.allChecked).toBe(true)
    wrapper.vm.toggleAll()
    expect(onUpdateValue).toHaveBeenLastCalledWith(
      ['locked'],
      expect.anything()
    )
    wrapper.vm.toggleAll(false)
    expect(onUpdateValue).toHaveBeenLastCalledWith(
      ['locked'],
      expect.anything()
    )
    await wrapper.setProps({ value: ['locked'], max: 2 })
    onUpdateValue.mockClear()
    wrapper.vm.toggleAll(true)
    expect(onUpdateValue).not.toHaveBeenCalled()
  })
  it('ignores stale async autocomplete results', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const requests: Array<(options: string[]) => void> = []
    const wrapper = mount(NAutoComplete, {
      props: {
        debounce: 0,
        fetchSuggestions: (_query, callback) => {
          requests.push(callback)
        }
      }
    })
    await wrapper.find('input').setValue('old')
    await vi.advanceTimersByTimeAsync(0)
    await wrapper.find('input').setValue('new')
    await vi.advanceTimersByTimeAsync(0)
    requests[1](['Newest'])
    requests[0](['Outdated'])
    await nextTick()
    expect(wrapper.vm.treeMate.treeNodes[0].rawNode.label).toBe('Newest')
  })
  it('commits compact time input using the native formatted-value contract', async () => {
    const onUpdateFormattedValue = vi.fn()
    const wrapper = mount(NTimePicker, {
      props: { quickInput: true, onUpdateFormattedValue },
      attachTo: document.body
    })
    await wrapper.find('input').setValue('1230')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(onUpdateFormattedValue).toHaveBeenLastCalledWith(
      '12:30:00',
      expect.any(Number)
    )
  })
  it('moves from range start to end without emitting a partial date model', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(NDatePicker, {
      props: { type: 'daterange', quickInput: true, onUpdateValue },
      attachTo: document.body
    })
    const [start, end] = wrapper.findAll('input')
    await start.setValue('2026/2')
    await start.trigger('keydown', { key: 'Enter' })
    expect(document.activeElement).toBe(end.element)
    expect(onUpdateValue).not.toHaveBeenCalled()
    await end.setValue('2026/2')
    await end.trigger('keydown', { key: 'Enter' })
    expect(onUpdateValue).toHaveBeenCalledTimes(1)
    const dates = onUpdateValue.mock.calls[0][0] as [number, number]
    expect(new Date(dates[0]).getDate()).toBe(1)
    expect(new Date(dates[1]).getDate()).toBe(28)
  })
  it('keeps fixed tabs outside the scrolling middle region and renders fixed content', async () => {
    const wrapper = mount(NTabs, {
      props: { type: 'card', defaultValue: 'left' },
      slots: {
        default: () => [
          <NTabPane name="left" tab="Pinned" fixed="left">
            Left
          </NTabPane>,
          <NTabPane name="middle" tab="Middle">
            Middle
          </NTabPane>,
          <NTabPane name="right" tab="End" fixed="right">
            Right
          </NTabPane>
        ],
        'fixed-top': () => [<div>Tools</div>],
        'fixed-left': () => [<div>Navigation</div>]
      }
    })
    expect(wrapper.find('.n-tabs-fixed--left').text()).toBe('Pinned')
    expect(wrapper.find('.n-tabs-fixed--right').text()).toBe('End')
    expect(wrapper.find('.n-tabs-nav-scroll-content').text()).toBe('Middle')
    expect(wrapper.find('.n-tabs-content-wrap').text()).toContain('Tools')
    await wrapper.find('.n-tabs-fixed--right .n-tabs-tab').trigger('click')
    expect(wrapper.find('.n-tab-pane').text()).toBe('Right')
  })
  it('validates manual submissions and blocks requests when disabled', async () => {
    const onValidationError = vi.fn()
    const customRequest = vi.fn()
    const wrapper = mount(NUpload, {
      props: {
        maxSize: 1,
        customRequest,
        onValidationError,
        defaultFileList: [
          {
            id: 'large',
            name: 'large.txt',
            status: 'pending',
            file: new File(['abc'], 'large.txt')
          }
        ]
      }
    })
    wrapper.vm.submit()
    expect(onValidationError).toHaveBeenCalledWith('size', expect.any(File))
    expect(customRequest).not.toHaveBeenCalled()
    await wrapper.setProps({ maxSize: 100, disabled: true })
    wrapper.vm.submit()
    expect(customRequest).not.toHaveBeenCalled()
  })
  it('rejects quick input that violates native calendar constraints', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(NDatePicker, {
      props: { quickInput: true, isDateDisabled: () => true, onUpdateValue }
    })
    await wrapper.find('input').setValue('20261024')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    expect(onUpdateValue).not.toHaveBeenCalled()
  })
  it('validates upload size and type before calling user hooks', async () => {
    const onValidationError = vi.fn()
    const onBeforeUpload = vi.fn()
    const wrapper = mount(NUpload, {
      props: {
        defaultUpload: false,
        maxSize: 1,
        accept: '.txt',
        validateAccept: true,
        onValidationError,
        onBeforeUpload
      }
    })
    const input = wrapper.find('input').element
    Object.defineProperty(input, 'files', {
      value: [new File(['abc'], 'large.txt', { type: 'text/plain' })],
      configurable: true
    })
    await wrapper.find('input').trigger('change')
    await flushPromises()
    expect(onValidationError).toHaveBeenCalledWith('size', expect.any(File))
    expect(onBeforeUpload).not.toHaveBeenCalled()
    Object.defineProperty(input, 'files', {
      value: [new File(['a'], 'bad.png', { type: 'image/png' })]
    })
    await wrapper.find('input').trigger('change')
    await flushPromises()
    expect(onValidationError).toHaveBeenLastCalledWith('type', expect.any(File))
  })
})
