<markdown>
# 动态图标与内置占位

点击后延迟插入 symbol，图片加载成功前显示内置占位。重新加载可检查已缓存图片的行为。
</markdown>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const id = `his-demo-${Math.random().toString(36).slice(2)}`
const state = ref('等待插入')
const version = ref(0)
function resolveSymbol(
  symbol: string,
  prefix: string | string[]
): Element | null {
  for (const item of Array.isArray(prefix) ? prefix : [prefix]) {
    const found = document.getElementById(`${item}-${symbol}`)
    if (found)
      return found
  }
  return null
}
let sprite: SVGSVGElement | undefined
let timer: ReturnType<typeof setTimeout> | undefined
function load() {
  clearTimeout(timer)
  sprite?.remove()
  state.value = '1 秒后插入'
  timer = setTimeout(() => {
    sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    sprite.style.display = 'none'
    const symbol = document.createElementNS(sprite.namespaceURI, 'symbol')
    symbol.id = `his-${id}`
    symbol.setAttribute('viewBox', '0 0 24 24')
    symbol.setAttribute('name', '已加载的就诊图标')
    const image = document.createElementNS(sprite.namespaceURI, 'image')
    image.setAttribute('width', '24')
    image.setAttribute('height', '24')
    image.setAttribute(
      'data-src',
      `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" rx="4" fill="#24ab9e"/><path d="M12 5v14M5 12h14" stroke="white" stroke-width="3"/></svg>')}`
    )
    symbol.append(image)
    sprite.append(symbol)
    document.body.append(sprite)
    version.value++
    state.value = 'symbol 已插入'
  }, 1000)
}
onBeforeUnmount(() => {
  clearTimeout(timer)
  sprite?.remove()
})
</script>

<template>
  <n-space align="center">
    <n-icon
      :symbol="id"
      :symbol-version="version"
      :symbol-resolver="resolveSymbol"
      :prefix="['his', 'icon']"
      :size="40"
    />
    <n-button @click="load">
      动态加载图标
    </n-button>
    <n-button @click="version++">
      手动刷新 symbol-version
    </n-button>
    <n-text>{{ state }} / {{ version }}</n-text>
  </n-space>
</template>
