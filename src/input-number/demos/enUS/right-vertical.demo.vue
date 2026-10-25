<markdown>
# Vertical buttons on the right

Set `button-placement="right-vertical"` to stack the increment and decrement buttons on the right, similar to Element Plus. The up arrow increases and the down arrow decreases. Holding, keyboard input, limits and existing icon slots remain available.

The button area uses a transparent background and thin dividers. Its width adapts to the input size, with consistent 12px arrows in light and dark themes.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<number | null>(1)
const disabled = ref(false)
const readonly = ref(false)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="disabled">
        Disabled
      </n-checkbox>
      <n-checkbox v-model:checked="readonly">
        Readonly
      </n-checkbox>
    </n-space>
    <n-input-number
      v-for="size in ['tiny', 'small', 'medium', 'large'] as const"
      :key="size"
      v-model:value="value"
      :size="size"
      :min="0"
      :max="10"
      :disabled="disabled"
      :readonly="readonly"
      button-placement="right-vertical"
      style="width: 180px"
    />
    <n-input-number
      v-model:value="value"
      :min="0"
      :max="10"
      :disabled="disabled"
      :readonly="readonly"
      button-placement="right-vertical"
      clearable
    >
      <template #suffix>
        Quantity
      </template>
      <template #append>
        box
      </template>
    </n-input-number>
    <n-text>Value: {{ value }} (0–10)</n-text>
  </n-space>
</template>
