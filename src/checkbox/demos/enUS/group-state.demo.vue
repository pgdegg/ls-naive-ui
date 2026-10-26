<markdown>
# Readonly and indicators

Checkbox supports hide-circle, cancel-disabled, readonly and readonly inheritance opt-outs. CheckboxGroup has its own readonly / ignore-parent-readonly settings; instance toggling still honors disabled states.
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
        Disabled checked label
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
      Toggle all
    </n-button><n-text> {{ group?.allChecked }} / {{ group?.isIndeterminate }} </n-text>
  </n-space>
</template>
