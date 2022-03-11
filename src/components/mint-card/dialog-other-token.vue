<script setup lang="ts">
import { ref } from 'vue'
import { NModal, NButton, NInput } from 'naive-ui'

let bodyStyle = {
  width: '600px',
}
let showDialog = ref(false)
let address = ref('')
let searching = ref(false)

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
    :title="$t('nft_item.send.title')"
    size="huge"
    :bordered="false"
  >
    <n-input
      v-model:value="address"
      placeholder="Address/ENS"
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
        @click="showDialog = false"
        >{{ $t('cancle') }}</n-button
      >
      <n-button
        class="confirm"
        color="#F85A02"
        round
        text-color="#fff"
        type="primary"
        @click="showDialog = true"
        >{{ $t('nft_item.send.button') }}</n-button
      >
    </div>
  </n-modal>
</template>
