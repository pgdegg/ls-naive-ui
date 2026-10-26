<markdown>
# 搜索控制与分隔模型

多选绑定 `separator` 字符串，`update:label` 输出标签；受控 `filter-value`、附加搜索字段 `filter-keys` 与查询回调可同时使用。第二个选择器模拟远程搜索，`remote-show-on-input` 在空查询时隐藏菜单。切换表单状态验证局部豁免。
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
        表单只读
      </n-checkbox><n-checkbox v-model:checked="hidden">
        隐藏提示
      </n-checkbox><n-checkbox v-model:checked="ignore">
        忽略表单只读和提示隐藏
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
      placeholder="输入后才显示远程选项"
      @search="searched"
    />
  </n-space>
</template>
