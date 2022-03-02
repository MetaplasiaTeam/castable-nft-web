<template>
  <n-layout>
    <n-layout-header>
      <top-bar />
    </n-layout-header>
    <n-layout-content
      content-style="padding-left: 5vw; padding-right: 5vw; padding-bottom: 5vh"
    >
      <div id="nftcard">
        <NFTItem
          v-for="(item, index) in testData"
          :key="index"
          :imageUrl="item.imageUrl"
          :title="item.title"
          :price="item.price"
        ></NFTItem>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@vue/runtime-dom'
import TopBar from '@/components/topbar.vue'
import { NLayout, NLayoutHeader, NLayoutContent, NSpace } from 'naive-ui'
import NFTItem, { NFTItemProps } from '@/components/nft-item.vue'
import { useStore } from '@/store'
import { Api } from '@/utils/net'
import { useEthers } from 'vue-dapp'
import { ethers } from 'ethers'
import Constants from '@/common/constants'

export default defineComponent({
  components: {
    TopBar,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NSpace,
    NFTItem,
  },

  setup() {
    const store = useStore()
    const { signer } = useEthers()

    let testData = ref(Array<NFTItemProps>())

    onMounted(() => {
      if (signer.value !== null) {
        console.log('profile mounted')
        let contract = new ethers.Contract(
          Constants.CONTRACT_ADDRESS,
          Constants.CONTRACT_ABI,
          signer.value
        )
        Api.getAllNftInfo(contract)
          .then((nftInfoList) => {
            console.log(nftInfoList)
            let tempList: NFTItemProps[] = []
            nftInfoList.forEach((element) => {
              tempList.push({
                imageUrl: element.info.image,
                title: element.info.name,
                price: element.value.toString(),
              })
            })
            testData.value = tempList
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })

    return {
      testData,
    }
  },
})
</script>

<style scoped>
#nftcard {
  background-color: var(--color-card-background);
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  padding-top: 5vh;
  padding-left: 2vw;
  padding-bottom: 5vh;
  border-radius: 30px;
}
</style>
