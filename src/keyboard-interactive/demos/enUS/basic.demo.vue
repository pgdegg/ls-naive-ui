<markdown>
# Basic usage

Press Enter to advance. Filled, disabled and readonly controls are skipped. Textareas retain Enter for newlines.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const preset = ref('Preset value')
const remark = ref('')
const loop = ref(true)
</script>

<template>
  <n-space vertical>
    <n-switch v-model:value="loop">
      <template #checked>
        Loop focus
      </template>
      <template #unchecked>
        No loop
      </template>
    </n-switch>
    <n-keyboard-interactive :loop-focus="loop" :default-focus-first="false">
      <n-space vertical>
        <n-input
          v-model:value="name"
          placeholder="Name: press Enter to continue"
        />
        <n-input v-model:value="preset" placeholder="Filled: skipped" />
        <n-input disabled placeholder="Disabled: skipped" />
        <n-input readonly value="Readonly: skipped" />
        <n-input
          v-model:value="remark"
          placeholder="Note: Enter returns to the start"
        />
      </n-space>
    </n-keyboard-interactive>
  </n-space>
</template>
