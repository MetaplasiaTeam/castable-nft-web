<script setup lang="ts">
import { NIcon, NDropdown, useMessage } from 'naive-ui'
import { useStore } from '@/store'
import i18n from '@/i18n'
import emitter from '@/emitter'
import { useEthers } from 'vue-dapp'
import Constants from '@/common/data/constants'
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

if (
  Constants.CONTRACT_ADDRESS === '0xb55C74905572A47DE02167D19687d495Fc2C3F1b'
) {
  symbol.push({
    label: 'DAI(test)',
    key: 'DAI TEST',
  })
}

function selectSymbol(key: string) {
  if (signer.value === null) {
    message.error(i18n.global.t('error.please_connect_web3'))
    return
  }
  emitter.emit('changeSymbol', key)
}
</script>

<template>
  <div>
    <i class="fa-solid fa-angle-down" style="margin-right: 8px"></i>
    <n-dropdown trigger="click" :options="symbol" @select="selectSymbol">
      {{ store.symbol }}
    </n-dropdown>
  </div>
</template>
