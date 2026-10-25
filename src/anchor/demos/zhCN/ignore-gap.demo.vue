<markdown>
# 忽略间隔
</markdown>

<template>
  <div style="height: 200px">
    <n-grid :x-gap="12">
      <n-grid-item :span="6">
        <div />
      </n-grid-item>
      <n-grid-item :span="6">
        <div />
      </n-grid-item>
      <n-grid-item :span="6">
        <div style="width: 160px; float: right">
          <n-anchor style="z-index: 1" ignore-gap>
            <n-anchor-link title="演示" href="#演示">
              <n-anchor-link title="忽略间隔" href="#ignore-gap.vue" />
              <n-anchor-link title="固定" href="#affix.vue" />
              <n-anchor-link title="滚动到" href="#scrollto.vue" />
            </n-anchor-link>
            <n-anchor-link title="API" href="#API" />
          </n-anchor>
        </div>
      </n-grid-item>
      <n-grid-item :span="6">
        <div style="width: 160px; float: right">
          <n-anchor style="z-index: 1">
            <n-anchor-link title="演示" href="#演示">
              <n-anchor-link title="忽略间隔" href="#ignore-gap.vue" />
              <n-anchor-link title="固定" href="#affix.vue" />
              <n-anchor-link title="滚动到" href="#scrollto.vue" />
            </n-anchor-link>
            <n-anchor-link title="API" href="#API" />
          </n-anchor>
        </div>
      </n-grid-item>
    </n-grid>
  </div>
</template>
