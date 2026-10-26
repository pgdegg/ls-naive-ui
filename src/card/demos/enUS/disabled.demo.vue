<markdown>
# Disabled card content

Card disabled blocks content interactions and disables descendant controls. Inner disabled=false does not override the ancestor.
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
