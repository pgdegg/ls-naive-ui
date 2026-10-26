<markdown>
# Input rules and form inheritance

Toggle inherited readonly/placeholder settings and local opt-outs. `keeps` allows digits and `ignorekeeps` adds a decimal point. Mount an autofocus input to observe `focus-delay`. Prepend/append slots appear outside the border.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<string | null>(null)
const focus = ref(false)
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
    </n-space>
    <n-form :readonly="readonly" :hide-placeholder="hidden">
      <n-input
        v-model:value="value"
        keeps="0-9"
        :ignorekeeps="['.']"
        :ignore-parent-readonly="ignore"
        :hide-placeholder="ignore ? false : undefined"
        :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
        placeholder="Digits and a decimal point"
      >
        <template #prepend>
          ￥
        </template><template #append>
          CNY
        </template>
      </n-input>
    </n-form>
    <n-button @click="focus = !focus">
      Mount / remove delayed autofocus input
    </n-button>
    <n-input
      v-if="focus"
      autofocus
      :focus-delay="500"
      :keeps="[/[a-z]/, '0-9']"
      placeholder="a-z / 0-9"
    />
    <n-text>{{ value }}</n-text>
  </n-space>
</template>
