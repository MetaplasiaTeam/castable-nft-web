<template>
  <div style="display: flex; padding: 24px; justify-content: space-between">
    <router-link to="/"
      ><n-tag id="title-left" checkable
        ><img style="width: 20vw" src="@/assets/logo.png"
      /></n-tag>
    </router-link>
    <div>
      <n-tag v-if="isActivated" checkable>{{ shortenAddress(address) }}</n-tag>

      <n-tag checkable @click="toProfile">{{ $t('profile') }}</n-tag>

      <n-dropdown trigger="hover" :options="language" @select="languageSelect">
        <n-tag checkable>{{ $t('language') }}</n-tag>
      </n-dropdown>

      <n-button @click="connectWeb3" type="primary">
        {{ store.state.topbarButtonText }}
      </n-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, defineExpose } from '@vue/runtime-dom'
import i18n from '@/i18n'
import { NDropdown, NTag, NButton } from 'naive-ui'
import { ethers } from 'ethers'
import { useStore } from '@/store'
import Constants from '@/common/constants'
import { useRouter } from 'vue-router'

import { useBoard, useEthers, useWallet, shortenAddress } from 'vue-dapp'

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
    const router = useRouter()

    async function connectWeb3() {
      if (isActivated.value) {
        disconnect()
      } else {
        open()
      }
    }

    function toProfile() {
      if (!isActivated.value) {
        open()
      } else {
        router.push('/profile')
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
      }
    })

    watch(isActivated, (val) => {
      if (val) {
        store.commit('setTopbarButtonText', i18n.global.t('disconnect'))
      } else {
        store.commit('setTopbarButtonText', i18n.global.t('connect'))
      }
    })

    defineExpose({
      connectWeb3,
    })

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
      toProfile,
      address,
      store,
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
