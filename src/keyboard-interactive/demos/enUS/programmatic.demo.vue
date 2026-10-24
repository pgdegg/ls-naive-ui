<markdown>
# Programmatic focus and async interception

Resolve table editors by field and row identifiers. An asynchronous enter-provider can return false to cancel navigation.
</markdown>

<script setup lang="ts">
import type { KeyboardInteractiveInst } from 'naive-ui'
import { ref } from 'vue'

const interactive = ref<KeyboardInteractiveInst | null>(null)
const rows = ref([
  { id: '1', name: '', note: '' },
  { id: '2', name: '', note: '' }
])
const allow = ref(true)

async function beforeEnter(): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return allow.value
}
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-button @click="interactive?.focus('first')">
        First
      </n-button>
      <n-button @click="interactive?.focus('last')">
        Last
      </n-button>
      <n-button @click="interactive?.focus({ field: 'name' }, 'next', '2')">
        Next after name in row 2
      </n-button>
      <n-checkbox v-model:checked="allow">
        Allow Enter navigation
      </n-checkbox>
    </n-space>
    <n-keyboard-interactive
      ref="interactive"
      :default-focus-first="false"
      :enter-provider="beforeEnter"
    >
      <n-space v-for="row in rows" :key="row.id">
        <n-keyboard-interactive-item
          path="name"
          :row-id="row.id"
          :value="row.name"
        >
          <n-input
            v-model:value="row.name"
            :placeholder="`Row ${row.id}: name`"
          />
        </n-keyboard-interactive-item>
        <n-keyboard-interactive-item
          path="note"
          :row-id="row.id"
          :value="row.note"
        >
          <n-input
            v-model:value="row.note"
            :placeholder="`Row ${row.id}: note`"
          />
        </n-keyboard-interactive-item>
      </n-space>
    </n-keyboard-interactive>
  </n-space>
</template>
