<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-dom'
import TopBar from '@/components/top-bar/topbar.vue'
import { NLayout, NLayoutHeader, NLayoutContent, NSpace, NSpin } from 'naive-ui'
import { NftItem, NFTItemProps } from '@/components'
import { useStore } from '@/store'
import { Api } from '@/common/utils/net'
import { useEthers } from 'vue-dapp'
import { ethers } from 'ethers'
import Constants from '@/common/constants'

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
</script>

<template>
  <n-layout>
    <n-layout-header>
      <top-bar />
    </n-layout-header>
    <n-layout-content>
      <n-spin :show="nftListLoading">
        <div id="nftdiv">
          <nft-item
            v-for="(item, index) in testData"
            @refresh="refreshNftList"
            :key="index"
            :tokenId="item.tokenId"
            :imageUrl="item.imageUrl"
            :title="item.title"
            :price="item.price"
          ></nft-item>
        </div>
      </n-spin>
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
#nftdiv {
  background-color: var(--color-card-background);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 5vh;
  padding-left: 10vw;
  padding-right: 10vw;
  padding-bottom: 5vh;
  border-radius: 30px;
}

@media screen and (max-width: 1080px) {
  #nftdiv {
    padding-left: 5vw;
    padding-right: 5vw;
  }
}
</style>
