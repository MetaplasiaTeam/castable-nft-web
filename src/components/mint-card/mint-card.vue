<script setup lang="ts">
import { Ref, ref } from 'vue'
import {
  NInput,
  NUpload,
  NUploadDragger,
  NButton,
  NCollapse,
  NCollapseItem,
  NCheckbox,
  NInputNumber,
  NSpin,
  UploadCustomRequestOptions,
  useMessage,
  UploadFileInfo,
} from 'naive-ui'
import { useEthers } from 'vue-dapp'
import { ethers } from 'ethers'
import { Api } from '@/common/net'
import i18n from '@/i18n'
import util from '@/common/utils/common-util'
import SelectSymbol from './select-symbol.vue'
import emitter from '@/emitter'
import { useStore } from '@/store'
import DialogOtherToken from './dialog-other-token.vue'
import DialogAfterMint from './dialog-after-mint.vue'
import ERC20Util from '@/common/utils/erc20'
import { PinIPFS } from '@/types/pin-ipfs'
import 'animate.css'
import {
  useMintSingle,
  useMintMultiple,
  useMintSingleERC20,
  useMintMultipleERC20,
} from './use-mint'

let message = useMessage()
const store = useStore()
const { signer } = useEthers()

type MintType = 'ETH' | 'ERC20'

let imageHash = ref('')
let nftName = ref('')
let nftPrice = ref('')
let jsonUrl = ref('')
let symbol = ref('ETH')
let mintType: Ref<MintType> = ref('ETH')

// erc20
let erc20Address = ref('')
let erc20Decimals = ref(0)

let amount = ref(1)
let lastTokenId = ref(0)

let mintErc20 = ref(false)
let mintIng = ref(false)
let bulk = ref(false)
let uploadSuccess = ref(false)
let loading = ref(false)

// dialog
let otherTokenDialog = ref<any>(null)
let afterMintDialog = ref<any>(null)

function mint() {
  if (!uploadSuccess.value) {
    message.error(i18n.global.t('error.please_upload_image'))
    return
  }
  mintIng.value = true

  let pinJson: PinIPFS = {
    name: nftName.value,
    description: nftName.value,
    image: `ipfs://${imageHash.value}`,
    attributes: [
      {
        trait_type: 'castable_value',
        value: ethers.utils.parseEther(nftPrice.value).toString(),
      },
    ],
  }
  if (mintType.value === 'ERC20') {
    pinJson.attributes?.push({
      castable_address: erc20Address.value,
    })
    pinJson.attributes?.push({
      castable_standard: 'ERC20',
    })
  }
  console.log(pinJson)
  // 开始上传 JSON
  Api.uploadJson(pinJson)
    .then(async (res: any) => {
      console.log(res)
      jsonUrl.value = `ipfs://${res.IpfsHash}`
      try {
        if (bulk.value) {
          // 铸造多个
          if (mintErc20.value) {
            // erc20
            await useMintMultipleERC20(
              { address: erc20Address },
              { decimals: erc20Decimals },
              { jsonUrl: jsonUrl },
              { price: nftPrice },
              { amount: amount }
            )
          } else {
            // eth
            await useMintMultiple(
              { jsonUrl: jsonUrl },
              { price: nftPrice },
              { amount: amount }
            )
          }
          mintSuccess()
        } else {
          // 铸造单个
          if (mintErc20.value) {
            // erc20
            lastTokenId.value = await useMintSingleERC20(
              { address: erc20Address },
              { decimals: erc20Decimals },
              { jsonUrl: jsonUrl },
              { price: nftPrice }
            )
          } else {
            // eth
            lastTokenId.value = await useMintSingle(
              { jsonUrl: jsonUrl },
              { price: nftPrice }
            )
          }
          afterMintDialog.value.show()
          mintSuccess()
        }
      } catch (e) {
        mintFail(e)
      }
    })
    .catch((err: any) => {
      console.log(err)
      message.error(i18n.global.t('error.upload_image_error'))
      mintIng.value = false
    })
}

function mintSuccess() {
  message.success(i18n.global.t('sucess.mint_success'))
  mintIng.value = false
}

function mintFail(e: any) {
  console.log(e)
  message.error(e.message)
  mintIng.value = false
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

// 监听切换代币
emitter.on('changeSymbol', async (val) => {
  if (signer.value === null) {
    return
  }
  if (val === 'ETH') {
    mintErc20.value = false
    mintType.value = 'ETH'
  } else {
    mintErc20.value = true
  }
  if (val === 'Other Token') {
    otherTokenDialog.value.show()
    return
  }
  loading.value = true

  let _erc20Address = ERC20Util.getAddress(val)
  let _erc20Decimals = ERC20Util.getDecimals(val)

  if (_erc20Address !== undefined && _erc20Decimals !== undefined) {
    erc20Address.value = _erc20Address
    erc20Decimals.value = _erc20Decimals
    symbol.value = val
    loading.value = false
    store.setSymbol(val)
    mintType.value = 'ERC20'
    return
  }
})

emitter.on('searchContractResult', (res) => {
  erc20Address.value = res.address
  erc20Decimals.value = res.decimals
  symbol.value = res.symbol
  store.setSymbol(res.symbol)
  mintType.value = 'ERC20'
})
</script>

<template>
  <n-spin :show="loading">
    <div id="mint-card">
      <div id="left">
        <div id="title-div">
          <a id="title">{{ $t('home.title') }}</a>
          <a>{{ $t('home.subtitle') }}</a>
        </div>
        <div id="input-name-div">
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
            <div
              style="
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-right: 0;
                height: 6vh;
                padding-bottom: 16px;
                justify-content: center;
                align-items: center;
              "
            >
              <img width="48" height="48" :src="util.getSrc('upload.svg')" />
              {{ $t('home.upload') }}
            </div>
          </n-upload-dragger>
        </n-upload>
        <div style="display: flex; flex-direction: row; align-items: center">
          <n-input
            v-model:value="nftPrice"
            type="text"
            maxlength="8"
            :placeholder="$t('home.input.placeholder_2', ['ETH'])"
            style="width: 100%; margin-right: 0"
          >
            <template #suffix> <select-symbol /> </template
          ></n-input>
        </div>
        <n-collapse arrow-placement="right" :style="{ 'margin-top': '40px' }">
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
          id="mint-button"
          color="#8FDBFD"
          :loading="mintIng"
          type="primary"
          text-color="#000"
          @click="mint"
        >
          {{ $t('home.mint_now') }}
        </n-button>
      </div>
      <div id="right">
        <img width="250" :src="util.getSrc('right.svg')" />
      </div>
    </div>
  </n-spin>
  <dialog-other-token ref="otherTokenDialog" />
  <dialog-after-mint ref="afterMintDialog" />
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
  justify-content: center;
}

#input-name-div {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#mint-button {
  width: 100%;
  margin-top: 60px;
  margin-bottom: 36px;
  background-image: linear-gradient(to bottom right, #d6f2ff, #8edbfd);
}

@media screen and (max-width: 1100px) {
  #right {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  #input-name-div {
    flex-direction: column;
    align-items: flex-start;
  }

  #left {
    padding-right: 32px;
  }

  #mint-card {
    padding-left: 32px;
  }
}
</style>
