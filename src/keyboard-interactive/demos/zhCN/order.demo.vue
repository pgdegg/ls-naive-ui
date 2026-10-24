<markdown>
# 顺序、跳过和嵌套

有 `order` 的控件优先，数值越小越靠前。未配置顺序的控件按 DOM 顺序排列。嵌套容器共享最外层的导航策略，子容器不会自动抢焦点。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const first = ref('')
const second = ref('')
const third = ref('')
</script>

<template>
  <n-keyboard-interactive
    :default-focus-first="false"
    :skip-when-has-value="false"
    loop-focus
  >
    <n-space vertical>
      <n-keyboard-interactive-item :order="2">
        <n-input v-model:value="second" placeholder="第二个（显示在前）" />
      </n-keyboard-interactive-item>
      <n-keyboard-interactive-item :order="1">
        <n-input v-model:value="first" placeholder="第一个（显示在后）" />
      </n-keyboard-interactive-item>
      <n-keyboard-interactive-item ignore>
        <n-input placeholder="不参与 Enter 导航，仍可用鼠标和 Tab 聚焦" />
      </n-keyboard-interactive-item>
      <n-keyboard-interactive>
        <n-input v-model:value="third" placeholder="嵌套容器内的第三个控件" />
      </n-keyboard-interactive>
    </n-space>
  </n-keyboard-interactive>
</template>
