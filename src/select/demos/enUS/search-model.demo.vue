<markdown>
# Search control and delimited models

Bind a multiple selection as a `separator` string and observe `update:label`. Combine controlled `filter-value`, additional `filter-keys` and query callbacks. The second select simulates remote search and uses `remote-show-on-input` to hide empty queries. Toggle inherited states and local overrides.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref('a,b')
const query = ref('')
const labels = ref<string | string[]>('')
const notice = ref('')
const options = [
  { label: 'Alpha', value: 'a', code: '001' },
  { label: 'Beta', value: 'b', code: '002' }
]
const remoteValue = ref<string | null>(null)
const remoteOptions = ref<Array<{ label: string, value: string }>>([])
function searched(value: string) {
  remoteOptions.value = value
    ? [1, 2].map(index => ({ label: value + index, value: value + index }))
    : []
}
function changed(value: string) {
  notice.value = value
}
function labelChanged(value: string | string[]) {
  labels.value = value
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
      <n-select
        v-model:value="value"
        v-model:filter-value="query"
        multiple
        filterable
        separator=","
        :filter-keys="['code']"
        :options="options"
        :ignore-parent-readonly="ignore"
        :hide-placeholder="ignore ? false : undefined"
        :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
        :on-update-filter-value="changed"
        :on-query-change="changed"
        :on-update-label="labelChanged"
        @update:label="labelChanged"
        @update:filter-value="changed"
      />
    </n-form><n-text>
      value: {{ value }} / labels: {{ labels }} / query: {{ notice }}
    </n-text><n-select
      v-model:value="remoteValue"
      filterable
      remote
      remote-show-on-input
      :options="remoteOptions"
      placeholder="Type to show remote options"
      @search="searched"
    />
  </n-space>
</template>
