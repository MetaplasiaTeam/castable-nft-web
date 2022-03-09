<template>
  <n-layout>
    <n-layout-header>
      <top-bar ref="connect" />
    </n-layout-header>
    <n-layout-content id="mint-app">
      <mint-card></mint-card>
    </n-layout-content>
  </n-layout>
  <!-- 铸造完成弹窗 -->
  <!-- <n-modal
    v-model:show="afterMintDialog"
    :mask-closable="false"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    :title="$t('prompt')"
    size="huge"
    :bordered="false"
  >
    <a>Minting, check and trade directly on OpenSea</a>
    <div
      style="
        display: flex;
        flex-direction: row;
        margin-top: 16px;
        justify-content: space-around;
      "
    >
      <n-button
        color="#8FDBFD"
        style="flex-basis: 100; flex-grow: 1; margin-right: 16px"
        @click="afterMintDialog = false"
      >
        Countiun Mint
      </n-button>
      <n-button
        color="#8FDBFD"
        style="flex-basis: 150; flex-grow: 2"
        type="primary"
        @click="
          util.openLink(
            `https://opensea.io/assets/0x842864f1cd1491b77a404b0e30aac2b67b2c647b/${lastTokenId}`
          )
        "
        >Go OpenSea</n-button
      >
    </div>
  </n-modal> -->
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-dom'
import TopBar from '@/components/topbar.vue'
import { MintCard } from '@/components'
import {
  NInput,
  NSpace,
  NUpload,
  NButton,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NModal,
  useMessage,
} from 'naive-ui'
import { useStore } from '@/store'

import { useEthers } from 'vue-dapp'
import util from '@/common/utils/common-util'

export default defineComponent({
  name: 'home-page',
  components: {
    TopBar,
    NInput,
    NSpace,
    NButton,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NModal,
    MintCard,
  },
  setup() {
    const message = useMessage()
    const store = useStore()
    const { signer } = useEthers()

    return {
      bodyStyle: {
        width: '600px',
      },
      util,
    }
  },
})
</script>

<style>
.n-upload-trigger {
  width: 100%;
}
</style>

<style scoped>
#mint-app {
  padding-left: 15vw;
  padding-right: 15vw;
  padding-bottom: 5vh;
}

@media screen and (width < 768px) {
  #mint-app {
    padding-left: 10vw;
    padding-right: 10vw;
  }
}

#link {
  color: #8fdbfd;
  text-decoration: none;
}
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>
