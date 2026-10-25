import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { NIcon } from '../src/Icon'

describe('sprite icons', () => {
  afterEach(() => {
    document
      .querySelectorAll('svg[data-test-sprite]')
      .forEach(node => node.remove())
    vi.unstubAllGlobals()
  })
  function sprite(content: string): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.dataset.testSprite = ''
    svg.innerHTML = content
    document.body.append(svg)
    return svg
  }
  it('automatically resolves symbols inserted after mounting', async () => {
    const wrapper = mount(NIcon, {
      props: { symbol: 'late', prefix: ['missing', 'app'] }
    })
    expect(wrapper.find('use').exists()).toBe(false)
    sprite('<symbol id="app-late" name="Late icon"><path /></symbol>')
    await flushPromises()
    expect(wrapper.find('use').attributes('href')).toBe('#app-late')
    expect(wrapper.attributes('title')).toBe('Late icon')
    wrapper.unmount()
  })
  it('preloads lazy images independently of an SVG use and keeps loaded icons ready', async () => {
    const images: EventTarget[] = []
    class ImageLoader extends EventTarget {
      src = ''
      constructor() {
        super()
        images.push(this)
      }
    }
    vi.stubGlobal('Image', ImageLoader)
    const svg = sprite(
      '<symbol id="app-photo"><image data-src="photo.png" /></symbol>'
    )
    const wrapper = mount(NIcon, { props: { symbol: 'photo', prefix: 'app' } })
    await nextTick()
    expect(wrapper.find('use').exists()).toBe(false)
    expect(images).toHaveLength(1)
    images[0].dispatchEvent(new Event('load'))
    await flushPromises()
    expect(wrapper.find('use').attributes('href')).toBe('#app-photo')
    const second = mount(NIcon, { props: { symbol: 'photo', prefix: 'app' } })
    await flushPromises()
    expect(second.find('use').exists()).toBe(true)
    expect(images).toHaveLength(1)
    svg.querySelector('image')!.dataset.src = 'new.png'
    await flushPromises()
    expect(images).toHaveLength(2)
    expect(wrapper.find('use').exists()).toBe(false)
    images[1].dispatchEvent(new Event('load'))
    await flushPromises()
    expect(wrapper.find('use').exists()).toBe(true)
    wrapper.unmount()
    second.unmount()
  })
  it('waits until intersection and does not flash a placeholder when leaving the viewport', async () => {
    let intersect!: (entries: Array<{ isIntersecting: boolean }>) => void
    const disconnect = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof intersect) {
          intersect = callback
        }

        observe = vi.fn()
        disconnect = disconnect
      }
    )
    const svg = sprite(
      '<symbol id="app-lazy"><image data-src="lazy.png" /></symbol>'
    )
    const wrapper = mount(NIcon, { props: { symbol: 'lazy', prefix: 'app' } })
    expect(svg.querySelector('image')!.hasAttribute('href')).toBe(false)
    intersect([{ isIntersecting: true }])
    svg.querySelector('image')!.dispatchEvent(new Event('load'))
    await flushPromises()
    expect(wrapper.find('use').exists()).toBe(true)
    intersect([{ isIntersecting: false }])
    await flushPromises()
    expect(wrapper.find('use').exists()).toBe(true)
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalled()
  })
  it('retains an inline placeholder on failure and ignores stale loads', async () => {
    const svg = sprite(
      '<symbol id="app-old"><image data-src="old.png" /></symbol><symbol id="app-new"><image data-src="new.png" /></symbol>'
    )
    const wrapper = mount(NIcon, { props: { symbol: 'old', prefix: 'app' } })
    await nextTick()
    await wrapper.setProps({ symbol: 'new' })
    svg.querySelectorAll('image')[0].dispatchEvent(new Event('load'))
    svg.querySelectorAll('image')[1].dispatchEvent(new Event('error'))
    await flushPromises()
    expect(wrapper.find('.n-icon__placeholder').exists()).toBe(true)
    expect(wrapper.find('use').exists()).toBe(false)
    wrapper.unmount()
  })
})
