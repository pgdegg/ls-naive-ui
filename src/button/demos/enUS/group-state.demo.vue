<markdown>
# Button group inheritance

Group `disabled`, `ghost` and `text` propagate to buttons. A child disabled=false cannot override group disabled.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(false)
const ghost = ref(false)
const text = ref(false)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="disabled">
        disabled
      </n-checkbox><n-checkbox v-model:checked="ghost">
        ghost
      </n-checkbox><n-checkbox v-model:checked="text">
        text
      </n-checkbox>
    </n-space><n-button-group :disabled="disabled" :ghost="ghost" :text="text">
      <n-button type="primary">
        Save
      </n-button><n-button :disabled="false">
        Child button
      </n-button>
    </n-button-group>
  </n-space>
</template>
