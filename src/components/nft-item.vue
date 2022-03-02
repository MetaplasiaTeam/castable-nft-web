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
      <n-image width="200" height="200" :src="imageUrl" />
      <a>{{ title }}</a>
      <a>{{ price }}</a>
    </n-space>
    <div
      style="
        align-self: stretch;
        display: flex;
        justify-content: space-between;
        width: 100%;
      "
    >
      <n-button type="primary" style="width: 40%" @click="showGiveAwayDialog">{{
        $t('nft_item.giveaway')
      }}</n-button>
      <div width="5vw"></div>
      <n-button type="primary" style="width: 40%">{{
        $t('nft_item.burn')
      }}</n-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-dom'
import { NSpace, NImage, NButton, useDialog } from 'naive-ui'

export interface NFTItemProps {
  imageUrl: string
  title: string
  price: string
}

export default defineComponent({
  props: {
    imageUrl: String,
    title: String,
    price: String,
  },
  components: {
    NSpace,
    NImage,
    NButton,
  },

  setup() {
    const giveAwayDialog = useDialog()
    function showGiveAwayDialog() {
      giveAwayDialog.success({
        title: '成功',
        content: '厉害',
        positiveText: '哇',
        onPositiveClick: () => {
          console.log('耶！')
        },
      })
    }
    return {
      showGiveAwayDialog,
    }
  },
})
</script>

<style scoped></style>
