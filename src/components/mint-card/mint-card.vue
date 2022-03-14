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
import { useEthers, ERC20 } from 'vue-dapp'
import { BigNumber, ethers } from 'ethers'
import { Api } from '@/common/net'
import Constants from '@/common/data/constants'
import i18n from '@/i18n'
import util from '@/common/utils/common-util'
import SelectSymbol from './select-symbol.vue'
import emitter from '@/emitter'
import { useStore } from '@/store'
import DialogOtherToken from './dialog-other-token.vue'
import ERC20Util from '@/common/utils/erc20'
import { PinIPFS } from '@/types/pin-ipfs'

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
    .then((res: any) => {
      console.log(res)
      jsonUrl.value = `ipfs://${res.IpfsHash}`
      if (bulk.value) {
        // 铸造多个
        if (mintErc20.value) {
          // erc20
          mintMultipleERC20()
        } else {
          // eth
          mintMultiple()
        }
      } else {
        if (mintErc20.value) {
          // erc20
          mintSingleERC20()
        } else {
          // eth
          mintSingle()
        }
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
              afterMintDialog.value.show()
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
        .mintAvg(jsonUrl.value, amount.value, 0, {
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
              afterMintDialog.value.show()
              mintIng.value = false
            })
            .catch((err: Error) => {
              message.error(err.message)
              console.log(err)
              mintIng.value = false
            })
        })
        .catch((err: Error) => {
          message.error(err.message)
          console.log(err)
          mintIng.value = false
        })
    })
}

// 铸造单个 ERC20
function mintSingleERC20() {
  if (signer.value === null) {
    return
  }
  // 代币合约
  let _erc20Contract = new ethers.Contract(
    erc20Address.value,
    ERC20.abi,
    signer.value
  )
  _erc20Contract.estimateGas
    .approve(
      Constants.CONTRACT_ADDRESS,
      BigNumber.from(parseFloat(nftPrice.value) * 10 ** erc20Decimals.value)
    )
    .then(async (gas) => {
      // 允许调用资产
      let tx = await _erc20Contract.approve(
        Constants.CONTRACT_ADDRESS,
        BigNumber.from(parseFloat(nftPrice.value) * 10 ** erc20Decimals.value),
        {
          gasLimit: gas.add(BigNumber.from(10000)),
        }
      )
      let res = await tx.wait()
      if (res && signer.value !== null) {
        // 开始铸造
        let _contract = new ethers.Contract(
          Constants.CONTRACT_ADDRESS,
          Constants.CONTRACT_ABI,
          signer.value
        )
        let gas = await _contract.estimateGas.mintByERC20(
          erc20Address.value,
          BigNumber.from(
            parseFloat(nftPrice.value) * 10 ** erc20Decimals.value
          ),
          jsonUrl.value,
          0
        )
        _contract
          .mintByERC20(
            erc20Address.value,
            BigNumber.from(
              parseFloat(nftPrice.value) * 10 ** erc20Decimals.value
            ),
            jsonUrl.value,
            0,
            {
              gasLimit: gas.add(BigNumber.from(10000)),
            }
          )
          .then((tx: any) => {
            tx.wait().then((res: any) => {
              message.success(i18n.global.t('sucess.mint_success'))
              mintIng.value = false
            })
          })
      }
    })
    .catch((err: Error) => {
      message.error(err.message)
      mintIng.value = false
    })
}

// 铸造多个 ERC20
function mintMultipleERC20() {
  if (signer.value === null) {
    return
  }
  // 代币合约
  let _erc20Contract = new ethers.Contract(
    erc20Address.value,
    ERC20.abi,
    signer.value
  )
  _erc20Contract.estimateGas
    .approve(
      Constants.CONTRACT_ADDRESS,
      BigNumber.from(
        parseFloat(nftPrice.value) * 10 ** erc20Decimals.value
      ).mul(amount.value)
    )
    .then(async (gas) => {
      // 允许调用资产
      let tx = await _erc20Contract.approve(
        Constants.CONTRACT_ADDRESS,
        BigNumber.from(
          parseFloat(nftPrice.value) * 10 ** erc20Decimals.value
        ).mul(amount.value),
        {
          gasLimit: gas.add(BigNumber.from(10000)),
        }
      )
      let res = await tx.wait()
      if (res && signer.value !== null) {
        // 开始铸造
        let _contract = new ethers.Contract(
          Constants.CONTRACT_ADDRESS,
          Constants.CONTRACT_ABI,
          signer.value
        )
        let gas = await _contract.estimateGas.mintByERC20Avg(
          erc20Address.value,
          jsonUrl.value,
          BigNumber.from(
            parseFloat(nftPrice.value) * 10 ** erc20Decimals.value
          ).mul(amount.value),
          amount.value,
          0
        )
        _contract
          .mintByERC20Avg(
            erc20Address.value,
            jsonUrl.value,
            BigNumber.from(
              parseFloat(nftPrice.value) * 10 ** erc20Decimals.value
            ).mul(amount.value),
            amount.value,
            0,
            {
              gasLimit: gas.add(BigNumber.from(10000)),
            }
          )
          .then((tx: any) => {
            tx.wait().then((res: any) => {
              message.success(i18n.global.t('sucess.mint_success'))
              mintIng.value = false
            })
          })
      }
    })
    .catch((err: Error) => {
      message.error(err.message)
      console.log(err.message)
      mintIng.value = false
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
            :placeholder="$t('home.input.placeholder_2', [symbol])"
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
  <!-- <dialog-after-mint ref="afterMintDialog" /> -->
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
