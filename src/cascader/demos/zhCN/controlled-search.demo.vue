<markdown>
# 搜索字段与表单继承

`filter-value` 控制搜索文本，`filter-keys` 额外匹配 code，事件展示查询变化。级联选择会搜索节点路径。使用下方开关验证只读和提示继承及局部覆盖。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<string | null>(null)
const query = ref('')
const notice = ref('')
const first = ref(true)
const options = [
  {
    label: 'Alpha',
    value: 'a',
    code: '001',
    children: [{ label: 'Beta', value: 'b', code: '002' }]
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
        表单只读
      </n-checkbox><n-checkbox v-model:checked="hidden">
        隐藏提示
      </n-checkbox><n-checkbox v-model:checked="ignore">
        忽略表单只读和提示隐藏
      </n-checkbox>
    </n-space><n-checkbox v-model:checked="first">
      默认高亮首个结果
    </n-checkbox><n-form :readonly="readonly" :hide-placeholder="hidden">
      <n-cascader
        v-model:value="value"
        v-model:filter-value="query"
        :options="options"
        filterable
        :filter-keys="['code']"
        :default-first-option="first"
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
