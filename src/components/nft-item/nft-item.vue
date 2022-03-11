<script setup lang="ts">
import NftImage from './nft-img.vue'
import { NButton } from 'naive-ui'
import { defineComponent, ref, onMounted } from 'vue'
import commonUtil from '@/common/utils/common-util'
import ERC20Util from '@/common/utils/erc20'
import DialogSend from './dialog-send.vue'
import DialogBurn from './dialog-burn.vue'

let props = defineProps({
  tokenId: Number,
  imageUrl: String,
  addr: String,
  title: String,
  price: String,
})

defineComponent({
  name: 'nft-item',
})

let sendDialog = ref<any>(null)
let burnDialog = ref<any>(null)

let symbol = ref('ETH')
let value = ref(0)

onMounted(() => {
  if (props.addr !== undefined && props.price !== undefined) {
    let _symbol = ERC20Util.getSymbol(props.addr)
    let _decimal = ERC20Util.getDecimals(props.addr)
    if (_symbol !== undefined) {
      symbol.value = _symbol
    } else {
      ERC20Util.searchToken(props.addr).then((res) => {
        symbol.value = res.symbol
      })
    }
    if (_decimal !== undefined) {
      value.value = parseFloat(
        (parseFloat(props.price) / Math.pow(10, _decimal)).toFixed(5)
      )
    } else {
      ERC20Util.searchToken(props.addr).then((res) => {
        value.value = parseFloat(
          (parseFloat(props.price!) / Math.pow(10, res.decimals)).toFixed(5)
        )
      })
    }
  }
})

function toInfo() {
  commonUtil.openLink(
    `https://etherscan.io/nft/0x842864f1cd1491b77a404b0e30aac2b67b2c647b/${props.tokenId}`
  )
}
</script>

<template>
  <div id="nft-card">
    <nft-image @click="toInfo" :image-url="imageUrl" />
    <div id="content">
      <a>{{ title }}#{{ tokenId?.toString() }}</a>
      <a>Prize</a>
      <a>{{ value }} {{ symbol }}</a>
    </div>
    <div id="buttons">
      <n-button
        id="giveaway"
        color="#E1E4E6"
        ghost
        text-color="#000"
        round
        @click="sendDialog.show()"
        >{{ $t('nft_item.giveaway') }}</n-button
      >
      <n-button
        id="burn"
        color="#F85A02"
        round
        text-color="#fff"
        type="primary"
        @click="burnDialog.show()"
        >{{ $t('nft_item.burn') }}</n-button
      >
    </div>
  </div>
  <dialog-send ref="sendDialog" :token-id="tokenId" />
  <dialog-burn
    ref="burnDialog"
    :token-id="tokenId"
    :value="value"
    :symbol="symbol"
  />
</template>

<style scoped>
#nft-card {
  border-radius: 25px;
  border-style: solid;
  border-width: 0.5px;
  border-color: #e1e4e6;
  margin-bottom: 32px;
  margin-right: 32px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02),
    0 4px 8px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.02),
    0 16px 32px rgba(0, 0, 0, 0.02), 0 32px 64px rgba(0, 0, 0, 0.02);
}

#content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 16px;
}

#buttons {
  align-self: stretch;
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-bottom: 16px;
}

#giveaway {
  width: 40%;
  color: var(--color-text);
}

#burn {
  width: 40%;
}
</style>
