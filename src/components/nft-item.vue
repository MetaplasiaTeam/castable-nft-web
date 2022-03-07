<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      margin-left: 1vw;
      margin-right: 1vw;
      margin-bottom: 2vh;
    "
  >
    <n-space vertical align="start">
      <n-image width="200" :src="imageUrl" preview-disabled @click="toInfo" />
      <a>{{ title }}#{{ tokenId?.toString() }}</a>
      <a>{{ price }} ETH</a>
    </n-space>
    <div
      style="
        align-self: stretch;
        display: flex;
        justify-content: space-between;
        width: 100%;
      "
    >
      <n-button
        color="#8FDBFD"
        type="primary"
        style="width: 40%"
        @click="showGiveAwayDialog = true"
        >{{ $t('nft_item.giveaway') }}</n-button
      >
      <div width="5vw"></div>
      <n-button
        color="#8FDBFD"
        type="primary"
        style="width: 40%"
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
        color="#8FDBFD"
        style="flex-basis: 100; flex-grow: 1; margin-right: 16px"
        :disabled="sending"
        @click="showGiveAwayDialog = false"
      >
        {{ $t('cancle') }}</n-button
      >
      <n-button
        color="#8FDBFD"
        style="flex-basis: 150; flex-grow: 2"
        :loading="sending"
        type="primary"
        @click="send"
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
        color="#8FDBFD"
        style="flex-basis: 100; flex-grow: 1; margin-right: 16px"
        :disabled="burndialog"
        @click="showBurnDialog = false"
      >
        {{ $t('cancle') }}</n-button
      >
      <n-button
        color="#8FDBFD"
        style="flex-basis: 150; flex-grow: 2"
        :loading="burndialog"
        type="primary"
        @click="burn"
        >{{ $t('nft_item.burn') }}</n-button
      >
    </div>
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-dom'
import { NSpace, NImage, NButton, NModal, NInput, useMessage } from 'naive-ui'
import { useEthers, useWallet } from 'vue-dapp'
import { BigNumber, ethers } from 'ethers'
import Constants from '@/common/constants'
import i18n from '@/i18n'

export interface NFTItemProps {
  tokenId: number
  imageUrl: string
  title: string
  price: string
}

export default defineComponent({
  props: {
    tokenId: Number,
    imageUrl: String,
    title: String,
    price: String,
  },
  components: {
    NSpace,
    NImage,
    NButton,
    NModal,
    NInput,
  },

  setup(props, context) {
    const { signer, address } = useEthers()
    const message = useMessage()
    let showGiveAwayDialog = ref(false)
    let showBurnDialog = ref(false)

    let sending = ref(false)
    let burndialog = ref(false)

    let friendAddress = ref('')

    function send() {
      if (signer.value === null) {
        message.error(i18n.global.t('error.please_connect_web3'))
        return
      }
      if (friendAddress.value) {
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
                context.emit('refresh', true)
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
      sending.value = true

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
            message.success(i18n.global.t('sucess.burn_success'))
            showBurnDialog.value = false
            burndialog.value = false
            context.emit('refresh', true)
          })
          .catch((err: Error) => {
            message.error(err.message)
            burndialog.value = false
          })
      })
    }

    function toInfo() {
      window.open(
        `https://etherscan.io/nft/0x842864f1cd1491b77a404b0e30aac2b67b2c647b/${props.tokenId}`,
        '_blank'
      )
    }

    return {
      showGiveAwayDialog,
      showBurnDialog,
      bodyStyle: {
        width: '600px',
      },
      segmented: {
        content: 'soft',
        footer: 'soft',
      } as const,
      send,
      burn,
      friendAddress,
      sending,
      burndialog,
      toInfo,
    }
  },
})
</script>

<style scoped></style>
