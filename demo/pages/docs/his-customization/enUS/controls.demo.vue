<markdown>
# Readonly forms and addons

Toggle form readonly and placeholder visibility. Observe local overrides, numeric precision and character restrictions.
</markdown>

<script setup lang="ts">
import { hisThemeOverrides } from 'naive-ui'
import { ref } from 'vue'

const readonly = ref(false)
const hide = ref(false)
const value = ref('')
const number = ref<number | null>(1.23)
</script>

<template>
  <n-config-provider :theme-overrides="hisThemeOverrides">
    <n-space vertical>
      <n-space>
        <n-checkbox v-model:checked="readonly">
          Form readonly
        </n-checkbox>
        <n-checkbox v-model:checked="hide">
          Hide placeholders
        </n-checkbox>
      </n-space>
      <n-form
        :readonly="readonly"
        :hide-placeholder="hide"
        :content-width="320"
        label-placement="left"
        label-width="80"
      >
        <n-form-item label="Code">
          <n-input
            v-model:value="value"
            keeps="a-zA-Z0-9"
            ignorekeeps="-"
            placeholder="Letters, numbers and hyphens only"
          >
            <template #prepend>
              HIS
            </template>
            <template #append>
              Code
            </template>
          </n-input>
        </n-form-item>
        <n-form-item label="Quantity">
          <n-input-number v-model:value="number" :max-precision="2">
            <template #append>
              box
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="Override">
          <n-input
            ignore-parent-readonly
            :hide-placeholder="false"
            placeholder="Always editable"
          />
        </n-form-item>
      </n-form>
      <n-card :disabled="readonly" size="small" title="Disabled card context">
        <n-button-group ghost :disabled="readonly">
          <n-button>Inherited disabled</n-button>
          <n-button> Also inherits disabled </n-button>
        </n-button-group>
      </n-card>
    </n-space>
  </n-config-provider>
</template>
