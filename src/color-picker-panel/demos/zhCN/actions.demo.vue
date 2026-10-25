<markdown>
# 操作与主题

确认和清空不会隐藏面板。自定义操作放在 action 插槽；主题沿用 ColorPicker，可通过 style 设置宽度。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>('#24AB9E')
const result = ref('尚未确认')
function confirm(color: string | null) {
  result.value = `已确认：${color ?? '空'}`
}
</script>

<template>
  <n-config-provider
    :theme-overrides="{ ColorPicker: { borderRadius: '8px' } }"
  >
    <n-space vertical>
      <n-color-picker-panel
        v-model:value="value"
        :actions="['confirm', 'clear']"
        style="width: 280px"
        @confirm="confirm"
        @clear="result = '已清空'"
      >
        <template #action>
          <n-button size="small" @click="value = '#24AB9E'">
            恢复默认颜色
          </n-button>
        </template>
      </n-color-picker-panel>
      <n-text>{{ result }}</n-text>
    </n-space>
  </n-config-provider>
</template>
