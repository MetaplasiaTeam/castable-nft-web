<template>
  <n-layout>
    <n-layout-header>
      <top-bar />
    </n-layout-header>
    <n-layout-content id="mint-app">
      <n-space vertical>
        {{ store.state.web3address }}
        <n-space justify="center" :style="{ alignItems: 'flex-end' }">
          <div>
            <a style="font-size: 2rem; font-weight: bold">{{
              $t('home.title')
            }}</a>
            <a>{{ $t('home.subtitle') }}</a>
          </div>
        </n-space>
        <div style="display: flex; flex-direction: row; align-items: center">
          <n-input
            v-model:value="name"
            type="text"
            :placeholder="$t('home.input.placeholder')"
            autosize
            style="width: 100%; margin-right: 0"
          />
          <a :style="{ 'font-weight': 'bold' }">#</a>
          <a style="white-space: nowrap">{{ $t('home.token_id') }}</a>
        </div>
        <n-upload
          :custom-request="upload"
          :show-file-list="true"
          list-type="image"
          :max="1"
        >
          <n-upload-dragger>
            <div style="width: 100%; margin-right: 0">
              {{ $t('home.upload') }}
            </div>
          </n-upload-dragger>
        </n-upload>
        <div style="display: flex; flex-direction: row">
          <n-input
            v-model:value="price"
            type="text"
            :placeholder="$t('home.input.placeholder_2')"
            style="width: 100%; margin-right: 0"
          ></n-input>
          <n-image width="25" height="25" preview-disabled src="@/eth.png" />
        </div>
        <n-collapse arrow-placement="right">
          <n-collapse-item :title="$t('home.advance_option')">
            <div style="display: flex; flex-direction: column">
              <n-checkbox
                v-model:checked="bulk"
                :style="{ 'margin-bottom': '16px' }"
                >{{ $t('home.batch_mint') }}</n-checkbox
              >
              <n-input-number
                :disabled="!bulk"
                v-model:value="amount"
                :placeholder="$t('home.input.placeholder_3')"
              />
            </div>
          </n-collapse-item>
        </n-collapse>
        <n-button type="primary" :style="{ width: '100%' }" @click="mint">
          {{ $t('home.mint_now') }}
        </n-button>
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-dom'
import TopBar from '@/components/topbar.vue'
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
  UploadCustomRequestOptions,
  useMessage,
} from 'naive-ui'
import { useStore } from '@/store'

import { useEthers, useWallet } from 'vue-dapp'
import { ethers } from 'ethers'
import { Api } from '@/utils/net'
import Constants from '@/common/constants'

export default defineComponent({
  name: 'home-page',
  components: {
    TopBar,
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
    const message = useMessage()
    const store = useStore()
    const { signer } = useEthers()

    let name = ref('')
    let price = ref('')
    let amount = ref(0)

    let jsonUrl = ref('')
    let uploadSuccess = ref(false)

    const mint = () => {
      console.log(store.state.nftContract)
      if (!uploadSuccess.value) {
        // TODO: i18n
        message.error('请先上传图片或等待图片上传完成')
        return
      }

      // let contract = store.state.nftContract
      if (signer.value !== null) {
        let trueSigner = signer.value

        let contract = new ethers.Contract(
          Constants.CONTRACT_ADDRESS,
          Constants.CONTRACT_ABI,
          signer.value
        )

        contract.estimateGas.createCollectible(jsonUrl.value, 0).then((gas) => {
          let contractWithSigner = contract!!.connect(trueSigner)
          contractWithSigner
            .createCollectible(jsonUrl.value, 0, {
              gasLimit: gas,
              value: ethers.utils.parseEther(price.value),
            })
            .then(function (tx: any) {
              console.log(tx)
            })
        })
      } else {
        message.error('请先连接 Web3')
      }
    }

    // 传图，注意 uploadSuccess 数据
    function upload(options: UploadCustomRequestOptions) {
      uploadSuccess.value = false
      let file = options.file
      if (file.file !== null && file.file !== undefined) {
        // 上传图片
        Api.uploadFile(file.file)
          .then((res: any) => {
            // 上传 json
            Api.uploadJson({
              name: name.value,
              description: name.value,
              image: `https://ipfs.io/ipfs/${res.IpfsHash}`,
              attributes: [],
            })
              .then((res: any) => {
                console.log(res)
                options.onFinish()
                jsonUrl.value = `https://ipfs.io/ipfs/${res.IpfsHash}`
                uploadSuccess.value = true
                message.success('上传成功')
              })
              .catch((err: any) => {
                console.log(err)
                options.onError()
                uploadSuccess.value = false
              })
          })
          .catch((err: any) => {
            console.log(err)
            options.onError()
            uploadSuccess.value = false
          })
      } else {
        options.onError()
        uploadSuccess.value = false
      }
    }

    return {
      name,
      price,
      amount,
      bulk: ref(false),
      store,
      mint,
      upload,
    }
  },
})
</script>

<style>
.n-upload-trigger {
  width: 100%;
}
</style>

<style scoped>
#mint-app {
  padding-left: 20vw;
  padding-right: 20vw;
  padding-bottom: 5vh;
}

@media screen and (width < 768px) {
  #mint-app {
    padding-left: 10vw;
    padding-right: 10vw;
  }
}
</style>
