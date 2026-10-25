<markdown>
# Tab icons and fixed groups

Pass a sprite name or render function to `icon`, or use the `icon` slot for a custom component. The slot takes precedence. Icons work in regular tabs, fixed groups and standalone `n-tab` headers. String icons use `n-icon` with its built-in loading placeholder.
</markdown>

<script setup lang="ts">
import { HomeOutline } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { h } from 'vue'

const homeIcon = () => h(NIcon, null, { default: () => h(HomeOutline) })
</script>

<template>
  <n-space vertical>
    <n-tabs type="card" default-value="home">
      <n-tab-pane name="home" tab="Overview" fixed="left" :icon="homeIcon">
        Overview content
      </n-tab-pane>
      <n-tab-pane name="records" tab="Records">
        <template #icon>
          <NIcon :component="HomeOutline" />
        </template>
        Record content
      </n-tab-pane>
      <n-tab-pane
        name="sprite"
        tab="Dynamic icon"
        fixed="right"
        icon="his-record"
      >
        Inserting the icon-his-record symbol replaces the placeholder
        automatically.
      </n-tab-pane>
    </n-tabs>
    <n-tabs default-value="only-tab">
      <n-tab name="only-tab" :icon="homeIcon">
        Header only
      </n-tab>
      <n-tab name="slot-tab">
        <template #icon>
          <NIcon :component="HomeOutline" />
        </template>
        Slot icon
      </n-tab>
    </n-tabs>
  </n-space>
</template>
