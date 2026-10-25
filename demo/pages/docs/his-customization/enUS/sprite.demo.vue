<markdown>
# Dynamic icons and placeholders

Insert a symbol after a delay. The built-in placeholder stays until its image loads. Repeat to check cached resources.
</markdown>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const id = `his-demo-${Math.random().toString(36).slice(2)}`
const state = ref('Waiting for symbol')
let sprite: SVGSVGElement | undefined
let timer: ReturnType<typeof setTimeout> | undefined
function load() {
  clearTimeout(timer)
  sprite?.remove()
  state.value = 'Inserting in 1 second'
  timer = setTimeout(() => {
    sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    sprite.style.display = 'none'
    const symbol = document.createElementNS(sprite.namespaceURI, 'symbol')
    symbol.id = `his-${id}`
    symbol.setAttribute('viewBox', '0 0 24 24')
    symbol.setAttribute('name', 'Loaded visit icon')
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
    state.value = 'Symbol inserted'
  }, 1000)
}
onBeforeUnmount(() => {
  clearTimeout(timer)
  sprite?.remove()
})
</script>

<template>
  <n-space align="center">
    <n-icon :symbol="id" :prefix="['his', 'icon']" :size="40" />
    <n-button @click="load">
      Load dynamic icon
    </n-button>
    <n-text>{{ state }}</n-text>
  </n-space>
</template>
