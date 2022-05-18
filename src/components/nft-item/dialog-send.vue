<script setup lang="ts">
import { ref } from 'vue'
import { NModal, NButton, NInput, useMessage } from 'naive-ui'
import { useEthers } from 'vue-dapp'
import i18n from '@/i18n'
import { ethers } from 'ethers'
import Constants from '@/common/data/constants'
import emitter from '@/emitter'

const { signer, provider, address } = useEthers()
const message = useMessage()

const bodyStyle = {
  width: '600px',
}
const showDialog = ref(false)
const friendAddress = ref('')
const sending = ref(false)

const props = defineProps({
  tokenId: Number,
})

async function giveaway() {
  if (signer.value === null) {
    message.error(i18n.global.t('error.please_connect_web3'))
    return
  }
  if (friendAddress.value && provider.value !== null) {
    let sendAddress: string | null = ''
    if (friendAddress.value.endsWith('.eth')) {
      sendAddress = await provider.value.resolveName(friendAddress.value)
    } else if (friendAddress.value.startsWith('0x')) {
      sendAddress = friendAddress.value
    } else {
      message.error(i18n.global.t('error.input_error'))
      return
    }
    if (sendAddress === null) {
      message.error(i18n.global.t('error.input_error'))
      return
    }

    sending.value = true

    const trueSigner = signer.value

    const contract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      signer.value
    )
    contract.estimateGas
      .safeTransferFrom(
        ethers.utils.getAddress(address.value),
        ethers.utils.getAddress(friendAddress.value),
        props.tokenId
      )
      .then((gas) => {
        // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
        const contractWithSigner = contract!!.connect(trueSigner)
        contractWithSigner
          .safeTransferFrom(
            ethers.utils.getAddress(address.value),
            ethers.utils.getAddress(friendAddress.value),
            props.tokenId,
            {
              gasLimit: gas,
            }
          )
          .then((tx: any) => {
            console.log(tx)
            message.success(i18n.global.t('sucess.send_success'))
            showDialog.value = false
            sending.value = false
            emitter.emit('refreshNftList', true)
          })
          .catch((err: Error) => {
            message.error(err.message)
            sending.value = false
          })
      })
  }
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
    :title="$t('nft_item.send.title')"
    size="huge"
    :bordered="false"
  >
    <n-input
      v-model:value="friendAddress"
      placeholder="Address/ENS"
      :disabled="sending"
    />
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
        text-color="#000"
        round
        @click="showDialog = false"
        >{{ $t('cancle') }}</n-button
      >
      <n-button
        class="confirm"
        color="#F85A02"
        round
        text-color="#fff"
        type="primary"
        @click="giveaway"
        >{{ $t('nft_item.send.button') }}</n-button
      >
    </div>
  </n-modal>
</template>
