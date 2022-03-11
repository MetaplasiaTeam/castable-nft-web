<script setup lang="ts">
import { ref } from 'vue'
import { NModal, NButton, NInput, useMessage } from 'naive-ui'
import ERC20Util from '@/common/utils/erc20'
import { useEthers } from 'vue-dapp'
import emitter from '@/emitter'
import { useStore } from '@/store'

const { signer } = useEthers()
const message = useMessage()
const store = useStore()

let bodyStyle = {
  width: '600px',
}
let showDialog = ref(false)
let address = ref('')
let searching = ref(false)

function searchContract() {
  searching.value = true
  if (address.value === '' || signer.value === null) {
    searching.value = false
    return
  }
  searching.value = true
  let contract = ERC20Util.getERC20Contract(address.value)?.connect(
    signer.value
  )
  contract
    .name()
    .then(async () => {
      let symbol: string = await contract.symbol()
      let decimals: number = await contract.decimals()
      let otherToken = {
        address: address.value,
        symbol: symbol,
        decimals: decimals,
      }
      emitter.emit('searchContractResult', otherToken)
      store.commit('addNewTokenCache', otherToken)
      searching.value = false
      showDialog.value = false
    })
    .catch((err: Error) => {
      console.log(err.message)
      message.error(err.message)
      searching.value = false
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
  <!-- 赠送对话框 -->
  <n-modal
    v-model:show="showDialog"
    :mask-closable="false"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    :title="$t('cancle')"
    size="huge"
    :bordered="false"
  >
    <n-input
      v-model:value="address"
      placeholder="Token contracts"
      :disabled="searching"
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
        :disabled="searching"
        @click="showDialog = false"
        >{{ $t('cancle') }}</n-button
      >
      <n-button
        class="confirm"
        color="#F85A02"
        round
        :loading="searching"
        text-color="#fff"
        type="primary"
        @click="searchContract"
        >{{ $t('confirm') }}</n-button
      >
    </div>
  </n-modal>
</template>
