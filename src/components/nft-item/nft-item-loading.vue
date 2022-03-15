<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
defineProps({
  error: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div id="nft-loading">
    <n-skeleton
      v-if="!error"
      height="275px"
      width="275px"
      style="margin-bottom: 4px"
    />
    <div
      v-else
      style="
        display: flex;
        width: 275px;
        height: 275px;
        justify-content: center;
        align-items: center;
      "
    >
      <i class="fa-solid fa-bomb fa-5x"></i>
    </div>
    <div id="content">
      <n-skeleton width="60px" style="margin-bottom: 4px"></n-skeleton>
      <n-skeleton width="45px" style="margin-bottom: 4px"></n-skeleton>
      <n-skeleton width="80px" style="margin-bottom: 6px"></n-skeleton>
    </div>
    <div id="buttons">
      <n-skeleton height="40px" width="40%" round />
      <n-skeleton height="40px" width="40%" round />
    </div>
  </div>
</template>

<style scoped lang="scss">
#nft-loading {
  overflow: hidden;
  border-radius: 25px;
  border-style: solid;
  border-width: 0.5px;
  border-color: #e1e4e6;
  margin-bottom: 32px;
  margin-right: 32px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02),
    0 4px 8px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.02),
    0 16px 32px rgba(0, 0, 0, 0.02), 0 32px 64px rgba(0, 0, 0, 0.02);
}

#content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 16px;
}

#buttons {
  align-self: stretch;
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-bottom: 16px;
}
</style>
