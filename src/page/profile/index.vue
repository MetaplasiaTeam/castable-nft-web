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
          :totalSupply="item.totalSupply"
          :mintTime="item.mintTime"
        ></NFTItem>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-dom'
import TopBar from '@/components/topbar.vue'
import { NLayout, NLayoutHeader, NLayoutContent, NSpace } from 'naive-ui'
import NFTItem, { NFTItemProps } from '@/components/nft-item.vue'

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
    let testData = Array<NFTItemProps>(
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      },
      {
        imageUrl:
          'https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/93/d5/90/93d5907a8d5a419fa6da19c8492b9111/images/profile/u20.png?token=6a0019ba5389bc1b5d3b27eeb71817470daacc4288515cfda7d3a2d799423145&pageId=3389ab7c-335f-48f9-a1b6-43916d4b7478',
        title: 'test',
        price: '0.01',
        totalSupply: '100',
        mintTime: '2019-01-01',
      }
    )

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
  justify-content: center;
  padding-top: 5vh;
  padding-bottom: 5vh;
  border-radius: 30px;
}
</style>
