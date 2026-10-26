<markdown>
# 禁用卡片内容

外层 Card disabled 会禁用子控件并阻止内容交互；内层 disabled=false 不能解除祖先禁用。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(false)
const value = ref('')
</script>

<template>
  <n-space vertical>
    <n-checkbox v-model:checked="disabled">
      disabled
    </n-checkbox><n-card :disabled="disabled">
      <n-space vertical>
        <n-input v-model:value="value" /><n-card :disabled="false" size="small">
          <n-select :options="['Alpha', 'Beta']" />
        </n-card>
      </n-space>
    </n-card>
  </n-space>
</template>
