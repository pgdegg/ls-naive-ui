<markdown>
# Tags, icons and events

Use semantic tags or mix inline icons and components. Native event listeners are supported.
</markdown>

<script setup lang="ts">
import { HomeOutline } from '@vicons/ionicons5'
import { ref } from 'vue'

const clicks = ref(0)
</script>

<template>
  <n-space vertical>
    <n-text tag="p">
      A paragraph.
    </n-text>
    <n-text tag="mark">
      Marked text
    </n-text>
    <n-text>
      H<n-text tag="sub" size="small">
        2
      </n-text>O；x<n-text
        tag="sup"
        size="small"
      >
        2
      </n-text>
    </n-text>
    <n-text>
      <n-icon :component="HomeOutline" /> Home
      <n-button text type="primary" @click="clicks++">
        Action
      </n-button>
    </n-text>
    <n-text
      tag="button"
      type="primary"
      style="border: 0; background: none; padding: 0; cursor: pointer"
      @click="clicks++"
    >
      Text clicks: {{ clicks }}
    </n-text>
  </n-space>
</template>
