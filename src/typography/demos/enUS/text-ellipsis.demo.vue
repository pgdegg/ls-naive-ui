<markdown>
# Ellipsis and overflow state

Change width or content to observe single-line/multiline clipping and isTruncated. The tooltip is enabled only for actual truncation.
</markdown>

<script setup lang="ts">
import type { TextInst } from 'naive-ui'
import { ref } from 'vue'

const width = ref(180)
const content = ref(
  'Edit this long text to explore single-line ellipsis, multiline clipping and automatic updates when its container changes size.'
)
const textRef = ref<TextInst | null>(null)
</script>

<template>
  <n-space vertical>
    <n-input v-model:value="content" placeholder="Edit text" />
    <n-slider v-model:value="width" :min="100" :max="360" />
    <n-tooltip :disabled="!textRef?.isTruncated">
      <template #trigger>
        <n-text ref="textRef" truncated :style="{ width: `${width}px` }">
          {{ content }}
        </n-text>
      </template>
      {{ content }}
    </n-tooltip>
    <n-text :line-clamp="2" :style="{ width: `${width}px` }">
      {{ content }}
    </n-text>
    <n-text depth="3">
      Width: {{ width }}px; Truncated:
      {{ textRef?.isTruncated ? 'yes' : 'no' }}
    </n-text>
  </n-space>
</template>
