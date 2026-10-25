<markdown>
# 省略与截断状态

拖动宽度滑块或修改内容，观察单行、多行和 isTruncated 的更新。仅在实际截断时启用提示。
</markdown>

<script setup lang="ts">
import type { TextInst } from 'naive-ui'
import { ref } from 'vue'

const width = ref(180)
const content = ref(
  '这是一段可以修改的长文本，用于演示单行省略、多行截断，以及容器尺寸变化后的自动更新。'
)
const textRef = ref<TextInst | null>(null)
</script>

<template>
  <n-space vertical>
    <n-input v-model:value="content" placeholder="修改文字" />
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
      宽度：{{ width }}px；单行是否截断：{{
        textRef?.isTruncated ? '是' : '否'
      }}
    </n-text>
  </n-space>
</template>
