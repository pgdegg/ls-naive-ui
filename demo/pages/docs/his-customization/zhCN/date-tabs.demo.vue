<markdown>
# 快捷日期与固定页签

范围中输入 `2026/2` 并按 Enter，起点补月初并转到末段，末段补月末。中间页签多于容器时滚动，左右固定项始终保留。
</markdown>

<script setup lang="ts">
import { ref } from 'vue'

const range = ref<[number, number] | null>(null)
const time = ref<string | null>(null)
</script>

<template>
  <n-space vertical>
    <n-date-picker v-model:value="range" type="daterange" quick-input clearable>
      <template #prepend>
        就诊日期
      </template>
    </n-date-picker>
    <n-time-picker
      v-model:formatted-value="time"
      quick-input
      placeholder="输入 1230 后按 Enter"
    >
      <template #append>
        时间
      </template>
    </n-time-picker>
    <n-text>范围：{{ range }}；时间：{{ time }}</n-text>
    <n-tabs
      type="card"
      left-type="card"
      right-type="line"
      style="max-width: 640px"
    >
      <template #header-left>
        <n-text style="padding: 8px">
          诊疗
        </n-text>
      </template>
      <template #fixed-top>
        <n-alert :show-icon="false">
          此工具区不随页签切换
        </n-alert>
      </template>
      <template #fixed-left>
        <div style="padding: 12px">
          患者
        </div>
      </template>
      <template #fixed-bottom>
        <n-text depth="3">
          固定状态栏
        </n-text>
      </template>
      <n-tab-pane name="overview" tab="总览" fixed="left">
        患者总览
      </n-tab-pane>
      <n-tab-pane
        v-for="index in 12"
        :key="index"
        :name="index"
        :tab="`诊疗记录 ${index}`"
      >
        诊疗记录 {{ index }}
      </n-tab-pane>
      <n-tab-pane name="settings" tab="设置" fixed="right">
        固定设置页
      </n-tab-pane>
    </n-tabs>
  </n-space>
</template>
