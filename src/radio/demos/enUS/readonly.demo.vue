<markdown>
# Readonly and indicators

Configure Radio readonly, ignore-parent-readonly and hide-circle. RadioGroup readonly / ignore-parent-readonly apply to both Radio and RadioButton.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const ignore = ref(false)
const hide = ref(false)
const value = ref('Alpha')
const checked = ref(false)
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
      </n-checkbox>
    </n-space><n-form :readonly="readonly">
      <n-radio
        v-model:checked="checked"
        :readonly="readonly && !ignore"
        :ignore-parent-readonly="ignore"
        :hide-circle="hide"
      >
        Standalone radio
      </n-radio><n-radio-group
        v-model:value="value"
        :readonly="readonly && !ignore"
        :ignore-parent-readonly="ignore"
      >
        <n-radio-button value="Alpha">
          Alpha
        </n-radio-button><n-radio-button value="Beta">
          Beta
        </n-radio-button>
      </n-radio-group>
    </n-form>
  </n-space>
</template>
