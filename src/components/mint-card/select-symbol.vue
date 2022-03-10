<script setup lang="ts">
import { NDropdown } from 'naive-ui'
import { useStore } from '@/store'
import emitter from '@/emitter'
const store = useStore()

let symbol = [
  {
    label: 'ETH',
    key: 'ETH',
  },
  {
    label: 'DAI',
    key: 'DAI',
  },
  {
    label: 'Other Token',
    key: 'Other Token',
  },
]

function selectSymbol(key: string) {
  store.commit('setSymbol', key)
  emitter.emit('changeSymbol', key)
}
</script>

<template>
  <n-dropdown trigger="click" :options="symbol" @select="selectSymbol">
    {{ store.state.symbol }}
  </n-dropdown>
</template>
