<template>
  <div id="top-bar-div">
    <router-link to="/"
      ><img style="height: 30px" src="@/assets/img/logo.svg" />
    </router-link>
    <div id="buttons">
      <button id="profile" @click="toPDF" text-color="#fff">FAQ</button>

      <button id="profile" @click="toProfile" text-color="#fff">
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
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  defineExpose,
  onMounted,
} from '@vue/runtime-dom'
import i18n from '@/i18n'
import { NDropdown, NTag, NButton } from 'naive-ui'
import { Contract, ethers } from 'ethers'
import { useStore } from '@/store'
import Constants from '@/common/constants'
import { useRouter } from 'vue-router'

import { useBoard, useEthers, useWallet, shortenAddress } from 'vue-dapp'

const { open } = useBoard()
const { disconnect } = useWallet()
const { address, isActivated, signer, provider } = useEthers()

export default defineComponent({
  components: {
    NDropdown,
    NTag,
    NButton,
  },
  setup() {
    onMounted(() => {
      i18n.global.locale = 'en'
    })

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

    function toPDF() {
      router.push('/introduction')
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

    watch(isActivated, async (val) => {
      if (val) {
        store.commit('setTopbarButtonText', shortenAddress(address.value))
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
      toPDF,
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

#top-bar-div {
  display: flex;
  justify-content: space-between;
  padding-top: 2vh;
  padding-left: 15vw;
  padding-right: 15vw;
  padding-bottom: 5vh;
}

#buttons {
  display: flex;
  justify-content: space-between;
}

#connect {
  background: linear-gradient(110deg, #f7ffff, #8edbfd, #f85a02);
}

#profile {
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
</style>
