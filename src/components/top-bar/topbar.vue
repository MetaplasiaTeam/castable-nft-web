<script setup lang="ts">
import { defineExpose, onMounted } from '@vue/runtime-dom'
import buttons from './buttons.vue'
import i18n from '@/i18n'
import { NPopover } from 'naive-ui'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { useBoard, useEthers, useWallet } from 'vue-dapp'
import Constants from '@/common/data/constants'
const { open } = useBoard()
const { disconnect } = useWallet()
const { address, isActivated, signer, provider } = useEthers()
const store = useStore()
const router = useRouter()

onMounted(() => {
  i18n.global.locale = 'en'
})

let language = [
  {
    label: '简体中文',
    key: 'zh-CN',
  },
  {
    label: 'English',
    key: 'en',
  },
]

async function connectWeb3() {
  if (isActivated.value) {
    disconnect()
  } else {
    open()
  }
}

defineExpose({
  connectWeb3,
})

function languageSelect(key: string) {
  i18n.global.locale = key
}
</script>

<template>
  <div id="top-bar-div">
    <router-link to="/"
      ><img style="height: 30px" src="@/assets/img/logo.svg" />
    </router-link>
    <a
      v-if="
        Constants.CONTRACT_ADDRESS ===
        '0xb55C74905572A47DE02167D19687d495Fc2C3F1b'
      "
      style="color: #fff"
      >BSC TEST</a
    >
    <buttons id="nomal-buttons" />
    <n-popover trigger="click">
      <template #trigger>
        <button id="menu" class="nft-button" text-color="#fff">Menu</button>
      </template>
      <buttons />
    </n-popover>
  </div>
</template>

<style scoped>
#top-bar-div {
  display: flex;
  justify-content: space-between;
  padding-top: 4vh;
  padding-left: 15vw;
  padding-right: 15vw;
  padding-bottom: 15vh;
}

#title-left {
  font-size: 2rem;
  font-weight: bold;
  left: 1vw;
  top: 1vh;
}

#menu {
  display: none;
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

#nomal-buttons {
  display: flex;
  justify-content: center;
}

@media screen and (max-height: 900px) {
  #top-bar-div {
    padding-bottom: 4vh;
  }
}

@media screen and (max-width: 768px) {
  #top-bar-div {
    padding-left: 10vw;
    padding-right: 10vw;
  }
}

@media screen and (max-width: 678px) {
  #nomal-buttons {
    display: none;
  }
  #menu {
    display: block;
  }
}
</style>
