<template>
  <div style="display: flex; padding: 24px; justify-content: space-between">
    <router-link to="/"
      ><n-tag id="title-left" checkable>CastableNFT</n-tag>
    </router-link>
    <div>
      <n-tag v-if="isActivated" checkable>{{ shortenAddress(address) }}</n-tag>

      <router-link to="/profile"
        ><n-tag checkable>{{ $t('profile') }}</n-tag></router-link
      >
      <n-dropdown trigger="hover" :options="language" @select="languageSelect">
        <n-tag checkable>{{ $t('language') }}</n-tag>
      </n-dropdown>

      <n-button @click="connectWeb3" type="primary">
        {{ buttonText }}
      </n-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from '@vue/runtime-dom'
import i18n from '@/i18n'
import { NDropdown, NTag, NButton } from 'naive-ui'
import { ethers } from 'ethers'
import { useStore } from '@/store'
import Constants from '@/common/constants'

import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
  ConnectionState,
} from 'vue-dapp'

const { open } = useBoard()
const { status, disconnect, error } = useWallet()
const { address, balance, chainId, isActivated, network, signer } = useEthers()

export default defineComponent({
  components: {
    NDropdown,
    NTag,
    NButton,
  },
  setup() {
    const store = useStore()

    async function connectWeb3() {
      if (isActivated.value) {
        disconnect()
      } else {
        open()
      }
    }

    let buttonText = ref(i18n.global.t('connect'))

    watch(address, async (address) => {
      if (address !== null && address !== undefined && signer.value !== null) {
        store.commit('setWeb3Address', address)
        store.commit(
          'setNFTContract',
          new ethers.Contract(
            Constants.CONTRACT_ADDRESS,
            Constants.CONTRACT_ABI,
            signer.value
          )
        )
        buttonText.value = i18n.global.t('disconnect')
      }
      buttonText.value = i18n.global.t('connect')
    })

    // watch(isActivated, (val) => {
    //   if (val) {
    //     buttonText.value = i18n.global.t('disconnect')
    //   } else {
    //     buttonText.value = i18n.global.t('connect')
    //   }
    // })

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
      buttonText,
      connectWeb3,
      shortenAddress,
      address,
      isActivated,
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
