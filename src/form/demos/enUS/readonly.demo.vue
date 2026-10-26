<markdown>
# Readonly, placeholders and content width

`readonly` and `hide-placeholder` propagate to controls. `content-width` sets inline form-item content width. The second control explicitly opts out.
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const readonly = ref(false)
const hidden = ref(false)
const ignore = ref(false)
const value = ref<string | null>(null)
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
    </n-space><n-form
      inline
      :readonly="readonly"
      :hide-placeholder="hidden"
      :content-width="180"
    >
      <n-form-item label="Inherited">
        <n-input v-model:value="value" />
      </n-form-item><n-form-item label="Local settings">
        <n-input
          v-model:value="value"
          :ignore-parent-readonly="ignore"
          :hide-placeholder="ignore ? false : undefined"
          :ignore-parent-hide-placeholder="ignore ? 'form' : undefined"
        />
      </n-form-item>
    </n-form>
  </n-space>
</template>
