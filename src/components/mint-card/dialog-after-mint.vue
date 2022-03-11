<script setup lang="ts">
import { ref } from 'vue'
import util from '@/common/utils/common-util'

let bodyStyle = {
  width: '600px',
}

defineProps({
  tokenId: Number,
})

let showDialog = ref(false)

function show() {
  showDialog.value = true
}

function hide() {
  showDialog.value = false
}

defineExpose({
  show,
  hide,
})
</script>
<template>
  <n-modal
    v-model:show="showDialog"
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
        class="cancle"
        style="flex-basis: 100; flex-grow: 1; margin-right: 16px"
        @click="showDialog = false"
      >
        Countiun Mint
      </n-button>
      <n-button
        class="confirm"
        style="flex-basis: 150; flex-grow: 2"
        type="primary"
        @click="
          util.openLink(
            `https://opensea.io/assets/0x842864f1cd1491b77a404b0e30aac2b67b2c647b/${tokenId}`
          )
        "
        >Go OpenSea</n-button
      >
    </div>
  </n-modal>
</template>
