<markdown>
# 只读与指示器

Checkbox 支持 hide-circle、cancel-disabled、readonly 和只读继承豁免。CheckboxGroup 可独立设置 readonly / ignore-parent-readonly，实例全选仍遵守禁用状态。
</markdown>

<script setup lang="ts">
import type { CheckboxGroupInst } from 'naive-ui'
import { ref } from 'vue'

const readonly = ref(false)
const ignore = ref(false)
const hide = ref(false)
const cancel = ref(false)
const checked = ref(true)
const values = ref<string[]>(['Alpha'])
const group = ref<CheckboxGroupInst | null>(null)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="readonly">
        readonly
      </n-checkbox><n-checkbox v-model:checked="ignore">
        ignore-parent-readonly
      </n-checkbox><n-checkbox v-model:checked="hide">
        hide-circle
      </n-checkbox><n-checkbox v-model:checked="cancel">
        cancel-disabled
      </n-checkbox>
    </n-space><n-form :readonly="readonly">
      <n-checkbox
        v-model:checked="checked"
        :readonly="readonly && !ignore"
        :ignore-parent-readonly="ignore"
        :hide-circle="hide"
      >
        Alpha
      </n-checkbox><n-checkbox :checked="true" disabled :cancel-disabled="cancel">
        已选禁用标签
      </n-checkbox><n-checkbox-group
        ref="group"
        v-model:value="values"
        :readonly="readonly && !ignore"
        :ignore-parent-readonly="ignore"
      >
        <n-space>
          <n-checkbox value="Alpha" label="Alpha" /><n-checkbox
            value="Beta"
            label="Beta"
          />
        </n-space>
      </n-checkbox-group>
    </n-form><n-button @click="group?.toggleAll()">
      切换全选
    </n-button><n-text> {{ group?.allChecked }} / {{ group?.isIndeterminate }} </n-text>
  </n-space>
</template>
