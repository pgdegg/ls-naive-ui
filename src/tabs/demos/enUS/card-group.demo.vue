<markdown>
# Connected cards and close buttons

`type="card-group"` joins tabs into one bordered group and connects the active tab to the panel, like Element Plus card. Compare the existing separate card and bordered-panel border-card styles using the type control. Close buttons expand on hover by default; close-button-display="always" keeps them visible. TabPane/Tab can override the group setting. Keyboard focus and devices without hover also expose the buttons.
</markdown>

<script setup lang="ts">
import type { TabsProps } from 'naive-ui'
import { ref } from 'vue'

const type = ref<NonNullable<TabsProps['type']>>('card-group')
const active = ref<string | number>('User')
const always = ref(false)
const pinned = ref(false)
const panes = ref(['User', 'Config', 'Role', 'Task'])
function close(name: string | number) {
  const index = panes.value.indexOf(String(name))
  panes.value = panes.value.filter(item => item !== name)
  if (active.value === name)
    active.value = panes.value[Math.max(0, index - 1)] ?? ''
}
function reset() {
  panes.value = ['User', 'Config', 'Role', 'Task']
  active.value = 'User'
}
</script>

<template>
  <n-space vertical>
    <n-radio-group v-model:value="type">
      <n-radio-button value="card">
        card
      </n-radio-button><n-radio-button value="card-group">
        card-group
      </n-radio-button><n-radio-button value="border-card">
        border-card
      </n-radio-button>
    </n-radio-group>
    <n-space>
      <n-checkbox v-model:checked="always">
        Always show close buttons
      </n-checkbox><n-checkbox v-model:checked="pinned">
        Keep Config close button visible
      </n-checkbox><n-button size="small" @click="reset">
        Reset tabs
      </n-button>
    </n-space>
    <n-tabs
      v-model:value="active"
      :type="type"
      closable
      :close-button-display="always ? 'always' : 'hover'"
      @close="close"
    >
      <n-tab-pane
        v-for="name in panes"
        :key="name"
        :name="name"
        :tab="name"
        :close-button-display="
          name === 'Config' && pinned ? 'always' : undefined
        "
      >
        {{ name }}
      </n-tab-pane>
    </n-tabs>
  </n-space>
</template>
