<script setup lang="ts">
import { watch } from 'vue'
import { useBoard, useEthers, useWallet, shortenAddress } from 'vue-dapp'
import { useStore } from '@/store'
import Constants from '@/common/constants'
import { useRouter } from 'vue-router'
import { ethers } from 'ethers'
import i18n from '@/i18n'
import { NButton, NTag } from 'naive-ui'

const { open } = useBoard()
const { disconnect } = useWallet()
const { address, isActivated, signer, provider } = useEthers()
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

watch(isActivated, async (val) => {
  if (val) {
    store.commit('setTopbarButtonText', shortenAddress(address.value))
  } else {
    store.commit('setTopbarButtonText', i18n.global.t('connect'))
  }
})
</script>

<template>
  <div id="buttons">
    <button
      class="nft-button"
      id="pdf"
      @click="router.push('/faq')"
      text-color="#fff"
    >
      FAQ
    </button>

    <button class="nft-button" @click="toProfile" text-color="#fff">
      {{ $t('profile') }}
    </button>

    <!-- <n-dropdown trigger="hover" :options="language" @select="languageSelect">
        <n-tag checkable>{{ $t('language') }}</n-tag>
      </n-dropdown> -->

    <n-button
      id="connect"
      color="#8FDBFD"
      @click="connectWeb3"
      type="primary"
      text-color="#000000"
      round
    >
      {{ store.state.topbarButtonText }}
    </n-button>
  </div>
</template>

<style scoped>
#buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#connect {
  background: linear-gradient(110deg, #f7ffff, #8edbfd, #f85a02);
}
#pdf {
  background-image: linear-gradient(#19191a, #19191a);
}
.nft-button {
  border: none;
  cursor: pointer;
  line-height: 1;
  font-size: 14px;
  height: 34px;
  padding: 18px;
  width: 110px;
  box-sizing: border-box;
  background-image: linear-gradient(#000, #000),
    linear-gradient(110deg, #f7ffff, #8edbfd, #f85a02);
  font-weight: 400;
  color: #fff;
  padding: 2px;
  border-radius: 34px;
  background-clip: content-box, padding-box;
  transition: filter 0.5s ease;
  margin-right: 18px;
}

@media screen and (width<678px) {
  #buttons {
    background: #19191a;
    flex-direction: column;
    align-items: space-between;
    height: 150px;
  }
}
</style>
