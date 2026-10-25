<markdown>
# Search and selection models

Search additional option fields, bind a separated string and synchronize labels. Bulk selection preserves locked options.
</markdown>

<script setup lang="ts">
import type { CheckboxGroupInst } from 'naive-ui'
import { createOptionModelAdapter } from 'naive-ui'
import { computed, ref } from 'vue'

const options = [
  { value: 'a', label: 'Outpatient', pinyin: 'menzhen' },
  { value: 'b', label: 'Inpatient', pinyin: 'zhuyuan' }
]
const value = ref('a')
const labels = ref<string | string[]>('')
const query = ref('')
const group = ref<CheckboxGroupInst | null>(null)
const checked = ref<Array<string | number>>(['locked'])
const groupOptions = [
  { value: 'locked', label: 'Locked', disabled: true },
  ...options
]
const objects = ref<unknown>([options[0]])
const adapter = createOptionModelAdapter(() => ({
  options,
  valueKey: 'value',
  multiple: true
}))
const primitive = computed({
  get: () => adapter.decode(objects.value) as string[],
  set: (value) => {
    objects.value = adapter.encode(value)
  }
})
</script>

<template>
  <n-space vertical>
    <n-select
      v-model:value="value"
      v-model:filter-value="query"
      multiple
      filterable
      separator=","
      :filter-keys="['pinyin']"
      :options="options"
      @update:label="labels = $event"
    />
    <n-text>
      String: {{ value }}; Labels: {{ labels }}; Query: {{ query }}
    </n-text>
    <n-select v-model:value="primitive" multiple :options="options" />
    <n-text>Object model: {{ JSON.stringify(objects) }}</n-text>
    <n-checkbox-group
      ref="group"
      v-model:value="checked"
      :options="groupOptions"
    />
    <n-button @click="group?.toggleAll()">
      Toggle all
    </n-button>
    <n-text>Selected: {{ checked }}</n-text>
  </n-space>
</template>
