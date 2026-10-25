import type { Ref } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadIconImage } from './image-resource'

export interface SpriteIconProps {
  symbol?: string
  prefix?: string | string[]
  symbolVersion?: string | number
  symbolResolver?: (symbol: string, prefix: string | string[]) => Element | null
}

export function useSpriteIcon(
  props: SpriteIconProps,
  element: Ref<HTMLElement | null | undefined>,
  visibility?: Ref<boolean>
) {
  const revision = ref(0)
  const visible = visibility ?? ref(false)
  const imagesReady = ref(false)
  const symbolElement = computed(() => {
    void revision.value
    void props.symbolVersion
    if (!props.symbol || typeof document === 'undefined')
      return null
    const prefix = props.prefix ?? 'icon'
    if (props.symbolResolver)
      return props.symbolResolver(props.symbol, prefix)
    if (prefix === '*') {
      return (
        Array.from(document.querySelectorAll('symbol[id]')).find(item =>
          item.id.endsWith(`-${props.symbol}`)
        ) ?? null
      )
    }
    for (const item of Array.isArray(prefix) ? prefix : [prefix]) {
      const symbol = document.getElementById(`${item}-${props.symbol}`)
      if (symbol)
        return symbol
    }
    return null
  })
  const imageResources = computed(() => {
    void revision.value
    void props.symbolVersion
    return Array.from(
      symbolElement.value?.querySelectorAll<SVGElement>('[data-src]') ?? []
    )
  })
  watch(
    imageResources,
    () => {
      imagesReady.value = false
    },
    { flush: 'sync' }
  )
  watch(
    [imageResources, visible],
    async ([images, isVisible], _, onCleanup) => {
      if (!isVisible || !images.length || imagesReady.value)
        return
      let cancelled = false
      onCleanup(() => {
        cancelled = true
      })
      const loaded = await Promise.all(images.map(loadIconImage))
      if (!cancelled)
        imagesReady.value = loaded.every(Boolean)
    },
    { immediate: true, flush: 'sync' }
  )
  let intersection: IntersectionObserver | undefined
  let mutation: MutationObserver | undefined
  onMounted(() => {
    watch(
      () => Boolean(props.symbol),
      (enabled) => {
        intersection?.disconnect()
        mutation?.disconnect()
        if (!enabled)
          return
        if (!visibility && typeof IntersectionObserver === 'undefined') {
          visible.value = true
        }
        else if (!visibility && element.value) {
          intersection = new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting) {
              visible.value = true
              intersection?.disconnect()
            }
          })
          intersection.observe(element.value)
        }
        if (typeof MutationObserver !== 'undefined') {
          mutation = new MutationObserver((records) => {
            if (
              records.some((record) => {
                if (record.type === 'attributes')
                  return record.target instanceof SVGElement
                if (
                  record.target instanceof Element
                  && record.target.closest('symbol')
                ) {
                  return true
                }
                return [
                  ...Array.from(record.addedNodes),
                  ...Array.from(record.removedNodes)
                ].some(
                  node =>
                    node instanceof Element
                    && (node.matches('symbol') || node.querySelector('symbol'))
                )
              })
            ) {
              revision.value++
            }
          })
          mutation.observe(document.documentElement, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['id', 'name', 'data-src']
          })
        }
        revision.value++
      },
      { immediate: true, flush: 'post' }
    )
  })
  onBeforeUnmount(() => {
    intersection?.disconnect()
    mutation?.disconnect()
  })
  return {
    symbolElement,
    showPlaceholder: computed(() =>
      Boolean(
        props.symbol
        && (!symbolElement.value
          || (imageResources.value.length && !imagesReady.value))
      )
    )
  }
}
