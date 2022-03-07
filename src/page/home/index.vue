<template>
  <n-layout>
    <n-layout-header>
      <top-bar ref="connect" />
    </n-layout-header>
    <n-layout-content id="mint-app">
      <n-space vertical>
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
          @before-upload="checkImage"
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
        <div style="display: flex; flex-direction: row; align-items: center">
          <n-input
            v-model:value="price"
            type="text"
            maxlength="8"
            :placeholder="$t('home.input.placeholder_2')"
            style="width: 100%; margin-right: 0"
          ></n-input>
          <n-image width="25" height="25" preview-disabled src="/img/eth.png" />
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
                :min="1"
                :max="100"
                :placeholder="$t('home.input.placeholder_3')"
              />
            </div>
          </n-collapse-item>
        </n-collapse>
        <n-button
          :loading="mintIng"
          type="primary"
          :style="{ width: '100%' }"
          @click="mint"
        >
          {{ $t('home.mint_now') }}
        </n-button>
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/runtime-dom'
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
  UploadFileInfo,
} from 'naive-ui'
import { useStore } from '@/store'

import { useEthers, useWallet } from 'vue-dapp'
import { BigNumber, ethers } from 'ethers'
import { Api } from '@/utils/net'
import Constants from '@/common/constants'
import i18n from '@/i18n'

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
    let connect = ref()

    let imageHash = ref('')
    let mintIng = ref(false)
    let name = ref('')
    let price = ref('')
    let amount = ref(1)
    let bulk = ref(false)

    let jsonUrl = ref('')
    let uploadSuccess = ref(false)

    function mint() {
      if (!uploadSuccess.value) {
        message.error(i18n.global.t('error.please_upload_image'))
        return
      }
      mintIng.value = true
      // 上传 json
      Api.uploadJson({
        name: name.value,
        description: name.value,
        image: `https://gateway.pinata.cloud/ipfs/${imageHash.value}`,
        attributes: [
          {
            trait_type: 'castable_value',
            value: ethers.utils.parseEther(price.value).toString(),
          },
        ],
      })
        .then((res: any) => {
          console.log(res)
          jsonUrl.value = `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`
          if (bulk.value) {
            mintMultiple()
          } else {
            mintSingle()
          }
        })
        .catch((err: any) => {
          console.log(err)
          message.error(i18n.global.t('error.upload_image_error'))
          mintIng.value = false
        })
    }

    function mintSingle() {
      if (signer.value !== null) {
        let trueSigner = signer.value

        let contract = new ethers.Contract(
          Constants.CONTRACT_ADDRESS,
          Constants.CONTRACT_ABI,
          signer.value
        )

        contract.estimateGas
          .mint(jsonUrl.value, 0, {
            value: ethers.utils.parseEther(price.value),
          })
          .then((gas) => {
            let contractWithSigner = contract!!.connect(trueSigner)
            contractWithSigner
              .mint(jsonUrl.value, 0, {
                gasLimit: gas.add(BigNumber.from(1552481)),
                value: ethers.utils.parseEther(price.value),
              })
              .then(function (tx: any) {
                console.log(tx)
                message.success(i18n.global.t('sucess.mint_success'))
                mintIng.value = false
              })
              .catch((err: Error) => {
                message.error(err.message)
                mintIng.value = false
              })
          })
      } else {
        message.error(i18n.global.t('error.please_connect_web3'))
        connect?.value?.connectWeb3()
        mintIng.value = false
      }
    }

    function mintMultiple() {
      if (!isInteger(amount.value)) {
        message.error(i18n.global.t('error.please_input_integer'))
        return
      }
      if (signer.value !== null) {
        if (!uploadSuccess.value) {
          message.error(i18n.global.t('error.please_upload_image'))
          return
        }
        let trueSigner = signer.value

        let contract = new ethers.Contract(
          Constants.CONTRACT_ADDRESS,
          Constants.CONTRACT_ABI,
          signer.value
        )
        contract.estimateGas
          .mintAvg(jsonUrl.value, amount.value, 0, {
            value: ethers.utils.parseEther(
              (parseFloat(price.value) * amount.value).toString()
            ),
          })
          .then((gas) => {
            let contractWithSigner = contract!!.connect(trueSigner)
            contractWithSigner
              .mintAvg(jsonUrl.value, amount.value, 0, {
                gasLimit: gas.add(BigNumber.from(1552481)),
                value: ethers.utils.parseEther(
                  (parseFloat(price.value) * amount.value).toString()
                ),
              })
              .then(function (tx: any) {
                console.log(tx)
                message.success(i18n.global.t('sucess.multiple_mint_success'))
                mintIng.value = false
              })
              .catch((err: Error) => {
                console.log(err.message)
                message.error(err.message)
                mintIng.value = false
              })
          })
      } else {
        message.error(i18n.global.t('error.please_connect_web3'))
        mintIng.value = false
        connect?.value?.connectWeb3()
      }
    }

    function isInteger(obj: any) {
      return Math.floor(obj) === obj
    }

    async function checkImage(data: {
      file: UploadFileInfo
      fileList: UploadFileInfo[]
    }) {
      if (data.file.file !== undefined && data.file.file !== null) {
        if (
          data.file.file.type !== 'image/jpeg' &&
          data.file.file.type !== 'image/png'
        ) {
          message.error(i18n.global.t('error.not_image'))
          return false
        }
        if (data.file.file.size > 1024 * 1024 * 1) {
          message.error(i18n.global.t('error.image_big'))
          return false
        }
      }
      return true
    }

    // 传图，注意 uploadSuccess 数据
    function upload(options: UploadCustomRequestOptions) {
      message.loading(i18n.global.t('loading.upload_image_loading'), {
        duration: 0,
      })
      uploadSuccess.value = false
      let file = options.file
      if (file.file !== null && file.file !== undefined) {
        // 上传图片
        Api.uploadFile(file.file)
          .then((res: any) => {
            message.destroyAll()
            message.success(i18n.global.t('sucess.upload_image_success'))
            uploadSuccess.value = true
            imageHash.value = res.IpfsHash
            options.onFinish()
          })
          .catch((err: any) => {
            console.log(err)
            options.onError()
            uploadSuccess.value = false
            message.destroyAll()
            message.error(i18n.global.t('error.upload_image_error'))
            options.onError()
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
      bulk,
      mint,
      upload,
      connect,
      mintIng,
      checkImage,
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
