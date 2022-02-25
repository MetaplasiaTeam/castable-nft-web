<template>
  <n-layout>
    <n-layout-header style="display: flex">
      <div id="title-left">CastableNFT</div>
    </n-layout-header>
    <n-layout-content
      content-style="padding-left: 20vw; padding-right: 20vw; padding-bottom: 5vh"
    >
      <n-space vertical>
        <n-space justify="center" :style="{ alignItems: 'flex-end' }">
          <a style="font-size: 2rem; font-weight: bold">铸造</a>
          <a>创造有价值的 NFT</a>
        </n-space>
        <div style="display: flex; flex-direction: row; align-items: center">
          <n-input
            v-model:value="value"
            type="text"
            placeholder="自定义一个NFT名称(支持中文/英文/数字)"
            autosize
            style="width: 100%; margin-right: 0"
          />
          <a :style="{ 'font-weight': 'bold' }">#</a>
          <a style="white-space: nowrap">Token ID 由合约生成</a>
        </div>
        <n-upload>
          <n-upload-dragger>
            <div style="width: 100%; margin-right: 0">
              + 上传一张图片，请小于 5M
            </div>
          </n-upload-dragger>
        </n-upload>
        <div style="display: flex; flex-direction: row">
          <n-input
            v-model:value="value"
            type="text"
            placeholder="铸造价值最低0.002 ETH起/个"
            style="width: 100%; margin-right: 0"
          ></n-input>
          <n-image
            width="25"
            height="25"
            preview-disabled
            src="https://d1icd6shlvmxi6.cloudfront.net/gsc/NWITZV/3a/43/a8/3a43a8183c0b4081abd04453fd9efe43/images/%E9%A6%96%E9%A1%B5/u19.png?token=6247d332ced8e4adad5ae608650c35160b1ee65dc42c50a0696b5aa7e1134137&pageId=2106dce6-9473-4bc3-b73c-ef7ba1cf9b57"
          />
        </div>
        <!-- <n-button @click="open"> 测试 </n-button>
        {{ address }}
        <vdapp-board /> -->
        <n-collapse arrow-placement="right">
          <n-collapse-item title="高级选项">
            <div style="display: flex; flex-direction: column">
              <n-checkbox
                v-model:checked="bulk"
                :style="{ 'margin-bottom': '16px' }"
                >进行批量铸造</n-checkbox
              >
              <n-input-number :disabled="!bulk" placeholder="发行总量" />
            </div>
          </n-collapse-item>
        </n-collapse>
        <n-button type="primary" :style="{ width: '100%' }">
          现在铸造
        </n-button>
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-dom'
import {
  NInput,
  NSpace,
  NUpload,
  NUploadDragger,
  NImage,
  NButton,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NCollapse,
  NCollapseItem,
  NCheckbox,
  NInputNumber,
} from 'naive-ui'

// import { useBoard, useEthers } from 'vue-dapp'

export default defineComponent({
  name: 'home-page',
  components: {
    NInput,
    NSpace,
    NUpload,
    NUploadDragger,
    NImage,
    NButton,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NCollapse,
    NCollapseItem,
    NCheckbox,
    NInputNumber,
  },
  setup() {
    // const { open } = useBoard()
    // const { address } = useEthers()

    return {
      value: ref(null),
      bulk: ref(false),
      // address,
      // open,
    }
  },
})
</script>

<style>
.n-upload-trigger {
  width: 100%;
}
.n-layout-header,
.n-layout-footer {
  /* background: rgba(128, 128, 128, 0.2); */
  padding: 24px;
}
/* 
.n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
}

.n-layout-content {
  background: rgba(128, 128, 128, 0.4);
} */
</style>

<style scoped>
#search-app {
  margin-top: 20vh;
  display: block;
  padding-left: 20vw;
  padding-right: 20vw;
}

@media screen and (max-width: 768px) {
  #search-app {
    padding-left: 5vw;
    padding-right: 5vw;
  }
}

#title-left {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-text);
  left: 1vw;
  top: 1vh;
}
</style>
