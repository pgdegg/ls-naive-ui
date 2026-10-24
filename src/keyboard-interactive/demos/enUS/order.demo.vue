<markdown>
# Ordering, exclusion and nesting

Explicit order values come first, ascending. Other controls follow DOM order. Nested containers share the outer navigation policy without taking focus on mount.
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
        <n-input
          v-model:value="second"
          placeholder="Second (displayed first)"
        />
      </n-keyboard-interactive-item>
      <n-keyboard-interactive-item :order="1">
        <n-input v-model:value="first" placeholder="First (displayed second)" />
      </n-keyboard-interactive-item>
      <n-keyboard-interactive-item ignore>
        <n-input
          placeholder="Excluded from Enter navigation; mouse and Tab still work"
        />
      </n-keyboard-interactive-item>
      <n-keyboard-interactive>
        <n-input
          v-model:value="third"
          placeholder="Third control inside a nested container"
        />
      </n-keyboard-interactive>
    </n-space>
  </n-keyboard-interactive>
</template>
