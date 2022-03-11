<script setup lang="ts">
import { ref } from 'vue'
import { NModal, NButton, useMessage } from 'naive-ui'
import { useEthers } from 'vue-dapp'
import i18n from '@/i18n'
import { ethers } from 'ethers'
import Constants from '@/common/data/constants'
import emitter from '@/emitter'

const { signer, provider, address } = useEthers()
const message = useMessage()

let props = defineProps({
  tokenId: Number,
  value: Number,
  symbol: String,
})

let bodyStyle = {
  width: '600px',
}
let showDialog = ref(false)
let burndialog = ref(false)

function burn() {
  if (signer.value === null) {
    message.error(i18n.global.t('error.please_connect_web3'))
    return
  }
  burndialog.value = true

  let trueSigner = signer.value

  let contract = new ethers.Contract(
    Constants.CONTRACT_ADDRESS,
    Constants.CONTRACT_ABI,
    signer.value
  )
  contract.estimateGas.burn(props.tokenId).then((gas) => {
    let contractWithSigner = contract!!.connect(trueSigner)
    contractWithSigner
      .burn(props.tokenId, {
        gasLimit: gas,
      })
      .then((tx: any) => {
        console.log(tx)
        tx.wait()
          .then(() => {
            message.success(i18n.global.t('sucess.burn_success'))
            showDialog.value = false
            burndialog.value = false
            emitter.emit('refreshNftList', true)
          })
          .catch((err: Error) => {
            message.error(err.message)
            burndialog.value = false
          })
      })
      .catch((err: Error) => {
        message.error(err.message)
        burndialog.value = false
      })
  })
}

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
    :title="$t('nft_item.burn_d.title')"
    size="huge"
    :bordered="false"
  >
    <a>{{ $t('nft_item.burn_d.message1', [value, symbol]) }}</a
    ><br />
    <a>{{ $t('nft_item.burn_d.message2', [value, symbol]) }}</a>
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
        color="#E1E4E6"
        ghost
        round
        :disabled="burndialog"
        @click="showDialog = false"
      >
        {{ $t('cancle') }}</n-button
      >
      <n-button
        class="confirm"
        color="#F85A02"
        round
        text-color="#fff"
        :loading="burndialog"
        type="primary"
        @click="burn"
        >{{ $t('nft_item.burn') }}</n-button
      >
    </div>
  </n-modal>
</template>
