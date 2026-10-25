<markdown>
# Actions and theme

Confirm and clear keep the panel visible. Add custom actions with the action slot. ColorPicker theme tokens and inline width styles are supported.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>('#24AB9E')
const result = ref('Not confirmed')
function confirm(color: string | null) {
  result.value = `Confirmed: ${color ?? 'empty'}`
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
        @clear="result = 'Cleared'"
      >
        <template #action>
          <n-button size="small" @click="value = '#24AB9E'">
            Reset color
          </n-button>
        </template>
      </n-color-picker-panel>
      <n-text>{{ result }}</n-text>
    </n-space>
  </n-config-provider>
</template>
