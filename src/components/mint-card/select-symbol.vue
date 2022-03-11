<script setup lang="ts">
import { NDropdown, useMessage } from 'naive-ui'
import { useStore } from '@/store'
import i18n from '@/i18n'
import emitter from '@/emitter'
import { useEthers } from 'vue-dapp'
const store = useStore()
const { signer } = useEthers()
const message = useMessage()

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
  if (signer.value === null) {
    message.error(i18n.global.t('error.please_connect_web3'))
    return
  }
  store.commit('setSymbol', key)
  emitter.emit('changeSymbol', key)
}
</script>

<template>
  <n-dropdown trigger="click" :options="symbol" @select="selectSymbol">
    {{ store.state.symbol }}
  </n-dropdown>
</template>
