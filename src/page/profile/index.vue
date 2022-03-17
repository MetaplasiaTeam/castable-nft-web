<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-dom'
import TopBar from '@/components/top-bar/topbar.vue'
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NBackTop,
  NResult,
} from 'naive-ui'
import { NftItem, NFTItemProps, NftItemLoading } from '@/components'
import { useStore } from '@/store'
import { Api } from '@/common/net'
import { useEthers } from 'vue-dapp'
import { ethers } from 'ethers'
import Constants from '@/common/data/constants'
import emitter from '@/emitter'
import IPFSUtil from '@/common/utils/ipfs'

const store = useStore()
const { signer } = useEthers()

let loadError = ref(false)
let nftListData = ref(Array<NFTItemProps>())
let blankData = ref(false)

onMounted(() => {
  getAllNft()
  emitter.on('refreshNftList', (val) => {
    if (val) {
      getAllNft()
    }
  })
})

function getAllNft() {
  // 检测缓存
  if (store.nftList !== undefined) {
    nftListData.value = store.nftList
  }
  loadError.value = false

  if (blankData.value) {
    store.setShowNftSkeleton(true)
    blankData.value = false
  }

  if (signer.value !== null) {
    let contract = new ethers.Contract(
      Constants.CONTRACT_ADDRESS,
      Constants.CONTRACT_ABI,
      signer.value
    )
    Api.getAllNftInfo(contract)
      .then((nftInfoList) => {
        if (nftInfoList.length === 0) {
          blankData.value = true
          store.setShowNftSkeleton(false)
          return
        }
        let tempList: NFTItemProps[] = []
        nftInfoList.forEach((element) => {
          tempList.push({
            tokenId: element.id,
            imageUrl: `https://cloudflare-ipfs.com/ipfs/${IPFSUtil.getHash(
              element.info.image
            )}`,
            addr: element.addr,
            title: element.info.name,
            price: element.value.toString(),
          })
        })
        nftListData.value = tempList
        store.setNftList(tempList)
        store.setShowNftSkeleton(false)
      })
      .catch((err) => {
        console.log(err)
        loadError.value = true
      })
      .finally(() => {})
  }
}
</script>

<template>
  <n-layout>
    <n-layout-header>
      <top-bar />
    </n-layout-header>
    <n-layout-content
      style="
        background-color: var(--color-card-background);
        border-top-left-radius: 25px;
        border-top-right-radius: 25px;
      "
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        "
      >
        <div
          v-if="loadError || blankData"
          id="refresh"
          class="animate__animated animate__pulse"
          @click="getAllNft"
        >
          <i class="fa-solid fa-arrow-rotate-right"></i> Refresh
        </div>
        <n-result
          v-if="blankData"
          style="margin-top: 100px; height: 60vh"
          status="info"
          title="Can't find your NFT"
        >
        </n-result>
        <div id="nftdiv">
          <nft-item-loading
            v-if="store.showNftSkeleton"
            v-for="item in [0, 1, 2, 3, 4, 5]"
            :error="loadError"
            :key="item"
          />
          <nft-item
            v-for="item in nftListData"
            :key="item.title"
            :tokenId="item.tokenId"
            :imageUrl="item.imageUrl"
            :title="item.title"
            :price="item.price"
            :addr="item.addr"
          ></nft-item>
          <n-back-top :right="100" :visibility-height="300"> test </n-back-top>
        </div>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<style scoped lang="scss">
#nftdiv {
  background-color: var(--color-card-background);
  display: flex;
  flex-wrap: wrap;
  padding-top: 5vh;
  padding-left: 10vw;
  padding-right: 10vw;
  padding-bottom: 5vh;
  justify-content: center;
}

#refresh {
  margin-top: 16px;
  border-radius: 25px;
  margin-bottom: 32px;
  width: 20%;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02),
    0 4px 8px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.02),
    0 16px 32px rgba(0, 0, 0, 0.02), 0 32px 64px rgba(0, 0, 0, 0.02);
  &:hover {
    cursor: pointer;
    background-color: var(--color-card-hover);
  }
}

@media screen and (max-width: 1080px) {
  #nftdiv {
    padding-left: 5vw;
    padding-right: 5vw;
  }
}
</style>
