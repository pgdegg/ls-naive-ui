<markdown>
# Maximum precision and readonly inheritance

`max-precision` limits decimals without padding zeros. `on-precision-exceed` reports the original value and limit. Override inherited readonly/placeholder settings and combine vertical buttons with addons.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<number | null>(null)
const notice = ref('')
function exceed(value: number, precision: number) {
  notice.value = `${value} → ${precision}`
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
      <n-input-number
        v-model:value="value"
        :max-precision="2"
        button-placement="right-vertical"
        :ignore-parent-readonly="ignore"
        :hide-placeholder="ignore ? false : undefined"
        :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
        @precision-exceed="exceed"
      >
        <template #prepend>
          ￥
        </template><template #append>
          CNY
        </template>
      </n-input-number>
    </n-form><n-text>{{ value }} / {{ notice }}</n-text>
  </n-space>
</template>
