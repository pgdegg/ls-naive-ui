<markdown>
# Reset after resizing

Open and drag the modal, then resize the browser window. reset-on-resize debounces restoring its original drag offset.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
const reset = ref(true)
</script>

<template>
  <n-space>
    <n-checkbox v-model:checked="reset">
      reset-on-resize
    </n-checkbox><n-button @click="show = true">
      Open modal
    </n-button><n-modal
      v-model:show="show"
      preset="dialog"
      draggable
      :reset-on-resize="reset"
      title="Drag, then resize"
    >
      Resize the browser to observe the position reset.
    </n-modal>
  </n-space>
</template>
