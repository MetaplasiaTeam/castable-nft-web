<script setup lang="ts">
import { watch } from 'vue'
import {
  useBoard,
  useEthers,
  useWallet,
  shortenAddress,
  Metamask,
  MetaMaskProvider,
} from 'vue-dapp'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import i18n from '@/i18n'
import { NButton } from 'naive-ui'
import { Contract } from 'ethers'
import Constants from '@/common/data/constants'

const { open } = useBoard()
const { disconnect, provider } = useWallet()
const { address, isActivated, signer, network } = useEthers()
const store = useStore()
const router = useRouter()

async function connectWeb3() {
  if (isActivated.value) {
    disconnect()
  } else {
    open()
  }
}

function toProfile() {
  if (!isActivated.value) {
    open()
  } else {
    router.push('/profile')
  }
}

watch(address, async (address) => {
  if (address !== null && address !== undefined && signer.value !== null) {
    store.setWeb3Address(address)
  }
})

watch(isActivated, async (val) => {
  if (val) {
    store.setTopbarButtonText(shortenAddress(address.value))
    switchNetwork()
  } else {
    store.setTopbarButtonText(i18n.global.t('connect'))
  }
})

// chainId: string;
//     chainName: string;
//     nativeCurrency: {
//         name?: string;
//         symbol: string;
//         decimals: number;
//     };
//     rpcUrls: string[];
//     blockExplorerUrls?: string[];
//     iconUrls?: string[];

async function switchNetwork() {
  if (
    Constants.CONTRACT_ADDRESS == '0xb55C74905572A47DE02167D19687d495Fc2C3F1b'
  ) {
    await Metamask.addChain(provider.value as MetaMaskProvider, {
      chainId: '0x61',
      chainName: 'BSC Testnet',
      nativeCurrency: {
        symbol: 'tBNB',
        decimals: 18,
      },
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    })
    await Metamask.switchChain(provider.value as MetaMaskProvider, 0x61)
    Metamask.connect()
  } else {
    await Metamask.addChain(provider.value as MetaMaskProvider, {
      chainId: '0x01',
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://mainnet.infura.io/v3/'],
      blockExplorerUrls: ['https://etherscan.io'],
    })
    await Metamask.switchChain(provider.value as MetaMaskProvider, 0x01)
    Metamask.connect()
  }
}
</script>

<template>
  <div id="buttons">
    <button
      class="nft-button"
      id="pdf"
      @click="router.push('/faq')"
      text-color="#fff"
    >
      FAQ
    </button>

    <button class="nft-button" @click="toProfile" text-color="#fff">
      {{ $t('profile') }}
    </button>

    <!-- <n-dropdown trigger="hover" :options="language" @select="languageSelect">
        <n-tag checkable>{{ $t('language') }}</n-tag>
      </n-dropdown> -->

    <n-button
      id="connect"
      color="#8FDBFD"
      @click="connectWeb3"
      type="primary"
      text-color="#000000"
      round
    >
      {{ store.topbarButtonText }}
    </n-button>
  </div>
</template>

<style scoped>
#buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#connect {
  background: linear-gradient(110deg, #f7ffff, #8edbfd, #f85a02);
}
#pdf {
  background-image: linear-gradient(#19191a, #19191a),
    linear-gradient(#7f8fa6, #7f8fa6);
}
.nft-button {
  border: none;
  cursor: pointer;
  line-height: 1;
  font-size: 14px;
  height: 34px;
  padding: 18px;
  width: 110px;
  box-sizing: border-box;
  background-image: linear-gradient(#000, #000),
    linear-gradient(110deg, #f7ffff, #8edbfd, #f85a02);
  font-weight: 400;
  color: #fff;
  padding: 2px;
  border-radius: 34px;
  background-clip: content-box, padding-box;
  transition: filter 0.5s ease;
  margin-right: 18px;
}

@media screen and (max-width: 768px) {
  #buttons {
    background: #19191a;
    flex-direction: column;
    align-items: space-between;
    height: 150px;
  }
}
</style>
