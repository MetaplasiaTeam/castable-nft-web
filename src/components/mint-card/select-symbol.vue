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
    label: 'USDT',
    key: 'USDT',
  },
  {
    label: 'USDC',
    key: 'USC',
  },
  {
    label: 'AAVE',
    key: 'AAVE',
  },
  {
    label: 'UNI',
    key: 'UNI',
  },
  {
    label: 'LINK',
    key: 'LINK',
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
  emitter.emit('changeSymbol', key)
}
</script>

<template>
  <n-dropdown trigger="click" :options="symbol" @select="selectSymbol">
    {{ store.symbol }}
  </n-dropdown>
</template>
