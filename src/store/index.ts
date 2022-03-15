import i18n from '@/i18n'
import { createPinia, defineStore } from 'pinia'
import { NFTItemProps } from '@/components/nft-item'
import { IERC20 } from '@/common/data/erc20'

export const pinia = createPinia()

export const useStore = defineStore({
  id: 'store',
  state: () => ({
    web3address: '',
    topbarButtonText: i18n.global.t('connect'),
    nftList: Array<NFTItemProps>(),
    symbol: 'ETH',
    tokenCache: Array<IERC20>(),
    currIpfs: 0,
    showNftSkeleton: true,
  }),
  actions: {
    setWeb3Address(address: string) {
      this.web3address = address
    },
    setTopbarButtonText(text: string) {
      this.topbarButtonText = text
    },
    setNftList(data: NFTItemProps[]) {
      this.nftList = data
    },
    setSymbol(symbol: string) {
      this.symbol = symbol
    },
    addTokenCache(data: IERC20) {
      this.tokenCache.push(data)
    },
    setCurrIpfs(ipfs: number) {
      this.currIpfs = ipfs
    },
    setShowNftSkeleton(show: boolean) {
      this.showNftSkeleton = show
    },
  },
})
