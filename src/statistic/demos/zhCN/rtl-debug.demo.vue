<markdown>
# Rtl Debug
</markdown>

<script lang="ts" setup>
import { MdSave } from '@vicons/ionicons4'
import { unstableStatisticRtl } from 'naive-ui'
import { ref } from 'vue'

const rtlEnabled = ref(false)
const rtlStyles = [unstableStatisticRtl]
</script>

<template>
  <n-space vertical>
    <n-space><n-switch v-model:value="rtlEnabled" />Rtl</n-space>
    <n-config-provider :rtl="rtlEnabled ? rtlStyles : undefined">
      <n-grid>
        <n-grid-item :span="12">
          <n-statistic label="Statistic" :value="99">
            <template #prefix>
              <n-icon>
                <MdSave />
              </n-icon>
            </template>
            <template #suffix>
              / 100
            </template>
          </n-statistic>
        </n-grid-item>
        <n-grid-item :span="12">
          <n-statistic label="Active Users">
            1,234,123
          </n-statistic>
        </n-grid-item>
      </n-grid>
    </n-config-provider>
  </n-space>
</template>
