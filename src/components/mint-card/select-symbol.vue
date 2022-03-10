<script setup lang="ts">
import { NDropdown } from 'naive-ui'
let symbol = [
  {
    label: 'ETH',
    key: 'ETH',
  },
  {
    label: 'Other Token',
    key: 'Other Token',
  },
]
</script>

<template>
  <n-dropdown trigger="click" :options="symbol"> ETH </n-dropdown>
</template>
