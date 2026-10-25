<markdown>
# 内嵌面板

无需点击触发，直接编辑颜色。下方的颜色块与值实时同步。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>('#24AB9E')
</script>

<template>
  <n-space vertical>
    <n-color-picker-panel
      v-model:value="value"
      :modes="['hex', 'rgb', 'hsl']"
      :swatches="['#24AB9E', '#409EFF', '#F56C6C', '#E6A23C']"
    />
    <n-space align="center">
      <div
        :style="{
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          background: value ?? 'transparent',
          border: '1px solid #ddd',
        }"
      />
      <n-text>{{ value ?? '已清空' }}</n-text>
    </n-space>
  </n-space>
</template>
