<template>
  <div style="display: flex; padding: 24px; justify-content: space-between">
    <router-link to="/"
      ><n-tag id="title-left" checkable>CastableNFT</n-tag>
    </router-link>
    <div>
      <router-link to="/profile"
        ><n-tag checkable>{{ $t('profile') }}</n-tag></router-link
      >
      <n-dropdown trigger="hover" :options="language" @select="languageSelect">
        <n-tag checkable>{{ $t('language') }}</n-tag>
      </n-dropdown>
      <n-button @click="connectWeb3" type="primary">
        {{ $t('connect') }}
      </n-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-dom'
import i18n from '@/i18n'
import Web3Modal from 'web3modal'
import { NDropdown, NTag, NButton } from 'naive-ui'
import { store } from '@/store'

import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
} from 'vue-dapp'

const { open } = useBoard()
const { status, disconnect, error } = useWallet()
const { address, balance, chainId, isActivated } = useEthers()

export default defineComponent({
  components: {
    NDropdown,
    NTag,
    NButton,
  },
  setup() {
    async function connectWeb3() {
      open()
    }

    return {
      language: [
        {
          label: '简体中文',
          key: 'zh-CN',
        },
        {
          label: 'English',
          key: 'en',
        },
      ],
      // 更改语言
      languageSelect(key: string) {
        i18n.global.locale = key
      },
      connectWeb3,
    }
  },
})
</script>

<style scoped>
#title-left {
  font-size: 2rem;
  font-weight: bold;
  left: 1vw;
  top: 1vh;
}
</style>
