<script setup lang="ts">
import NftImage from './nft-img.vue'
import { NButton, NModal, NInput, useMessage } from 'naive-ui'
import { defineEmits, defineComponent, ref } from 'vue'
import { useEthers } from 'vue-dapp'
import i18n from '@/i18n'
import { ethers } from 'ethers'
import Constants from '@/common/constants'

let props = defineProps({
  tokenId: Number,
  imageUrl: String,
  title: String,
  price: String,
})

defineComponent({
  name: 'nft-item',
})

let bodyStyle = {
  width: '600px',
}

const { signer, address, provider } = useEthers()
const message = useMessage()
const emit = defineEmits<{
  (e: 'refresh', b: boolean): void
}>()

let showGiveAwayDialog = ref(false)
let showBurnDialog = ref(false)

let friendAddress = ref('')

let sending = ref(false)
let burndialog = ref(false)

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

    let trueSigner = signer.value

    let contract = new ethers.Contract(
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
        let contractWithSigner = contract!!.connect(trueSigner)
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
            showGiveAwayDialog.value = false
            sending.value = false
            emit('refresh', true)
          })
          .catch((err: Error) => {
            message.error(err.message)
            sending.value = false
          })
      })
  }
}

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
          .then((res: any) => {
            message.success(i18n.global.t('sucess.burn_success'))
            showBurnDialog.value = false
            burndialog.value = false
            emit('refresh', true)
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
</script>

<template>
  <div id="nft-card">
    <nft-image :image-url="imageUrl" />
    <div id="content">
      <a>{{ title }}#{{ tokenId?.toString() }}</a>
      <a>Prize</a>
      <a>{{ price }} ETH</a>
    </div>
    <div id="buttons">
      <n-button
        id="giveaway"
        color="#E1E4E6"
        ghost
        text-color="#000"
        round
        @click="showGiveAwayDialog = true"
        >{{ $t('nft_item.giveaway') }}</n-button
      >
      <n-button
        id="burn"
        color="#F85A02"
        round
        text-color="#fff"
        type="primary"
        @click="showBurnDialog = true"
        >{{ $t('nft_item.burn') }}</n-button
      >
    </div>
  </div>
  <!-- 赠送对话框 -->
  <n-modal
    v-model:show="showGiveAwayDialog"
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
        id="cancle"
        color="#E1E4E6"
        ghost
        text-color="#000"
        round
        @click="showGiveAwayDialog = false"
        >{{ $t('cancle') }}</n-button
      >
      <n-button
        id="confirm"
        color="#F85A02"
        round
        text-color="#fff"
        type="primary"
        @click="giveaway"
        >{{ $t('nft_item.send.button') }}</n-button
      >
    </div>
  </n-modal>
  <!-- 熔炼对话框 -->
  <n-modal
    v-model:show="showBurnDialog"
    :mask-closable="false"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    :title="$t('nft_item.burn_d.title')"
    size="huge"
    :bordered="false"
  >
    <a>{{ $t('nft_item.burn_d.message1', [price]) }}</a
    ><br />
    <a>{{ $t('nft_item.burn_d.message2', [price]) }}</a>
    <div
      style="
        display: flex;
        flex-direction: row;
        margin-top: 16px;
        justify-content: space-around;
      "
    >
      <n-button
        id="cancle"
        color="#E1E4E6"
        ghost
        round
        :disabled="burndialog"
        @click="showBurnDialog = false"
      >
        {{ $t('cancle') }}</n-button
      >
      <n-button
        id="confirm"
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

#cancle {
  width: 40%;
  margin-right: 16px;
  color: var(--color-text);
}

#confirm {
  width: 60%;
}
</style>
