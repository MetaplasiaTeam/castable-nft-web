<script lang="ts">
import { defineComponent, ref } from 'vue'
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
  NLayoutFooter,
  NModal,
  UploadCustomRequestOptions,
  useMessage,
  UploadFileInfo,
} from 'naive-ui'
import { useEthers } from 'vue-dapp'
import { BigNumber, ethers } from 'ethers'
import { Api } from '@/common/utils/net'
import Constants from '@/common/constants'
import i18n from '@/i18n'
import util from '@/common/utils/common-util'

export default defineComponent({
  name: 'mint-card',
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
    NLayoutFooter,
    NModal,
  },
  setup() {
    let message = useMessage()
    const { signer } = useEthers()

    let imageHash = ref('')
    let nftName = ref('')
    let nftPrice = ref('')
    let jsonUrl = ref('')

    let amount = ref(1)
    let lastTokenId = ref(0)

    let mintIng = ref(false)
    let bulk = ref(false)
    let uploadSuccess = ref(false)

    let afterMintDialog = ref(false)

    function mint() {
      if (!uploadSuccess.value) {
        message.error(i18n.global.t('error.please_upload_image'))
        return
      }
      mintIng.value = true
      // 开始上传 JSON
      Api.uploadJson({
        name: nftName.value,
        description: nftName.value,
        image: `https://cloudflare-ipfs.com/ipfs/${imageHash.value}`,
        attributes: [
          {
            trait_type: 'castable_value',
            value: ethers.utils.parseEther(nftPrice.value).toString(),
          },
        ],
      })
        .then((res: any) => {
          console.log(res)
          jsonUrl.value = `https://cloudflare-ipfs.com/ipfs/${res.IpfsHash}`
          if (bulk.value) {
            // 铸造多个
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

    // 铸造单个
    function mintSingle() {
      if (signer.value === null) {
        message.error(i18n.global.t('error.please_connect_web3'))
        // connect?.value?.connectWeb3()
        mintIng.value = false
        return
      }
      let contract = new ethers.Contract(
        Constants.CONTRACT_ADDRESS,
        Constants.CONTRACT_ABI,
        signer.value
      )
      let mySigner = signer.value

      contract.estimateGas
        .mint(jsonUrl.value, 0, {
          value: ethers.utils.parseEther(nftPrice.value),
        })
        .then((gas) => {
          let contractWithSigner = contract!!.connect(mySigner)
          contractWithSigner
            .mint(jsonUrl.value, 0, {
              gasLimit: gas.add(BigNumber.from(10000)),
              value: ethers.utils.parseEther(nftPrice.value),
            })
            .then((tx: any) => {
              // 等待链上执行完成
              tx.wait()
                .then((res: any) => {
                  lastTokenId.value = parseInt(
                    (res.events[0].args[2] as BigNumber).toString()
                  )
                  message.success(i18n.global.t('sucess.mint_success'))
                  afterMintDialog.value = true
                  mintIng.value = false
                })
                .catch((err: Error) => {
                  message.error(err.message)
                  mintIng.value = false
                })
            })
            .catch((err: Error) => {
              message.error(err.message)
              mintIng.value = false
            })
        })
    }

    // 铸造多个
    function mintMultiple() {
      if (signer.value === null) {
        message.error(i18n.global.t('error.please_connect_web3'))
        // connect?.value?.connectWeb3()
        mintIng.value = false
        return
      }
      let contract = new ethers.Contract(
        Constants.CONTRACT_ADDRESS,
        Constants.CONTRACT_ABI,
        signer.value
      )
      let mySigner = signer.value

      contract.estimateGas
        .mintAvg(jsonUrl.value, amount.value, 0, {
          value: ethers.utils.parseEther(nftPrice.value),
        })
        .then((gas) => {
          let contractWithSigner = contract!!.connect(mySigner)
          contractWithSigner
            .mint(jsonUrl.value, amount.value, 0, {
              gasLimit: gas.add(BigNumber.from(10000)),
              value: ethers.utils.parseEther(nftPrice.value),
            })
            .then((tx: any) => {
              // 等待链上执行完成
              tx.wait()
                .then((res: any) => {
                  lastTokenId.value = parseInt(
                    (res.events[0].args[2] as BigNumber).toString()
                  )
                  message.success(i18n.global.t('sucess.mint_success'))
                  afterMintDialog.value = true
                  mintIng.value = false
                })
                .catch((err: Error) => {
                  message.error(err.message)
                  mintIng.value = false
                })
            })
            .catch((err: Error) => {
              message.error(err.message)
              mintIng.value = false
            })
        })
    }

    async function checkImage(data: {
      file: UploadFileInfo
      fileList: UploadFileInfo[]
    }) {
      if (data.file.file !== undefined && data.file.file !== null) {
        if (
          data.file.file.type !== 'image/jpeg' &&
          data.file.file.type !== 'image/png' &&
          data.file.file.type !== 'image/gif'
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
    function uploadImage(options: UploadCustomRequestOptions) {
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
      nftName,
      nftPrice,
      amount,
      bulk,
      mintIng,
      afterMintDialog,
      lastTokenId,
      util,
      mint,
      uploadImage,
      checkImage,
    }
  },
})
</script>

<template>
  <div id="mint-card">
    <div id="left">
      <div id="title-div">
        <a id="title">{{ $t('home.title') }}</a>
        <a>{{ $t('home.subtitle') }}</a>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <n-input
          v-model:value="nftName"
          type="text"
          :placeholder="$t('home.input.placeholder')"
          autosize
          style="width: 100%; margin-right: 0"
        />
        <a style="white-space: pre-wrap">{{ $t('home.token_id') }}</a>
      </div>
      <n-upload
        @before-upload="checkImage"
        :custom-request="uploadImage"
        :show-file-list="true"
        list-type="image"
        :style="{ 'margin-top': '40px' }"
        :max="1"
      >
        <n-upload-dragger>
          <div style="width: 100%; margin-right: 0; height: 6vh">
            {{ $t('home.upload') }}
          </div>
        </n-upload-dragger>
      </n-upload>
      <div style="display: flex; flex-direction: row; align-items: center">
        <n-input
          v-model:value="nftPrice"
          type="text"
          maxlength="8"
          :placeholder="$t('home.input.placeholder_2')"
          style="width: 100%; margin-right: 0"
        >
          <template #suffix> ETH </template></n-input
        >
      </div>
      <n-collapse arrow-placement="right" :style="{ 'margin-top': '50px' }">
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
        color="#8FDBFD"
        :loading="mintIng"
        type="primary"
        :style="{
          width: '100%',
          'margin-top': '60px',
          'margin-bottom': '36px',
        }"
        text-color="#000"
        @click="mint"
      >
        {{ $t('home.mint_now') }}
      </n-button>
    </div>
    <div id="right">
      <img width="316" :src="util.getSrc('right.svg')" />
    </div>
  </div>
</template>

<style scoped>
#title-div {
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

#title {
  font-size: 2rem;
  font-weight: bold;
}

#mint-card {
  display: flex;
  flex-direction: row;
  background-color: var(--color-card-background);
  border-radius: 25px;
  padding-left: 64px;
}

#left {
  width: 100%;
  padding-right: 64px;
}

#right {
  width: 500px;
  background-image: linear-gradient(to bottom right, #f7ffff, #8edbfd, #f85a02);
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
  display: flex;
}
</style>
