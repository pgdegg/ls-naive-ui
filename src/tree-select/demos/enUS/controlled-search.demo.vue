<markdown>
# Search fields and form inheritance

`filter-value` controls search text and `filter-keys` also matches code. Events report query changes. Cascader searches along node paths. Toggle readonly/placeholder inheritance and local overrides.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<string | null>(null)
const query = ref('')
const notice = ref('')
const options = [
  {
    label: 'Alpha',
    key: 'a',
    code: '001',
    children: [{ label: 'Beta', key: 'b', code: '002' }]
  }
]
function changed(value: string) {
  notice.value = value
}
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="readonly">
        Form readonly
      </n-checkbox><n-checkbox v-model:checked="hidden">
        Hide placeholders
      </n-checkbox><n-checkbox v-model:checked="ignore">
        Ignore inherited settings
      </n-checkbox>
    </n-space><n-form :readonly="readonly" :hide-placeholder="hidden">
      <n-tree-select
        v-model:value="value"
        v-model:filter-value="query"
        :options="options"
        filterable
        :filter-keys="['code']"
        :ignore-parent-readonly="ignore"
        :hide-placeholder="ignore ? false : undefined"
        :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
        :on-query-change="changed"
        :on-update-filter-value="changed"
        @update:filter-value="changed"
      />
    </n-form><n-text>query: {{ query }} / event: {{ notice }}</n-text>
  </n-space>
</template>
