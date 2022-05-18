<script setup lang="ts">
import { ref } from 'vue'
import { NModal, NButton, useMessage } from 'naive-ui'
import { useEthers } from 'vue-dapp'
import i18n from '@/i18n'
import { ethers } from 'ethers'
import Constants from '@/common/data/constants'
import emitter from '@/emitter'

const { signer } = useEthers()
const message = useMessage()

const props = defineProps({
  tokenId: Number,
  value: Number,
  symbol: String,
})

const bodyStyle = {
  width: '600px',
}
const showDialog = ref(false)
const buring = ref(false)

function burn() {
  if (signer.value === null) {
    message.error(i18n.global.t('error.please_connect_web3'))
    return
  }
  buring.value = true

  const trueSigner = signer.value

  const contract = new ethers.Contract(
    Constants.CONTRACT_ADDRESS,
    Constants.CONTRACT_ABI,
    signer.value
  )
  contract.estimateGas.burn(props.tokenId).then((gas) => {
    if (contract === null) {
      return
    }
    const contractWithSigner = contract.connect(trueSigner)
    contractWithSigner
      .burn(props.tokenId, {
        gasLimit: gas,
      })
      .then((tx: any) => {
        tx.wait()
          .then(() => {
            message.success(i18n.global.t('sucess.burn_success'))
            showDialog.value = false
            buring.value = false
            emitter.emit('refreshNftList', true)
          })
          .catch((err: Error) => {
            message.error(err.message)
            buring.value = false
          })
      })
      .catch((err: Error) => {
        message.error(err.message)
        buring.value = false
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
        ghost
        round
        :disabled="buring"
        @click="showDialog = false"
      >
        {{ $t('cancle') }}</n-button
      >
      <n-button
        class="confirm"
        color="#F85A02"
        round
        text-color="#fff"
        :loading="buring"
        type="primary"
        @click="burn"
        >{{ $t('nft_item.burn') }}</n-button
      >
    </div>
  </n-modal>
</template>
