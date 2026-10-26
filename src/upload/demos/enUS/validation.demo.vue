<markdown>
# File size and type validation

This example makes no upload requests. max-size limits bytes per file, validate-accept checks accept, and on-validation-error reports the reason and filename. Try oversized and non-txt files.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const error = ref('')
function invalid(reason: 'size' | 'type', file: File) {
  error.value = `${reason}: ${file.name}`
}
</script>

<template>
  <n-space vertical>
    <n-upload
      :max-size="1024"
      validate-accept
      accept=".txt"
      :default-upload="false"
      @validation-error="invalid"
    >
      <n-button>Choose a txt file (up to 1KB)</n-button>
    </n-upload><n-text type="error">
      {{ error }}
    </n-text>
  </n-space>
</template>
