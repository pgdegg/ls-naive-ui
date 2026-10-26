<markdown>
# 独立设置滚动条尺寸

调整 overflow-width（垂直宽度）与 overflow-height（水平高度），单位为像素；长内容可同时观察两个滚动条。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const width = ref(8)
const height = ref(8)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-input-number v-model:value="width" :min="2" :max="20" /><n-input-number
        v-model:value="height"
        :min="2"
        :max="20"
      />
    </n-space><n-scrollbar
      :overflow-width="width"
      :overflow-height="height"
      x-scrollable
      trigger="none"
      style="max-height: 120px"
    >
      <div style="width: 1000px; height: 240px; padding: 12px">
        上下、左右滚动查看不同粗细的滚动条
      </div>
    </n-scrollbar>
  </n-space>
</template>
