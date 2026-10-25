<markdown>
# Modes, alpha and disabled state

Inherit readonly from a form or set disabled directly. Inputs and actions are disabled together.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>('rgba(64, 158, 255, 0.6)')
const alpha = ref(true)
const disabled = ref(false)
const readonly = ref(false)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="alpha">
        Show alpha
      </n-checkbox>
      <n-checkbox v-model:checked="disabled">
        Disabled
      </n-checkbox>
      <n-checkbox v-model:checked="readonly">
        Form readonly
      </n-checkbox>
    </n-space>
    <n-form :readonly="readonly">
      <n-color-picker-panel
        v-model:value="value"
        :show-alpha="alpha"
        :disabled="disabled"
        show-preview
        :modes="['rgb', 'hex', 'hsl', 'hsv']"
      />
    </n-form>
    <n-text>{{ value }}</n-text>
  </n-space>
</template>
