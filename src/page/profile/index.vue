<template>
  <n-layout>
    <n-layout-header>
      <top-bar />
    </n-layout-header>
    <n-layout-content
      content-style="padding-left: 5vw; padding-right: 5vw; padding-bottom: 5vh"
    >
      <n-spin :show="nftListLoading">
        <div id="nftcard">
          <NFTItem
            v-for="(item, index) in testData"
            @refresh="refreshNftList"
            :key="index"
            :tokenId="item.tokenId"
            :imageUrl="item.imageUrl"
            :title="item.title"
            :price="item.price"
          ></NFTItem>
        </div>
      </n-spin>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/runtime-dom'
import TopBar from '@/components/topbar.vue'
import { NLayout, NLayoutHeader, NLayoutContent, NSpace, NSpin } from 'naive-ui'
import NFTItem, { NFTItemProps } from '@/components/nft-item.vue'
import { useStore } from '@/store'
import { Api } from '@/common/utils/net'
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
    NSpin,
  },

  setup() {
    const store = useStore()
    const { signer } = useEthers()

    let nftListLoading = ref(false)
    let testData = ref(Array<NFTItemProps>())

    onMounted(() => {
      getAllNft()
      nftListLoading.value = true
    })

    function refreshNftList(bool: boolean) {
      if (bool) {
        getAllNft()
      }
    }

    function getAllNft() {
      // 检测缓存
      if (store.state.nftList !== undefined) {
        testData.value = store.state.nftList
      }
      if (signer.value !== null) {
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
                tokenId: element.id,
                imageUrl: `https://cloudflare-ipfs.com/ipfs${element.info.image.substring(
                  element.info.image.lastIndexOf('/'),
                  element.info.image.length
                )}`,
                title: element.info.name,
                price: element.value.toString(),
              })
            })
            testData.value = tempList
            store.commit('setNftList', tempList)
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            nftListLoading.value = false
          })
      }
    }

    return {
      testData,
      refreshNftList,
      nftListLoading,
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
